import '@servicenow/sdk/global'
import {
    CatalogItem,
    Record,
    SingleLineTextVariable,
    MultiLineTextVariable,
    SelectBoxVariable,
    ReferenceVariable,
    DateVariable,
    EmailVariable,
    AttachmentVariable,
} from '@servicenow/sdk/core'

// Service Catalog sys_id (standard out-of-box)
const SERVICE_CATALOG = 'e0d08b13c3330100c8b837659bba8fb4'

// Create a custom category for Lost & Found
Record({
    $id: Now.ID['lf_catalog_category'],
    table: 'sc_category',
    data: {
        title: 'Campus Lost and Found',
        description:
            'Report lost items or submit found items to the Campus Lost and Found system.',
        sc_catalog: SERVICE_CATALOG,
        active: true,
        icon: 'search',
    },
})

// =============================================================================
// CATALOG ITEM 1: Report Lost Item
// =============================================================================
export const reportLostItem = CatalogItem({
    $id: Now.ID['report_lost_item'],
    name: 'Report Lost Item',
    shortDescription: 'Report a lost item on campus',
    description:
        'Use this form to report an item you have lost on campus. Our Smart Matching engine will automatically scan found items and notify you of potential matches.',
    catalogs: [SERVICE_CATALOG],
    categories: [Now.ref('sc_category', 'lf_catalog_category')],
    flow: Now.ref('sys_hub_flow', 'fulfill_lost_item_flow'),
    availability: 'both',
    requestMethod: 'submit',
    hideAddToCart: true,
    hideQuantitySelector: true,
    hideDeliveryTime: true,
    omitPrice: true,
    mandatoryAttachment: false,
    showVariableHelpOnLoad: true,
    meta: ['lost', 'found', 'campus', 'missing', 'item'],

    variables: {
        item_short_desc: SingleLineTextVariable({
            question: 'What did you lose?',
            mandatory: true,
            order: 100,
            exampleText: 'e.g., Silver MacBook Pro, Black leather wallet',
        }),
        item_detailed_desc: MultiLineTextVariable({
            question: 'Detailed Description',
            order: 200,
            helpText: 'Provide as much detail as possible to improve matching accuracy.',
        }),
        item_category: SelectBoxVariable({
            question: 'Category',
            mandatory: true,
            order: 300,
            choices: {
                electronics: { label: 'Electronics', sequence: 1 },
                keys: { label: 'Keys', sequence: 2 },
                wallet_id: { label: 'Wallet/ID', sequence: 3 },
                clothing: { label: 'Clothing', sequence: 4 },
                bag_backpack: { label: 'Bag/Backpack', sequence: 5 },
                water_bottle: { label: 'Water Bottle', sequence: 6 },
                jewelry: { label: 'Jewelry', sequence: 7 },
                books_notes: { label: 'Books/Notes', sequence: 8 },
                sports_equipment: { label: 'Sports Equipment', sequence: 9 },
                other: { label: 'Other', sequence: 10 },
            },
            includeNone: true,
        }),
        item_color: SingleLineTextVariable({
            question: 'Primary Color',
            order: 400,
            exampleText: 'e.g., Black, Silver, Blue',
        }),
        item_brand: SingleLineTextVariable({
            question: 'Brand',
            order: 500,
            exampleText: 'e.g., Apple, Nike, North Face',
        }),
        item_features: MultiLineTextVariable({
            question: 'Distinguishing Features',
            order: 600,
            helpText: 'Stickers, scratches, engravings, or other unique identifiers.',
        }),
        item_last_location: ReferenceVariable({
            question: 'Where did you last see it?',
            mandatory: true,
            order: 700,
            referenceTable: 'x_1927922_campus_l_location',
            referenceQualCondition: 'active=true',
        }),
        item_last_date: DateVariable({
            question: 'When did you last see it?',
            mandatory: true,
            order: 800,
        }),
        item_last_time: SingleLineTextVariable({
            question: 'Approximate Time',
            order: 900,
            exampleText: 'e.g., 2:30 PM, Morning, After lunch',
        }),
        item_urgency: SelectBoxVariable({
            question: 'How urgent is this?',
            order: 1000,
            choices: {
                high: { label: 'High - Contains sensitive items (keys, ID, wallet)', sequence: 1 },
                medium: { label: 'Medium - Important but not critical', sequence: 2 },
                low: { label: 'Low - Would like it back when possible', sequence: 3 },
            },
            includeNone: true,
        }),
        item_contact_email: EmailVariable({
            question: 'Contact Email',
            order: 1100,
            helpText: 'We will notify you at this email if a match is found.',
        }),
        item_contact_phone: SingleLineTextVariable({
            question: 'Contact Phone',
            order: 1200,
        }),
        item_photo: AttachmentVariable({
            question: 'Photo of Item (or similar)',
            order: 1300,
            helpText: 'Upload a photo of the lost item or a similar one to help with identification.',
        }),
    },
})

