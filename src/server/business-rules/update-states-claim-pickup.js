// @ts-nocheck
/* eslint-disable no-undef */
/**
 * Business Rule: Update States on Claim Pickup
 * When a claim state changes to "picked_up":
 *   - Update the match to "confirmed" if not already
 *   - Update the lost item to "claimed"
 *   - Update the found item to "claimed"
 *   - Close (expire/reject) any other pending matches for the same items
 */
(function executeRule(current, previous) {
    var matchId = current.getValue('match');
    if (!matchId) return;

    // Get the match record
    var matchGr = new GlideRecord('x_1927922_campus_l_match');
    if (!matchGr.get(matchId)) return;

    // Update match to "confirmed" if not already
    var matchState = matchGr.getValue('state');
    if (matchState !== 'confirmed') {
        matchGr.setValue('state', 'confirmed');
        matchGr.update();
    }

    var lostItemId = matchGr.getValue('lost_item');
    var foundItemId = matchGr.getValue('found_item');

    // Update lost item state to "claimed"
    if (lostItemId) {
        var lostGr = new GlideRecord('x_1927922_campus_l_lost_item');
        if (lostGr.get(lostItemId)) {
            lostGr.setValue('state', 'claimed');
            lostGr.update();
        }
    }

    // Update found item state to "claimed"
    if (foundItemId) {
        var foundGr = new GlideRecord('x_1927922_campus_l_found_item');
        if (foundGr.get(foundItemId)) {
            foundGr.setValue('state', 'claimed');
            foundGr.update();
        }
    }

    // Close any other pending/reviewing matches for the same lost or found items
    var pendingMatches = new GlideRecord('x_1927922_campus_l_match');
    pendingMatches.addQuery('sys_id', '!=', matchGr.getUniqueValue());
    pendingMatches.addQuery('state', 'IN', 'pending,reviewing');

    var qc = pendingMatches.addQuery('lost_item', lostItemId);
    qc.addOrCondition('found_item', foundItemId);

    pendingMatches.query();

    while (pendingMatches.next()) {
        var pendingState = pendingMatches.getValue('state');
        if (pendingState === 'pending') {
            pendingMatches.setValue('state', 'expired');
        } else if (pendingState === 'reviewing') {
            pendingMatches.setValue('state', 'rejected');
        }
        pendingMatches.update();
    }
})(current, previous);
