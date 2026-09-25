import '@servicenow/sdk/global'
import { ScriptInclude, BusinessRule } from '@servicenow/sdk/core'

// =============================================================================
// Match Engine – Script Include
// =============================================================================
ScriptInclude({
    $id: Now.ID['MatchEngine'],
    name: 'MatchEngine',
    script: Now.include('../server/script-includes/match-engine.js'),
    description: 'Core matching engine that compares lost and found items to generate potential matches',
    accessibleFrom: 'package_private',
})

// =============================================================================
// Business Rules – Match Triggering & State Cascading
// =============================================================================

// 1. Trigger Match on New Lost Item (async insert on lost_item)
BusinessRule({
    $id: Now.ID['br-trigger-match-lost-item'],
    name: 'Trigger Match on New Lost Item',
    table: 'x_1927922_campus_l_lost_item',
    when: 'async',
    action: ['insert'],
    filterCondition: 'state=new^EQ',
    priority: 200,
    script: Now.include('../server/business-rules/trigger-match-lost-item.js'),
})

// 2. Trigger Match on Cataloged Found Item (async insert/update on found_item)
BusinessRule({
    $id: Now.ID['br-trigger-match-found-item'],
    name: 'Trigger Match on Cataloged Found Item',
    table: 'x_1927922_campus_l_found_item',
    when: 'async',
    action: ['insert', 'update'],
    filterCondition: 'state=cataloged^EQ',
    priority: 200,
    script: Now.include('../server/business-rules/trigger-match-found-item.js'),
})

// 3. Generate Claim Code on Match (before insert on match)
BusinessRule({
    $id: Now.ID['br-generate-claim-code'],
    name: 'Generate Claim Code on Match',
    table: 'x_1927922_campus_l_match',
    when: 'before',
    action: ['insert'],
    order: 200,
    script: Now.include('../server/business-rules/generate-claim-code.js'),
})

// 4. Update States on Match Confirmed (after update on match)
BusinessRule({
    $id: Now.ID['br-update-states-match-confirmed'],
    name: 'Update States on Match Confirmed',
    table: 'x_1927922_campus_l_match',
    when: 'after',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^state=confirmed^EQ',
    order: 200,
    script: Now.include('../server/business-rules/update-states-match-confirmed.js'),
})

// 5. Update States on Claim Pickup (after update on claim)
BusinessRule({
    $id: Now.ID['br-update-states-claim-pickup'],
    name: 'Update States on Claim Pickup',
    table: 'x_1927922_campus_l_claim',
    when: 'after',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^state=picked_up^EQ',
    order: 200,
    script: Now.include('../server/business-rules/update-states-claim-pickup.js'),
})
