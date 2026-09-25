import '@servicenow/sdk/global'
import { StateModel, BusinessRule } from '@servicenow/sdk/core'

// =============================================================================
// 1. Lost Item Lifecycle
// new → searching → matched → claimed → closed | expired
// =============================================================================
StateModel({
    $id: Now.ID['lost-item-state-model'],
    name: 'Lost Item Lifecycle',
    table: 'x_1927922_campus_l_lost_item',
    stateField: 'state',
    states: {
        new: { $id: Now.ID['li-state-new'], label: 'New', value: 'new', initial: true, sequence: 0 },
        searching: { $id: Now.ID['li-state-searching'], label: 'Searching', value: 'searching', sequence: 1 },
        matched: { $id: Now.ID['li-state-matched'], label: 'Matched', value: 'matched', sequence: 2 },
        claimed: { $id: Now.ID['li-state-claimed'], label: 'Claimed', value: 'claimed', sequence: 3 },
        closed: { $id: Now.ID['li-state-closed'], label: 'Closed', value: 'closed', sequence: 4 },
        expired: { $id: Now.ID['li-state-expired'], label: 'Expired', value: 'expired', sequence: 5 },
    },
    transitions: [
        { $id: Now.ID['li-new-to-searching'], from: 'new', to: 'searching' },
        { $id: Now.ID['li-searching-to-matched'], from: 'searching', to: 'matched' },
        { $id: Now.ID['li-matched-to-claimed'], from: 'matched', to: 'claimed' },
        { $id: Now.ID['li-claimed-to-closed'], from: 'claimed', to: 'closed' },
        { $id: Now.ID['li-searching-to-expired'], from: 'searching', to: 'expired' },
    ],
})

// =============================================================================
// 2. Found Item Lifecycle
// received → cataloged → matched → claimed | unclaimed → disposed
// =============================================================================
StateModel({
    $id: Now.ID['found-item-state-model'],
    name: 'Found Item Lifecycle',
    table: 'x_1927922_campus_l_found_item',
    stateField: 'state',
    states: {
        received: { $id: Now.ID['fi-state-received'], label: 'Received', value: 'received', initial: true, sequence: 0 },
        cataloged: { $id: Now.ID['fi-state-cataloged'], label: 'Cataloged', value: 'cataloged', sequence: 1 },
        matched: { $id: Now.ID['fi-state-matched'], label: 'Matched', value: 'matched', sequence: 2 },
        claimed: { $id: Now.ID['fi-state-claimed'], label: 'Claimed', value: 'claimed', sequence: 3 },
        unclaimed: { $id: Now.ID['fi-state-unclaimed'], label: 'Unclaimed', value: 'unclaimed', sequence: 4 },
        disposed: { $id: Now.ID['fi-state-disposed'], label: 'Disposed', value: 'disposed', sequence: 5 },
    },
    transitions: [
        { $id: Now.ID['fi-received-to-cataloged'], from: 'received', to: 'cataloged' },
        { $id: Now.ID['fi-cataloged-to-matched'], from: 'cataloged', to: 'matched' },
        { $id: Now.ID['fi-matched-to-claimed'], from: 'matched', to: 'claimed' },
        { $id: Now.ID['fi-matched-to-unclaimed'], from: 'matched', to: 'unclaimed' },
        { $id: Now.ID['fi-unclaimed-to-disposed'], from: 'unclaimed', to: 'disposed' },
    ],
})

// =============================================================================
// 3. Match Lifecycle
// pending → reviewing → confirmed | rejected | expired
// =============================================================================
StateModel({
    $id: Now.ID['match-state-model'],
    name: 'Match Lifecycle',
    table: 'x_1927922_campus_l_match',
    stateField: 'state',
    states: {
        pending: { $id: Now.ID['m-state-pending'], label: 'Pending', value: 'pending', initial: true, sequence: 0 },
        reviewing: { $id: Now.ID['m-state-reviewing'], label: 'Reviewing', value: 'reviewing', sequence: 1 },
        confirmed: { $id: Now.ID['m-state-confirmed'], label: 'Confirmed', value: 'confirmed', sequence: 2 },
        rejected: { $id: Now.ID['m-state-rejected'], label: 'Rejected', value: 'rejected', sequence: 3 },
        expired: { $id: Now.ID['m-state-expired'], label: 'Expired', value: 'expired', sequence: 4 },
    },
    transitions: [
        { $id: Now.ID['m-pending-to-reviewing'], from: 'pending', to: 'reviewing' },
        { $id: Now.ID['m-reviewing-to-confirmed'], from: 'reviewing', to: 'confirmed' },
        { $id: Now.ID['m-reviewing-to-rejected'], from: 'reviewing', to: 'rejected' },
        { $id: Now.ID['m-reviewing-to-expired'], from: 'reviewing', to: 'expired' },
    ],
})

