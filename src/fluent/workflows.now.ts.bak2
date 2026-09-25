import '@servicenow/sdk/global'
import { Flow, wfa, action, trigger } from '@servicenow/sdk/automation'

// =============================================================================
// FLOW 1: Match Notification Flow
// Triggers when a match state changes to "reviewing" (high-confidence match).
// Sends email to the lost-item reporter, then logs the notification event.
// =============================================================================
Flow(
    {
        $id: Now.ID['match_notification_flow'],
        name: 'Match Found - Notify Reporter',
        description:
            'Notifies the lost item reporter when a high-confidence match is found and the match enters the reviewing state.',
        runAs: 'system',
    },
    wfa.trigger(trigger.record.updated, { $id: Now.ID['match_reviewing_trigger'] }, {
        table: 'x_1927922_campus_l_match',
        condition: 'state=reviewing',
        run_flow_in: 'background',
        trigger_strategy: 'unique_changes',
    }),
    (params) => {
        // 1. Send email notification to the lost item's reported_by user
        wfa.action(action.core.sendEmail, { $id: Now.ID['send_match_found_email'] }, {
            ah_to: wfa.dataPill(
                params.trigger.current.lost_item.reported_by.email,
                'string',
            ),
            ah_subject: `Potential Match Found for Your Lost Item ${wfa.dataPill(params.trigger.current.lost_item.number, 'string')}`,
            ah_body:
                'A potential match has been found for your lost item. Please log in to the Campus Lost and Found portal to review the match details, including the found item description, confidence score, claim code, and pickup location. Use your claim code to initiate the claim process. If you believe this match is correct, submit a claim as soon as possible.',
            record: wfa.dataPill(params.trigger.current, 'reference'),
            table_name: 'x_1927922_campus_l_match',
        })

        // 2. Log the notification event
        wfa.action(action.core.log, { $id: Now.ID['log_match_notification'] }, {
            log_level: 'info',
            log_message: `Match notification sent for ${wfa.dataPill(params.trigger.current.number, 'string')} - Lost item: ${wfa.dataPill(params.trigger.current.lost_item.number, 'string')}`,
        })
    },
)

// =============================================================================
// FLOW 2: Claim Approved Notification Flow
// Triggers when a claim state changes to "approved".
// Sends pickup instructions to the claimant.
// =============================================================================
Flow(
    {
        $id: Now.ID['claim_approved_flow'],
        name: 'Claim Approved - Notify Claimant',
        description:
            'Notifies the claimant when their claim is approved with pickup location details and instructions.',
        runAs: 'system',
    },
    wfa.trigger(trigger.record.updated, { $id: Now.ID['claim_approved_trigger'] }, {
        table: 'x_1927922_campus_l_claim',
        condition: 'state=approved',
        run_flow_in: 'background',
        trigger_strategy: 'unique_changes',
    }),
    (params) => {
        // 1. Send approval email to claimant with pickup instructions
        wfa.action(
            action.core.sendEmail,
            { $id: Now.ID['send_claim_approved_email'] },
            {
                ah_to: wfa.dataPill(params.trigger.current.claimant.email, 'string'),
                ah_subject: `Your Claim Has Been Approved - Pickup Instructions ${wfa.dataPill(params.trigger.current.number, 'string')}`,
                ah_body:
                    'Your claim has been approved! Please visit the designated pickup location with a valid student or employee ID and your claim code to collect your item. Pickup must be completed within 7 business days of this notification. If you are unable to pick up within this timeframe, please contact the Lost and Found office to arrange an extension.',
                record: wfa.dataPill(params.trigger.current, 'reference'),
                table_name: 'x_1927922_campus_l_claim',
            },
        )

        // 2. Log the notification
        wfa.action(action.core.log, { $id: Now.ID['log_claim_approved'] }, {
            log_level: 'info',
            log_message: `Claim approved notification sent for ${wfa.dataPill(params.trigger.current.number, 'string')} to claimant`,
        })
    },
)

// =============================================================================
// FLOW 3: Unclaimed Item Escalation Flow
// Triggers when a found item state changes to "unclaimed".
// Sends disposal-processing notification to the desk contact at the
// item's storage location.
// =============================================================================
Flow(
    {
        $id: Now.ID['unclaimed_escalation_flow'],
        name: 'Unclaimed Item - Notify Desk for Disposal',
        description:
            'Notifies the desk contact at the storage location when a found item becomes unclaimed and needs disposal processing.',
        runAs: 'system',
    },
    wfa.trigger(
        trigger.record.updated,
        { $id: Now.ID['found_item_unclaimed_trigger'] },
        {
            table: 'x_1927922_campus_l_found_item',
            condition: 'state=unclaimed',
            run_flow_in: 'background',
            trigger_strategy: 'unique_changes',
        },
    ),
    (params) => {
        // 1. Look up storage location to get the desk contact
        const storageLocation = wfa.action(
            action.core.lookUpRecord,
            { $id: Now.ID['lookup_unclaimed_storage'] },
            {
                table: 'x_1927922_campus_l_location',
                conditions: `sys_id=${wfa.dataPill(params.trigger.current.storage_location, 'string')}`,
                if_multiple_records_are_found_action: 'use_first_record',
            },
        )

        // 2. Only send email if a desk contact exists
        wfa.flowLogic.if(
            {
                $id: Now.ID['check_desk_contact_exists'],
                condition: `${wfa.dataPill(storageLocation.Record.desk_contact, 'string')}ISNOTEMPTY`,
            },
            () => {
                // 3. Send disposal notification to desk contact
                wfa.action(
                    action.core.sendEmail,
                    { $id: Now.ID['send_unclaimed_email'] },
                    {
                        ah_to: wfa.dataPill(
                            storageLocation.Record.desk_contact.email,
                            'string',
                        ),
                        ah_subject: `Unclaimed Item Requires Disposal Processing - ${wfa.dataPill(params.trigger.current.number, 'string')}`,
                        ah_body:
                            'An item stored at your location has been marked as unclaimed and requires disposal processing. Please follow your facility disposal procedures for this item. Refer to the item record for details including the item description, category, and storage location.',
                        record: wfa.dataPill(params.trigger.current, 'reference'),
                        table_name: 'x_1927922_campus_l_found_item',
                    },
                )

                // 4. Log the notification
                wfa.action(
                    action.core.log,
                    { $id: Now.ID['log_unclaimed_notification'] },
                    {
                        log_level: 'info',
                        log_message: `Unclaimed item disposal notification sent for ${wfa.dataPill(params.trigger.current.number, 'string')}`,
                    },
                )
            },
        )
    },
)
