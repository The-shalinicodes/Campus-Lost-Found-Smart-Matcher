// @ts-nocheck
/* eslint-disable no-undef */
/**
 * Business Rule: Trigger Match on Cataloged Found Item
 * Fires after insert/update on x_1927922_campus_l_found_item when state = "cataloged".
 * Calls MatchEngine to find matching lost items.
 */
(function executeRule(current, previous) {
    var engine = new MatchEngine();
    engine.findMatchesForFoundItem(current.getUniqueValue());
})(current, previous);