// =============================================================================
// 4. Claim Lifecycle
// submitted → verifying → approved → picked_up | denied | cancelled
// =============================================================================
StateModel({
    $id: Now.ID['claim-state-model'],
    name: 'Claim Lifecycle',
    table: 'x_1927922_campus_l_claim',
    stateField: 'state',
    states: {
        submitted: { $id: Now.ID['c-state-submitted'], label: 'Submitted', value: 'submitted', initial: true, sequence: 0 },
        verifying: { $id: Now.ID['c-state-verifying'], label: 'Verifying', value: 'verifying', sequence: 1 },
        approved: { $id: Now.ID['c-state-approved'], label: 'Approved', value: 'approved', sequence: 2 },
        denied: { $id: Now.ID['c-state-denied'], label: 'Denied', value: 'denied', sequence: 3 },
        picked_up: { $id: Now.ID['c-state-picked-up'], label: 'Picked Up', value: 'picked_up', sequence: 4 },
        cancelled: { $id: Now.ID['c-state-cancelled'], label: 'Cancelled', value: 'cancelled', sequence: 5 },
    },
    transitions: [
        { $id: Now.ID['c-submitted-to-verifying'], from: 'submitted', to: 'verifying' },
        { $id: Now.ID['c-verifying-to-approved'], from: 'verifying', to: 'approved' },
        { $id: Now.ID['c-verifying-to-denied'], from: 'verifying', to: 'denied' },
        { $id: Now.ID['c-approved-to-picked-up'], from: 'approved', to: 'picked_up' },
        { $id: Now.ID['c-submitted-to-cancelled'], from: 'submitted', to: 'cancelled' },
        { $id: Now.ID['c-verifying-to-cancelled'], from: 'verifying', to: 'cancelled' },
    ],
})

// =============================================================================
// Assign State Model – Business Rules (before insert)
// Resolves the active model for the table at runtime and assigns it.
// =============================================================================

const assignModelScript = `(function executeRule(current, previous) {
    var modelGr = new GlideRecord('sttrm_model');
    modelGr.addQuery('table_name', current.getTableName());
    modelGr.addActiveQuery();
    modelGr.orderBy('order');
    modelGr.setLimit(1);
    modelGr.query();
    if (modelGr.next()) {
        current.setValue('model', modelGr.getUniqueValue());
    }
})(current, previous);`

BusinessRule({
    $id: Now.ID['assign-model-lost-item'],
    name: 'Assign State Model - Lost Item',
    table: 'x_1927922_campus_l_lost_item',
    when: 'before',
    action: ['insert'],
    filterCondition: 'modelISEMPTY',
    script: assignModelScript,
})

BusinessRule({
    $id: Now.ID['assign-model-found-item'],
    name: 'Assign State Model - Found Item',
    table: 'x_1927922_campus_l_found_item',
    when: 'before',
    action: ['insert'],
    filterCondition: 'modelISEMPTY',
    script: assignModelScript,
})

BusinessRule({
    $id: Now.ID['assign-model-match'],
    name: 'Assign State Model - Match',
    table: 'x_1927922_campus_l_match',
    when: 'before',
    action: ['insert'],
    filterCondition: 'modelISEMPTY',
    script: assignModelScript,
})

BusinessRule({
    $id: Now.ID['assign-model-claim'],
    name: 'Assign State Model - Claim',
    table: 'x_1927922_campus_l_claim',
    when: 'before',
    action: ['insert'],
    filterCondition: 'modelISEMPTY',
    script: assignModelScript,
})

// =============================================================================
// Check State Transition – Business Rules (before update)
// Enforces state model transitions at runtime using global.STTRMModel.
// =============================================================================

const checkTransitionScript = `(function executeRule(current, previous) {
    if (!previous) return;

    var modelGr = new GlideRecord('sttrm_model');
    modelGr.addQuery('table_name', current.getTableName());
    modelGr.addActiveQuery();
    modelGr.orderBy('order');
    modelGr.setLimit(1);
    modelGr.query();
    if (!modelGr.next()) return;

    var stateField = modelGr.getValue('state_field');
    var previousState = previous.getValue(stateField);
    var currentState = current.getValue(stateField);
    if (previousState === currentState) return;

    var model = new global.STTRMModel(modelGr);
    var result = model.evaluateTransition(previousState, current);
    if (!result.transition_available) {
        var msg = gs.getMessage("Model '{0}' prevented state transition from {1} to {2}",
            [modelGr.getDisplayValue('name'), previous.getDisplayValue(stateField), current.getDisplayValue(stateField)]);
        if (result.conditions) {
            var failed = result.conditions
                .filter(function (c) { return !c.passed && c.condition && c.condition.name; })
                .map(function (c) { return c.condition.name; });
            if (failed.length) {
                msg = gs.getMessage("Model '{0}' prevented state transition from {1} to {2} because these transition conditions failed: {3}",
                    [modelGr.getDisplayValue('name'), previous.getDisplayValue(stateField), current.getDisplayValue(stateField), failed.join(', ')]);
            }
        }
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);`

BusinessRule({
    $id: Now.ID['check-transition-lost-item'],
    name: 'Check State Transition - Lost Item',
    table: 'x_1927922_campus_l_lost_item',
    when: 'before',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^EQ',
    order: 50,
    script: checkTransitionScript,
})

BusinessRule({
    $id: Now.ID['check-transition-found-item'],
    name: 'Check State Transition - Found Item',
    table: 'x_1927922_campus_l_found_item',
    when: 'before',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^EQ',
    order: 50,
    script: checkTransitionScript,
})

BusinessRule({
    $id: Now.ID['check-transition-match'],
    name: 'Check State Transition - Match',
    table: 'x_1927922_campus_l_match',
    when: 'before',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^EQ',
    order: 50,
    script: checkTransitionScript,
})

BusinessRule({
    $id: Now.ID['check-transition-claim'],
    name: 'Check State Transition - Claim',
    table: 'x_1927922_campus_l_claim',
    when: 'before',
    action: ['update'],
    filterCondition: 'stateVALCHANGES^EQ',
    order: 50,
    script: checkTransitionScript,
})
