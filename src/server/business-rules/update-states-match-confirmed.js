// @ts-nocheck
/* eslint-disable no-undef */
/**
 * Business Rule: Update States on Match Confirmed
 * When a match state changes to "confirmed", update the lost item
 * and found item states to "matched".
 */
(function executeRule(current, previous) {
    var lostItemId = current.getValue('lost_item');
    var foundItemId = current.getValue('found_item');

    // Update lost item state to "matched"
    if (lostItemId) {
        var lostGr = new GlideRecord('x_1927922_campus_l_lost_item');
        if (lostGr.get(lostItemId)) {
            var lostState = lostGr.getValue('state');
            if (lostState !== 'matched' && lostState !== 'claimed') {
                lostGr.setValue('state', 'matched');
                lostGr.update();
            }
        }
    }

    // Update found item state to "matched"
    if (foundItemId) {
        var foundGr = new GlideRecord('x_1927922_campus_l_found_item');
        if (foundGr.get(foundItemId)) {
            var foundState = foundGr.getValue('state');
            if (foundState !== 'matched' && foundState !== 'claimed') {
                foundGr.setValue('state', 'matched');
                foundGr.update();
            }
        }
    }
})(current, previous);
