import '@servicenow/sdk/global'
import { Flow, wfa, action, trigger } from '@servicenow/sdk/automation'
import { reportLostItem, reportFoundItem } from './catalog.now'

// =============================================================================
// FULFILLMENT FLOW 1: Report Lost Item
// Triggered by Service Catalog submission, creates a lost_item record
// =============================================================================
Flow(
    {
        $id: Now.ID['fulfill_lost_item_flow'],
        name: 'Fulfill - Report Lost Item',
        description:
            'Creates a lost item record from the Report Lost Item catalog submission and triggers the Smart Match engine.',
        runAs: 'system',
    },
    wfa.trigger(trigger.application.serviceCatalog, {
        $id: Now.ID['lost_item_catalog_trigger'],
    }, {
        run_flow_in: 'background',
    }),
    (params) => {
        // 1. Surface template variables onto the request item
        wfa.action(
            action.core.getCatalogVariables,
            { $id: Now.ID['get_lost_item_vars'] },
            {
                requested_item: wfa.dataPill(params.trigger.request_item, 'reference'),
                template_catalog_item: `${reportLostItem}`,
                catalog_variables: [
                    reportLostItem.variables.item_short_desc,
                    reportLostItem.variables.item_detailed_desc,
                    reportLostItem.variables.item_category,
                    reportLostItem.variables.item_color,
                    reportLostItem.variables.item_brand,
                    reportLostItem.variables.item_features,
                    reportLostItem.variables.item_last_location,
                    reportLostItem.variables.item_last_date,
                    reportLostItem.variables.item_last_time,
                    reportLostItem.variables.item_urgency,
                    reportLostItem.variables.item_contact_email,
                    reportLostItem.variables.item_contact_phone,
                ],
            },
        )

        // Helper reference for catalog variable access (typed as any for dynamic variable properties)
        const vars = params.trigger.request_item.variables as any

        // 2. Create the lost item record
        wfa.action(
            action.core.createRecord,
            { $id: Now.ID['create_lost_item_record'] },
            {
                table_name: 'x_1927922_campus_l_lost_item',
                values: TemplateValue({
                    reported_by: wfa.dataPill(
                        params.trigger.request_item.requested_for,
                        'reference',
                    ),
                    short_description: wfa.dataPill(vars.item_short_desc, 'string'),
                    detailed_description: wfa.dataPill(vars.item_detailed_desc, 'string'),
                    category: wfa.dataPill(vars.item_category, 'string'),
                    color: wfa.dataPill(vars.item_color, 'string'),
                    brand: wfa.dataPill(vars.item_brand, 'string'),
                    distinguishing_features: wfa.dataPill(vars.item_features, 'string'),
                    last_seen_location: wfa.dataPill(vars.item_last_location, 'reference'),
                    last_seen_date: wfa.dataPill(vars.item_last_date, 'string'),
                    last_seen_time: wfa.dataPill(vars.item_last_time, 'string'),
                    urgency: wfa.dataPill(vars.item_urgency, 'string'),
                    contact_email: wfa.dataPill(vars.item_contact_email, 'string'),
                    contact_phone: wfa.dataPill(vars.item_contact_phone, 'string'),
                    state: 'new',
                }),
            },
        )

        // 3. Log completion
        wfa.action(action.core.log, { $id: Now.ID['log_lost_item_created'] }, {
            log_level: 'info',
            log_message: `Lost item record created from catalog request by ${wfa.dataPill(params.trigger.request_item.requested_for.name, 'string')}`,
        })
    },
)

// =============================================================================
// FULFILLMENT FLOW 2: Report Found Item
// Triggered by Service Catalog submission, creates a found_item record
// =============================================================================
Flow(
    {
        $id: Now.ID['fulfill_found_item_flow'],
        name: 'Fulfill - Report Found Item',
        description:
            'Creates a found item record from the Report Found Item catalog submission and triggers the Smart Match engine.',
        runAs: 'system',
    },
    wfa.trigger(trigger.application.serviceCatalog, {
        $id: Now.ID['found_item_catalog_trigger'],
    }, {
        run_flow_in: 'background',
    }),
    (params) => {
        // 1. Surface template variables onto the request item
        wfa.action(
            action.core.getCatalogVariables,
            { $id: Now.ID['get_found_item_vars'] },
            {
                requested_item: wfa.dataPill(params.trigger.request_item, 'reference'),
                template_catalog_item: `${reportFoundItem}`,
                catalog_variables: [
                    reportFoundItem.variables.found_short_desc,
                    reportFoundItem.variables.found_detailed_desc,
                    reportFoundItem.variables.found_category,
                    reportFoundItem.variables.found_color,
                    reportFoundItem.variables.found_brand,
                    reportFoundItem.variables.found_features,
                    reportFoundItem.variables.found_location,
                    reportFoundItem.variables.found_date,
                    reportFoundItem.variables.found_time,
                    reportFoundItem.variables.found_storage,
                ],
            },
        )

        // Helper reference for catalog variable access (typed as any for dynamic variable properties)
        const foundVars = params.trigger.request_item.variables as any

        // 2. Create the found item record
        wfa.action(
            action.core.createRecord,
            { $id: Now.ID['create_found_item_record'] },
            {
                table_name: 'x_1927922_campus_l_found_item',
                values: TemplateValue({
                    found_by: wfa.dataPill(
                        params.trigger.request_item.requested_for,
                        'reference',
                    ),
                    short_description: wfa.dataPill(foundVars.found_short_desc, 'string'),
                    detailed_description: wfa.dataPill(foundVars.found_detailed_desc, 'string'),
                    category: wfa.dataPill(foundVars.found_category, 'string'),
                    color: wfa.dataPill(foundVars.found_color, 'string'),
                    brand: wfa.dataPill(foundVars.found_brand, 'string'),
                    distinguishing_features: wfa.dataPill(foundVars.found_features, 'string'),
                    found_location: wfa.dataPill(foundVars.found_location, 'reference'),
                    found_date: wfa.dataPill(foundVars.found_date, 'string'),
                    found_time: wfa.dataPill(foundVars.found_time, 'string'),
                    storage_location: wfa.dataPill(foundVars.found_storage, 'reference'),
                    state: 'received',
                }),
            },
        )

        // 3. Log completion
        wfa.action(action.core.log, { $id: Now.ID['log_found_item_created'] }, {
            log_level: 'info',
            log_message: `Found item record created from catalog request by ${wfa.dataPill(params.trigger.request_item.requested_for.name, 'string')}`,
        })
    },
)
