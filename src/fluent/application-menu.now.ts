import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { deskStaff } from './roles.now'

// =============================================================================
// Application Menu — Campus Lost and Found
// =============================================================================
// Top-level navigator menu with modules for dashboard, table lists,
// and key workflows. Accessible to desk_staff and admin roles.
// =============================================================================

// Application Menu category for visual styling
export const appCategory = Record({
    table: 'sys_app_category',
    $id: Now.ID['campus-lf-app-category'],
    data: {
        name: 'campus_lost_found',
        style: 'border-color: #5cb85c; background-color: #eaf6ea;',
    },
})

// Top-level Application Menu
export const campusLFMenu = ApplicationMenu({
    $id: Now.ID['campus-lf-app-menu'],
    title: 'Campus Lost and Found',
    hint: 'Campus Lost & Found Smart Matcher — manage lost items, found items, matches, and claims',
    description: 'Application menu for Campus Lost & Found Smart Matcher operations.',
    category: appCategory,
    roles: [deskStaff],
    active: true,
    order: 500,
})

// =============================================================================
// Modules
// =============================================================================

// Module 1: Dashboard
export const dashboardModule = Record({
    $id: Now.ID['module-dashboard'],
    table: 'sys_app_module',
    data: {
        title: 'Dashboard',
        application: campusLFMenu,
        link_type: 'DIRECT',
        query: '$pa_dashboard.do',
        hint: 'Open the Campus Lost and Found admin dashboard',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 100,
    },
})

// Module 2: Lost Items list
export const lostItemsModule = Record({
    $id: Now.ID['module-lost-items'],
    table: 'sys_app_module',
    data: {
        title: 'Lost Items',
        application: campusLFMenu,
        link_type: 'LIST',
        name: 'x_1927922_campus_l_lost_item',
        hint: 'View and manage lost item reports',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 200,
    },
})

// Module 3: Found Items list
export const foundItemsModule = Record({
    $id: Now.ID['module-found-items'],
    table: 'sys_app_module',
    data: {
        title: 'Found Items',
        application: campusLFMenu,
        link_type: 'LIST',
        name: 'x_1927922_campus_l_found_item',
        hint: 'View and manage found item inventory',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 300,
    },
})

// Module 4: Matches list
export const matchesModule = Record({
    $id: Now.ID['module-matches'],
    table: 'sys_app_module',
    data: {
        title: 'Matches',
        application: campusLFMenu,
        link_type: 'LIST',
        name: 'x_1927922_campus_l_match',
        hint: 'View and review item matches',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 400,
    },
})

// Module 5: Claims list
export const claimsModule = Record({
    $id: Now.ID['module-claims'],
    table: 'sys_app_module',
    data: {
        title: 'Claims',
        application: campusLFMenu,
        link_type: 'LIST',
        name: 'x_1927922_campus_l_claim',
        hint: 'View and process claims',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 500,
    },
})

// Module 6: Campus Locations list
export const locationsModule = Record({
    $id: Now.ID['module-campus-locations'],
    table: 'sys_app_module',
    data: {
        title: 'Campus Locations',
        application: campusLFMenu,
        link_type: 'LIST',
        name: 'x_1927922_campus_l_location',
        hint: 'View and manage campus locations',
        roles: ['x_1927922_campus_l.desk_staff'],
        active: true,
        order: 600,
    },
})
