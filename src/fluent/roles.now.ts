import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// =============================================================================
// Campus Lost and Found – Roles
// =============================================================================

// Base role for students
export const student = Role({
    name: 'x_1927922_campus_l.student',
    description: 'Base role for students – can report lost items and file claims',
})

// Desk staff role – inherits student permissions
export const deskStaff = Role({
    name: 'x_1927922_campus_l.desk_staff',
    containsRoles: [student],
    description: 'Front desk staff – can log found items, review matches, and process claims',
})

// Admin role – inherits desk staff permissions (and transitively student)
export const admin = Role({
    name: 'x_1927922_campus_l.admin',
    containsRoles: [deskStaff],
    description: 'Full administrative access to Campus Lost and Found',
})
