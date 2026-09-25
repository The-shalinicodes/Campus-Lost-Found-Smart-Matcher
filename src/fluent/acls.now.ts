import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

// Role name constants for clarity
const ADMIN = 'x_1927922_campus_l.admin'
const DESK_STAFF = 'x_1927922_campus_l.desk_staff'
const STUDENT = 'x_1927922_campus_l.student'

// =============================================================================
// CAMPUS LOCATION ACLs
// Admin: full CRUD
// Desk Staff & Student: read only
// =============================================================================

Acl({
    $id: Now.ID['location_read'],
    type: 'record',
    table: 'x_1927922_campus_l_location',
    operation: 'read',
    roles: [STUDENT],
    adminOverrides: true,
    description: 'All app roles can read campus locations',
})

Acl({
    $id: Now.ID['location_create'],
    type: 'record',
    table: 'x_1927922_campus_l_location',
    operation: 'create',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can create campus locations',
})

Acl({
    $id: Now.ID['location_write'],
    type: 'record',
    table: 'x_1927922_campus_l_location',
    operation: 'write',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can update campus locations',
})

Acl({
    $id: Now.ID['location_delete'],
    type: 'record',
    table: 'x_1927922_campus_l_location',
    operation: 'delete',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can delete campus locations',
})

// =============================================================================
// LOST ITEM ACLs
// Students: create, read/write own records
// Desk Staff: read/write all
// Admin: full CRUD
// =============================================================================

Acl({
    $id: Now.ID['lost_item_create'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'create',
    roles: [STUDENT],
    adminOverrides: true,
    description: 'All app roles can create lost item reports',
})

// Desk staff and admin can read all lost items
Acl({
    $id: Now.ID['lost_item_read_staff'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'read',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can read all lost items',
})

// Students can read only their own lost items
Acl({
    $id: Now.ID['lost_item_read_student'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'read',
    roles: [STUDENT],
    script: `
        answer = (current.reported_by == gs.getUserID());
    `,
    adminOverrides: true,
    description: 'Students can read their own lost item reports',
})

// Desk staff and admin can write all lost items
Acl({
    $id: Now.ID['lost_item_write_staff'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'write',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can update all lost items',
})

// Students can write only their own lost items
Acl({
    $id: Now.ID['lost_item_write_student'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'write',
    roles: [STUDENT],
    script: `
        answer = (current.reported_by == gs.getUserID());
    `,
    adminOverrides: true,
    description: 'Students can update their own lost item reports',
})

Acl({
    $id: Now.ID['lost_item_delete'],
    type: 'record',
    table: 'x_1927922_campus_l_lost_item',
    operation: 'delete',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can delete lost items',
})

// =============================================================================
// FOUND ITEM ACLs
// Desk Staff & Admin: create, read, write
// Students: read only (limited)
// Admin: full CRUD
// =============================================================================

Acl({
    $id: Now.ID['found_item_create'],
    type: 'record',
    table: 'x_1927922_campus_l_found_item',
    operation: 'create',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can create found item records',
})

// All app roles can read found items
Acl({
    $id: Now.ID['found_item_read'],
    type: 'record',
    table: 'x_1927922_campus_l_found_item',
    operation: 'read',
    roles: [STUDENT],
    adminOverrides: true,
    description: 'All app roles can read found items',
})

Acl({
    $id: Now.ID['found_item_write'],
    type: 'record',
    table: 'x_1927922_campus_l_found_item',
    operation: 'write',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can update found items',
})

Acl({
    $id: Now.ID['found_item_delete'],
    type: 'record',
    table: 'x_1927922_campus_l_found_item',
    operation: 'delete',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can delete found items',
})

// =============================================================================
// MATCH ACLs
// Desk Staff & Admin: read/write all
// Students: read their own matches (via lost item ownership)
// Admin: full CRUD
// =============================================================================

Acl({
    $id: Now.ID['match_create'],
    type: 'record',
    table: 'x_1927922_campus_l_match',
    operation: 'create',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can create matches',
})

// Desk staff and admin can read all matches
Acl({
    $id: Now.ID['match_read_staff'],
    type: 'record',
    table: 'x_1927922_campus_l_match',
    operation: 'read',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can read all matches',
})

// Students can read matches for their own lost items
Acl({
    $id: Now.ID['match_read_student'],
    type: 'record',
    table: 'x_1927922_campus_l_match',
    operation: 'read',
    roles: [STUDENT],
    script: `
        answer = false;
        if (!current.lost_item.nil()) {
            answer = (current.lost_item.reported_by == gs.getUserID());
        }
    `,
    adminOverrides: true,
    description: 'Students can read matches for their own lost items',
})

Acl({
    $id: Now.ID['match_write'],
    type: 'record',
    table: 'x_1927922_campus_l_match',
    operation: 'write',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can update matches',
})

Acl({
    $id: Now.ID['match_delete'],
    type: 'record',
    table: 'x_1927922_campus_l_match',
    operation: 'delete',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can delete matches',
})

// =============================================================================
// CLAIM ACLs
// Students: create and read their own claims
// Desk Staff & Admin: full read/write
// Admin: full CRUD
// =============================================================================

Acl({
    $id: Now.ID['claim_create'],
    type: 'record',
    table: 'x_1927922_campus_l_claim',
    operation: 'create',
    roles: [STUDENT],
    adminOverrides: true,
    description: 'All app roles can create claims',
})

// Desk staff and admin can read all claims
Acl({
    $id: Now.ID['claim_read_staff'],
    type: 'record',
    table: 'x_1927922_campus_l_claim',
    operation: 'read',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can read all claims',
})

// Students can read their own claims
Acl({
    $id: Now.ID['claim_read_student'],
    type: 'record',
    table: 'x_1927922_campus_l_claim',
    operation: 'read',
    roles: [STUDENT],
    script: `
        answer = (current.claimant == gs.getUserID());
    `,
    adminOverrides: true,
    description: 'Students can read their own claims',
})

// Desk staff and admin can write all claims
Acl({
    $id: Now.ID['claim_write'],
    type: 'record',
    table: 'x_1927922_campus_l_claim',
    operation: 'write',
    roles: [DESK_STAFF],
    adminOverrides: true,
    description: 'Desk staff and admin can manage all claims',
})

Acl({
    $id: Now.ID['claim_delete'],
    type: 'record',
    table: 'x_1927922_campus_l_claim',
    operation: 'delete',
    roles: [ADMIN],
    adminOverrides: true,
    description: 'Only admin can delete claims',
})
