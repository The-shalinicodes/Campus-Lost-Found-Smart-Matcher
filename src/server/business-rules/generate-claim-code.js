// @ts-nocheck
/* eslint-disable no-undef */
/**
 * Business Rule: Generate Claim Code on Match
 * Fires before insert on x_1927922_campus_l_match.
 * Auto-generates a unique 8-character claim code using MatchEngine.
 */
(function executeRule(current, previous) {
    if (!current.getValue('claim_code')) {
        var engine = new MatchEngine();
        var code = engine.generateClaimCode();
        current.setValue('claim_code', code);
    }
})(current, previous);
