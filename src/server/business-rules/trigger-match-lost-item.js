// @ts-nocheck
/* eslint-disable no-undef */
/**
 * Business Rule: Trigger Match on New Lost Item
 * Fires after insert on x_1927922_campus_l_lost_item when state = "new".
 * Calls MatchEngine to find matching found items.
 */
(function executeRule(current, previous) {
    var engine = new MatchEngine();
    engine.findMatchesForLostItem(current.getUniqueValue());
})(current, previous);
