import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    BooleanColumn,
    DecimalColumn,
    IntegerColumn,
    ReferenceColumn,
    DateColumn,
    TimeColumn,
    DateTimeColumn,
    EmailColumn,
    ChoiceColumn,
} from '@servicenow/sdk/core'

// =============================================================================
// 1. Campus Location
// =============================================================================
export const x_1927922_campus_l_location = Table({
    name: 'x_1927922_campus_l_location',
    label: 'Campus Location',
    display: 'name',
    allowWebServiceAccess: true,
    extensible: false,
    schema: {
        name: StringColumn({ label: 'Name', mandatory: true, maxLength: 100 }),
        building: StringColumn({ label: 'Building', mandatory: true, maxLength: 100 }),
        floor: StringColumn({ label: 'Floor', maxLength: 40 }),
        room: StringColumn({ label: 'Room', maxLength: 40 }),
        location_type: ChoiceColumn({
            label: 'Location Type',
            choices: {
                library: 'Library',
                classroom: 'Classroom',
                lab: 'Lab',
                cafeteria: 'Cafeteria',
                gym: 'Gym',
                dormitory: 'Dormitory',
                office: 'Office',
                outdoor: 'Outdoor',
                other: 'Other',
            },
            dropdown: 'dropdown_with_none',
        }),
        latitude: DecimalColumn({ label: 'Latitude' }),
        longitude: DecimalColumn({ label: 'Longitude' }),
        active: BooleanColumn({ label: 'Active', default: true }),
        desk_contact: ReferenceColumn({ label: 'Desk Contact', referenceTable: 'sys_user' }),
    },
})

// =============================================================================
// 2. Lost Item
// =============================================================================
export const x_1927922_campus_l_lost_item = Table({
    name: 'x_1927922_campus_l_lost_item',
    label: 'Lost Item',
    display: 'number',
    allowWebServiceAccess: true,
    extensible: false,
    schema: {
        number: StringColumn({
            label: 'Number',
            default: 'javascript:getNextObjNumberPadded();',
        }),
        reported_by: ReferenceColumn({
            label: 'Reported By',
            referenceTable: 'sys_user',
            mandatory: true,
        }),
        short_description: StringColumn({
            label: 'Short Description',
            mandatory: true,
            maxLength: 200,
        }),
        detailed_description: StringColumn({
            label: 'Detailed Description',
            maxLength: 4000,
        }),
        category: ChoiceColumn({
            label: 'Category',
            choices: {
                electronics: 'Electronics',
                keys: 'Keys',
                wallet_id: 'Wallet/ID',
                clothing: 'Clothing',
                bag_backpack: 'Bag/Backpack',
                water_bottle: 'Water Bottle',
                jewelry: 'Jewelry',
                books_notes: 'Books/Notes',
                sports_equipment: 'Sports Equipment',
                other: 'Other',
            },
            dropdown: 'dropdown_with_none',
        }),
        color: StringColumn({ label: 'Color', maxLength: 40 }),
        brand: StringColumn({ label: 'Brand', maxLength: 100 }),
        distinguishing_features: StringColumn({
            label: 'Distinguishing Features',
            maxLength: 1000,
        }),
        last_seen_location: ReferenceColumn({
            label: 'Last Seen Location',
            referenceTable: 'x_1927922_campus_l_location',
        }),
        last_seen_date: DateColumn({ label: 'Last Seen Date', mandatory: true }),
        last_seen_time: TimeColumn({ label: 'Last Seen Time' }),
        ai_tags: StringColumn({ label: 'AI Tags', maxLength: 2000 }),
        state: ChoiceColumn({
            label: 'State',
            choices: {
                new: 'New',
                searching: 'Searching',
                matched: 'Matched',
                claimed: 'Claimed',
                closed: 'Closed',
                expired: 'Expired',
            },
            default: 'new',
            dropdown: 'dropdown_without_none',
        }),
        contact_email: EmailColumn({ label: 'Contact Email' }),
        contact_phone: StringColumn({ label: 'Contact Phone', maxLength: 40 }),
        urgency: ChoiceColumn({
            label: 'Urgency',
            choices: {
                high: 'High',
                medium: 'Medium',
                low: 'Low',
            },
            dropdown: 'dropdown_with_none',
        }),
        model: ReferenceColumn({
            label: 'State Model',
            referenceTable: 'sttrm_model',
        }),
    },
    autoNumber: {
        prefix: 'LOST',
        number: 1000,
        numberOfDigits: 7,
    },
})

