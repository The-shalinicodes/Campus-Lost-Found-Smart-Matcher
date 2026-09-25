// @ts-nocheck
/* eslint-disable no-undef */
/**
 * MatchEngine - Smart matching algorithm for Campus Lost & Found.
 *
 * Compares lost items against found items using category, location,
 * timeline, and description similarity.  Creates match records for
 * any pair whose confidence score exceeds 40%.
 *
 * NOTE: This is a Script Include (Class.create pattern).
 *       Glide APIs (gs, GlideRecord, GlideDateTime, etc.) are
 *       auto-available — do NOT import them.
 */
var MatchEngine = Class.create();
MatchEngine.prototype = {
    initialize: function () {},

    // =========================================================================
    // Public API
    // =========================================================================

    /**
     * Find matches for a lost item against all found items in "cataloged" state.
     * Transitions the lost item to "searching" if it is currently "new".
     * @param {string} lostItemSysId - sys_id of the lost item record
     */
    findMatchesForLostItem: function (lostItemSysId) {
        var lostGr = new GlideRecord('x_1927922_campus_l_lost_item');
        if (!lostGr.get(lostItemSysId)) {
            gs.error('MatchEngine: Lost item not found: ' + lostItemSysId);
            return;
        }

        // Mark lost item as "searching" if currently "new"
        if (lostGr.getValue('state') === 'new') {
            lostGr.setValue('state', 'searching');
            lostGr.update();
        }

        // Search all found items in "cataloged" state
        var foundGr = new GlideRecord('x_1927922_campus_l_found_item');
        foundGr.addQuery('state', 'cataloged');
        foundGr.query();

        while (foundGr.next()) {
            var result = this.computeConfidenceScore(lostGr, foundGr);
            if (result.confidence_score > 40) {
                this._createMatchRecord(lostGr, foundGr, result);
            }
        }
    },

    /**
     * Find matches for a found item against all lost items in "new" or
     * "searching" state.  Transitions each qualifying lost item to
     * "searching" if it is still "new".
     * @param {string} foundItemSysId - sys_id of the found item record
     */
    findMatchesForFoundItem: function (foundItemSysId) {
        var foundGr = new GlideRecord('x_1927922_campus_l_found_item');
        if (!foundGr.get(foundItemSysId)) {
            gs.error('MatchEngine: Found item not found: ' + foundItemSysId);
            return;
        }

        // Search all lost items in "new" or "searching" state
        var lostGr = new GlideRecord('x_1927922_campus_l_lost_item');
        lostGr.addQuery('state', 'IN', 'new,searching');
        lostGr.query();

        while (lostGr.next()) {
            // Mark lost item as "searching" if currently "new"
            if (lostGr.getValue('state') === 'new') {
                lostGr.setValue('state', 'searching');
                lostGr.update();
            }

            var result = this.computeConfidenceScore(lostGr, foundGr);
            if (result.confidence_score > 40) {
                this._createMatchRecord(lostGr, foundGr, result);
            }
        }
    },

    /**
     * Compute confidence score between a lost item and a found item.
     * @param {GlideRecord} lostItem  - Lost item GlideRecord
     * @param {GlideRecord} foundItem - Found item GlideRecord
     * @returns {Object} Score breakdown and reasoning
     */
    computeConfidenceScore: function (lostItem, foundItem) {
        var categoryScore = this._computeCategoryScore(lostItem, foundItem);
        var locationScore = this._computeLocationScore(lostItem, foundItem);
        var timelineScore = this._computeTimelineScore(lostItem, foundItem);
        var descriptionScore = this._computeDescriptionScore(lostItem, foundItem);

        // Weighted average: category(30%) + location(25%) + timeline(25%) + description(20%)
        var confidenceScore = Math.round(
            categoryScore * 0.30 +
            locationScore * 0.25 +
            timelineScore * 0.25 +
            descriptionScore * 0.20
        );

        // Build AI reasoning text
        var reasoning = 'Score Breakdown: ' +
            'Category=' + categoryScore + '/100 (30% weight), ' +
            'Location=' + locationScore + '/100 (25% weight), ' +
            'Timeline=' + timelineScore + '/100 (25% weight), ' +
            'Description=' + descriptionScore + '/100 (20% weight). ' +
            'Overall Confidence=' + confidenceScore + '%.';

        if (categoryScore === 100) {
            reasoning += ' Categories match exactly (' + lostItem.getValue('category') + ').';
        } else {
            reasoning += ' Categories differ (lost: ' +
                (lostItem.getValue('category') || 'none') +
                ', found: ' + (foundItem.getValue('category') || 'none') + ').';
        }

        if (locationScore >= 80) {
            reasoning += ' Items are in the same building/floor area.';
        } else if (locationScore > 0) {
            reasoning += ' Items are in nearby but different locations.';
        } else {
            reasoning += ' Location data insufficient or items are far apart.';
        }

        if (timelineScore >= 80) {
            reasoning += ' Found date is very close to the last seen date.';
        } else if (timelineScore >= 40) {
            reasoning += ' Found date is within a week of last seen date.';
        } else if (timelineScore > 0) {
            reasoning += ' Found date is within two weeks of last seen date.';
        } else {
            reasoning += ' Dates are too far apart or missing.';
        }

        if (descriptionScore >= 60) {
            reasoning += ' Descriptions have strong word overlap.';
        } else if (descriptionScore >= 30) {
            reasoning += ' Descriptions have moderate word overlap.';
        } else if (descriptionScore > 0) {
            reasoning += ' Descriptions have minimal word overlap.';
        }

        return {
            category_score: categoryScore,
            location_score: locationScore,
            timeline_score: timelineScore,
            description_score: descriptionScore,
            confidence_score: confidenceScore,
            ai_reasoning: reasoning
        };
    },

    /**
     * Generate a unique 8-character alphanumeric claim code.
     * Retries if the generated code already exists in the match table.
     * @returns {string} Unique claim code (e.g. "A3X7K9P2")
     */
    generateClaimCode: function () {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var code = '';
        for (var i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Verify uniqueness against existing match records
        var gr = new GlideRecord('x_1927922_campus_l_match');
        gr.addQuery('claim_code', code);
        gr.setLimit(1);
        gr.query();
        if (gr.hasNext()) {
            return this.generateClaimCode();
        }

        return code;
    },

    // =========================================================================
    // Private Scoring Methods
    // =========================================================================

    /**
     * Category score: 100 if exact match, 0 otherwise.
     */
    _computeCategoryScore: function (lostItem, foundItem) {
        var lostCat = lostItem.getValue('category') || '';
        var foundCat = foundItem.getValue('category') || '';
        if (lostCat && foundCat && lostCat === foundCat) {
            return 100;
        }
        return 0;
    },

    /**
     * Location score based on building, floor, or geographic proximity.
     * Same location ref = 100, same building+floor = 100, same building = 80,
     * then Haversine distance scoring.
     */
    _computeLocationScore: function (lostItem, foundItem) {
        var lostLocRef = lostItem.getValue('last_seen_location');
        var foundLocRef = foundItem.getValue('found_location');

        if (!lostLocRef || !foundLocRef) {
            return 0;
        }

        // Same location record = perfect match
        if (lostLocRef === foundLocRef) {
            return 100;
        }

        var lostLoc = new GlideRecord('x_1927922_campus_l_location');
        if (!lostLoc.get(lostLocRef)) return 0;

        var foundLoc = new GlideRecord('x_1927922_campus_l_location');
        if (!foundLoc.get(foundLocRef)) return 0;

        var lostBuilding = (lostLoc.getValue('building') || '').toLowerCase();
        var foundBuilding = (foundLoc.getValue('building') || '').toLowerCase();
        var lostFloor = (lostLoc.getValue('floor') || '').toLowerCase();
        var foundFloor = (foundLoc.getValue('floor') || '').toLowerCase();

        // Same building
        if (lostBuilding && foundBuilding && lostBuilding === foundBuilding) {
            if (lostFloor && foundFloor && lostFloor === foundFloor) {
                return 100; // Same building + same floor
            }
            return 80; // Same building, different floor
        }

        // Fall back to lat/lng proximity using Haversine formula
        var lostLat = parseFloat(lostLoc.getValue('latitude'));
        var lostLng = parseFloat(lostLoc.getValue('longitude'));
        var foundLat = parseFloat(foundLoc.getValue('latitude'));
        var foundLng = parseFloat(foundLoc.getValue('longitude'));

        if (!isNaN(lostLat) && !isNaN(lostLng) && !isNaN(foundLat) && !isNaN(foundLng)) {
            var distance = this._haversineDistance(lostLat, lostLng, foundLat, foundLng);
            // Inversely proportional to distance (meters)
            if (distance <= 50) return 100;
            if (distance <= 100) return 80;
            if (distance <= 250) return 60;
            if (distance <= 500) return 40;
            if (distance <= 1000) return 20;
            return 0;
        }

        return 0;
    },

    /**
     * Calculate great-circle distance in meters using the Haversine formula.
     */
    _haversineDistance: function (lat1, lon1, lat2, lon2) {
        var R = 6371000; // Earth radius in meters
        var dLat = this._toRadians(lat2 - lat1);
        var dLon = this._toRadians(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRadians(lat1)) *
                Math.cos(this._toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    _toRadians: function (degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Timeline score based on date proximity.
     * Same day = 100, within 1 day = 80, 3 days = 60, 7 = 40, 14 = 20, else 0.
     */
    _computeTimelineScore: function (lostItem, foundItem) {
        var lastSeenStr = lostItem.getValue('last_seen_date');
        var foundDateStr = foundItem.getValue('found_date');

        if (!lastSeenStr || !foundDateStr) {
            return 0;
        }

        // Ensure date-time format for GlideDateTime constructor
        var lastSeenDT = lastSeenStr;
        var foundDateDT = foundDateStr;
        if (lastSeenDT.length === 10) lastSeenDT += ' 00:00:00';
        if (foundDateDT.length === 10) foundDateDT += ' 00:00:00';

        var lastSeen = new GlideDateTime(lastSeenDT);
        var foundDate = new GlideDateTime(foundDateDT);

        // Calculate absolute difference in days
        var diffMs = Math.abs(lastSeen.getNumericValue() - foundDate.getNumericValue());
        var days = diffMs / (1000 * 60 * 60 * 24);

        if (days < 1) return 100;   // Same day
        if (days <= 1) return 80;   // Within 1 day
        if (days <= 3) return 60;   // Within 3 days
        if (days <= 7) return 40;   // Within 7 days
        if (days <= 14) return 20;  // Within 14 days
        return 0;                   // Beyond 14 days
    },

    /**
     * Description score based on word overlap between short_description,
     * color, brand, and distinguishing_features.
     * score = (matching unique words / total unique words) * 100
     */
    _computeDescriptionScore: function (lostItem, foundItem) {
        var lostText = [
            lostItem.getValue('short_description') || '',
            lostItem.getValue('color') || '',
            lostItem.getValue('brand') || '',
            lostItem.getValue('distinguishing_features') || ''
        ].join(' ').toLowerCase();

        var foundText = [
            foundItem.getValue('short_description') || '',
            foundItem.getValue('color') || '',
            foundItem.getValue('brand') || '',
            foundItem.getValue('distinguishing_features') || ''
        ].join(' ').toLowerCase();

        var lostWords = this._tokenize(lostText);
        var foundWords = this._tokenize(foundText);

        if (lostWords.length === 0 && foundWords.length === 0) {
            return 0;
        }

        // Build unique word sets
        var lostSet = {};
        var foundSet = {};
        var allWords = {};
        var i, j;

        for (i = 0; i < lostWords.length; i++) {
            lostSet[lostWords[i]] = true;
            allWords[lostWords[i]] = true;
        }

        for (j = 0; j < foundWords.length; j++) {
            foundSet[foundWords[j]] = true;
            allWords[foundWords[j]] = true;
        }

        // Count matching words (intersection of sets)
        var matchCount = 0;
        for (var word in lostSet) {
            if (lostSet.hasOwnProperty(word) && foundSet[word]) {
                matchCount++;
            }
        }

        // Count total unique words (union of sets)
        var totalUnique = 0;
        for (var key in allWords) {
            if (allWords.hasOwnProperty(key)) {
                totalUnique++;
            }
        }

        if (totalUnique === 0) return 0;

        return Math.round((matchCount / totalUnique) * 100);
    },

    /**
     * Tokenize text into meaningful lowercase words, removing stop words
     * and single-character tokens.
     */
    _tokenize: function (text) {
        if (!text) return [];
        var words = text.split(/[^a-z0-9]+/);
        var stopWords = {
            'a': true, 'an': true, 'the': true, 'is': true, 'it': true,
            'in': true, 'on': true, 'at': true, 'to': true, 'of': true,
            'and': true, 'or': true, 'my': true, 'i': true, 'with': true,
            'has': true, 'was': true, 'for': true, 'that': true, 'this': true,
            'be': true, 'are': true, 'were': true, 'been': true, 'have': true,
            'from': true, 'its': true, 'not': true, 'but': true, 'had': true
        };
        var result = [];
        for (var idx = 0; idx < words.length; idx++) {
            if (words[idx].length > 1 && !stopWords[words[idx]]) {
                result.push(words[idx]);
            }
        }
        return result;
    },

    // =========================================================================
    // Private Record Helpers
    // =========================================================================

    /**
     * Create a match record linking a lost item to a found item.
     * Skips if an active match already exists for the same pair.
     * Auto-transitions to "reviewing" if confidence >= 70.
     */
    _createMatchRecord: function (lostItem, foundItem, scores) {
        // Check for existing active match between these items
        var existing = new GlideRecord('x_1927922_campus_l_match');
        existing.addQuery('lost_item', lostItem.getUniqueValue());
        existing.addQuery('found_item', foundItem.getUniqueValue());
        existing.addQuery('state', 'IN', 'pending,reviewing');
        existing.setLimit(1);
        existing.query();
        if (existing.hasNext()) {
            return; // Active match already exists — skip
        }

        var matchGr = new GlideRecord('x_1927922_campus_l_match');
        matchGr.initialize();
        matchGr.setValue('lost_item', lostItem.getUniqueValue());
        matchGr.setValue('found_item', foundItem.getUniqueValue());
        matchGr.setValue('confidence_score', scores.confidence_score);
        matchGr.setValue('category_score', scores.category_score);
        matchGr.setValue('location_score', scores.location_score);
        matchGr.setValue('timeline_score', scores.timeline_score);
        matchGr.setValue('description_score', scores.description_score);
        matchGr.setValue('ai_reasoning', scores.ai_reasoning);

        // Insert with default "pending" state (set by table default + state model)
        var matchSysId = matchGr.insert();

        // Auto-transition high-confidence matches to "reviewing" via update
        if (scores.confidence_score >= 70 && matchSysId) {
            var updateGr = new GlideRecord('x_1927922_campus_l_match');
            if (updateGr.get(matchSysId)) {
                updateGr.setValue('state', 'reviewing');
                updateGr.update();
            }
        }
    },

    type: 'MatchEngine'
};