// =============================================================================
// CATALOG ITEM 2: Report Found Item
// =============================================================================
export const reportFoundItem = CatalogItem({
    $id: Now.ID['report_found_item'],
    name: 'Report Found Item',
    shortDescription: 'Report an item you found on campus',
    description:
        'Use this form to report an item you found on campus. Our Smart Matching engine will automatically search for the owner and notify them.',
    catalogs: [SERVICE_CATALOG],
    categories: [Now.ref('sc_category', 'lf_catalog_category')],
    flow: Now.ref('sys_hub_flow', 'fulfill_found_item_flow'),
    availability: 'both',
    requestMethod: 'submit',
    hideAddToCart: true,
    hideQuantitySelector: true,
    hideDeliveryTime: true,
    omitPrice: true,
    mandatoryAttachment: false,
    showVariableHelpOnLoad: true,
    meta: ['lost', 'found', 'campus', 'item', 'turned in'],

    variables: {
        found_short_desc: SingleLineTextVariable({
            question: 'What did you find?',
            mandatory: true,
            order: 100,
            exampleText: 'e.g., Black iPhone in a blue case, Red water bottle',
        }),
        found_detailed_desc: MultiLineTextVariable({
            question: 'Detailed Description',
            order: 200,
            helpText: 'Describe the item in as much detail as possible.',
        }),
        found_category: SelectBoxVariable({
            question: 'Category',
            mandatory: true,
            order: 300,
            choices: {
                electronics: { label: 'Electronics', sequence: 1 },
                keys: { label: 'Keys', sequence: 2 },
                wallet_id: { label: 'Wallet/ID', sequence: 3 },
                clothing: { label: 'Clothing', sequence: 4 },
                bag_backpack: { label: 'Bag/Backpack', sequence: 5 },
                water_bottle: { label: 'Water Bottle', sequence: 6 },
                jewelry: { label: 'Jewelry', sequence: 7 },
                books_notes: { label: 'Books/Notes', sequence: 8 },
                sports_equipment: { label: 'Sports Equipment', sequence: 9 },
                other: { label: 'Other', sequence: 10 },
            },
            includeNone: true,
        }),
        found_color: SingleLineTextVariable({
            question: 'Primary Color',
            order: 400,
            exampleText: 'e.g., Black, Silver, Blue',
        }),
        found_brand: SingleLineTextVariable({
            question: 'Brand',
            order: 500,
            exampleText: 'e.g., Apple, Nike, North Face',
        }),
        found_features: MultiLineTextVariable({
            question: 'Distinguishing Features',
            order: 600,
            helpText: 'Stickers, scratches, engravings, or other unique identifiers.',
        }),
        found_location: ReferenceVariable({
            question: 'Where did you find it?',
            mandatory: true,
            order: 700,
            referenceTable: 'x_1927922_campus_l_location',
            referenceQualCondition: 'active=true',
        }),
        found_date: DateVariable({
            question: 'When did you find it?',
            mandatory: true,
            order: 800,
        }),
        found_time: SingleLineTextVariable({
            question: 'Approximate Time',
            order: 900,
            exampleText: 'e.g., 10:00 AM, Afternoon',
        }),
        found_storage: ReferenceVariable({
            question: 'Where is the item currently stored?',
            order: 1000,
            referenceTable: 'x_1927922_campus_l_location',
            referenceQualCondition: 'active=true',
            helpText: 'Select the desk or office where you left the item.',
        }),
        found_photo: AttachmentVariable({
            question: 'Photo of the Found Item',
            order: 1100,
            helpText: 'Upload a photo to help with identification and AI matching.',
        }),
    },
})