// =============================================================================
// 3. Found Item
// =============================================================================
export const x_1927922_campus_l_found_item = Table({
    name: 'x_1927922_campus_l_found_item',
    label: 'Found Item',
    display: 'number',
    allowWebServiceAccess: true,
    extensible: false,
    schema: {
        number: StringColumn({
            label: 'Number',
            default: 'javascript:getNextObjNumberPadded();',
        }),
        found_by: ReferenceColumn({
            label: 'Found By',
            referenceTable: 'sys_user',
            mandatory: true,
        }),
        short_description: StringColumn({
            label: 'Short Description',
            mandatory: true,
            maxLength: 200,
        }),
        detailed_description: StringColumn({
            label: 'Detailed Description',
            maxLength: 4000,
        }),
        category: ChoiceColumn({
            label: 'Category',
            choices: {
                electronics: 'Electronics',
                keys: 'Keys',
                wallet_id: 'Wallet/ID',
                clothing: 'Clothing',
                bag_backpack: 'Bag/Backpack',
                water_bottle: 'Water Bottle',
                jewelry: 'Jewelry',
                books_notes: 'Books/Notes',
                sports_equipment: 'Sports Equipment',
                other: 'Other',
            },
            dropdown: 'dropdown_with_none',
        }),
        color: StringColumn({ label: 'Color', maxLength: 40 }),
        brand: StringColumn({ label: 'Brand', maxLength: 100 }),
        distinguishing_features: StringColumn({
            label: 'Distinguishing Features',
            maxLength: 1000,
        }),
        found_location: ReferenceColumn({
            label: 'Found Location',
            referenceTable: 'x_1927922_campus_l_location',
            mandatory: true,
        }),
        found_date: DateColumn({ label: 'Found Date', mandatory: true }),
        found_time: TimeColumn({ label: 'Found Time' }),
        storage_location: ReferenceColumn({
            label: 'Storage Location',
            referenceTable: 'x_1927922_campus_l_location',
        }),
        ai_tags: StringColumn({ label: 'AI Tags', maxLength: 2000 }),
        ocr_text: StringColumn({ label: 'OCR Text', maxLength: 2000 }),
        state: ChoiceColumn({
            label: 'State',
            choices: {
                received: 'Received',
                cataloged: 'Cataloged',
                matched: 'Matched',
                claimed: 'Claimed',
                unclaimed: 'Unclaimed',
                disposed: 'Disposed',
            },
            default: 'received',
            dropdown: 'dropdown_without_none',
        }),
        held_by: ReferenceColumn({ label: 'Held By', referenceTable: 'sys_user' }),
        model: ReferenceColumn({
            label: 'State Model',
            referenceTable: 'sttrm_model',
        }),
    },
    autoNumber: {
        prefix: 'FOUND',
        number: 1000,
        numberOfDigits: 7,
    },
})

// =============================================================================
// 4. Match
// =============================================================================
export const x_1927922_campus_l_match = Table({
    name: 'x_1927922_campus_l_match',
    label: 'Match',
    display: 'number',
    allowWebServiceAccess: true,
    extensible: false,
    schema: {
        number: StringColumn({
            label: 'Number',
            default: 'javascript:getNextObjNumberPadded();',
        }),
        lost_item: ReferenceColumn({
            label: 'Lost Item',
            referenceTable: 'x_1927922_campus_l_lost_item',
            mandatory: true,
        }),
        found_item: ReferenceColumn({
            label: 'Found Item',
            referenceTable: 'x_1927922_campus_l_found_item',
            mandatory: true,
        }),
        confidence_score: IntegerColumn({ label: 'Confidence Score' }),
        category_score: IntegerColumn({ label: 'Category Score' }),
        location_score: IntegerColumn({ label: 'Location Score' }),
        timeline_score: IntegerColumn({ label: 'Timeline Score' }),
        description_score: IntegerColumn({ label: 'Description Score' }),
        ai_reasoning: StringColumn({ label: 'AI Reasoning', maxLength: 4000 }),
        state: ChoiceColumn({
            label: 'State',
            choices: {
                pending: 'Pending',
                reviewing: 'Reviewing',
                confirmed: 'Confirmed',
                rejected: 'Rejected',
                expired: 'Expired',
            },
            default: 'pending',
            dropdown: 'dropdown_without_none',
        }),
        claim_code: StringColumn({ label: 'Claim Code', maxLength: 100 }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed By',
            referenceTable: 'sys_user',
        }),
        review_notes: StringColumn({ label: 'Review Notes', maxLength: 2000 }),
        model: ReferenceColumn({
            label: 'State Model',
            referenceTable: 'sttrm_model',
        }),
    },
    autoNumber: {
        prefix: 'MATCH',
        number: 1000,
        numberOfDigits: 7,
    },
})

// =============================================================================
// 5. Claim
// =============================================================================
export const x_1927922_campus_l_claim = Table({
    name: 'x_1927922_campus_l_claim',
    label: 'Claim',
    display: 'number',
    allowWebServiceAccess: true,
    extensible: false,
    schema: {
        number: StringColumn({
            label: 'Number',
            default: 'javascript:getNextObjNumberPadded();',
        }),
        match: ReferenceColumn({
            label: 'Match',
            referenceTable: 'x_1927922_campus_l_match',
            mandatory: true,
        }),
        claimant: ReferenceColumn({
            label: 'Claimant',
            referenceTable: 'sys_user',
            mandatory: true,
        }),
        claim_code: StringColumn({ label: 'Claim Code', maxLength: 100 }),
        state: ChoiceColumn({
            label: 'State',
            choices: {
                submitted: 'Submitted',
                verifying: 'Verifying',
                approved: 'Approved',
                denied: 'Denied',
                picked_up: 'Picked Up',
                cancelled: 'Cancelled',
            },
            default: 'submitted',
            dropdown: 'dropdown_without_none',
        }),
        pickup_location: ReferenceColumn({
            label: 'Pickup Location',
            referenceTable: 'x_1927922_campus_l_location',
        }),
        pickup_date: DateTimeColumn({ label: 'Pickup Date' }),
        verification_method: ChoiceColumn({
            label: 'Verification Method',
            choices: {
                id_check: 'ID Check',
                photo_match: 'Photo Match',
                description_match: 'Description Match',
                other: 'Other',
            },
            dropdown: 'dropdown_with_none',
        }),
        verified_by: ReferenceColumn({
            label: 'Verified By',
            referenceTable: 'sys_user',
        }),
        verification_notes: StringColumn({
            label: 'Verification Notes',
            maxLength: 2000,
        }),
        model: ReferenceColumn({
            label: 'State Model',
            referenceTable: 'sttrm_model',
        }),
    },
    autoNumber: {
        prefix: 'CLAIM',
        number: 1000,
        numberOfDigits: 7,
    },
})
