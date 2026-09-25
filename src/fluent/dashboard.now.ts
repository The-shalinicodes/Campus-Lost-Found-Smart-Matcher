import '@servicenow/sdk/global'
import { Dashboard } from '@servicenow/sdk/core'

// =============================================================================
// Campus Lost & Found Admin Dashboard
// =============================================================================
// A centralized dashboard for campus security desk personnel with key metrics,
// lists, and analytics for managing lost and found operations.
// =============================================================================

export const campusLFDashboard = Dashboard({
    $id: Now.ID['campus-lf-admin-dashboard'],
    name: 'Campus Lost and Found Admin Dashboard',
    description:
        'Centralized dashboard for campus security desk personnel to manage lost and found operations, track items, matches, and claims.',
    permissions: [
        {
            $id: Now.ID['dashboard-perm-admin'],
            role: Now.ref('sys_user_role', { name: 'x_1927922_campus_l.admin' }),
            canRead: true,
            canWrite: true,
            canShare: true,
            owner: true,
        },
        {
            $id: Now.ID['dashboard-perm-desk-staff'],
            role: Now.ref('sys_user_role', { name: 'x_1927922_campus_l.desk_staff' }),
            canRead: true,
            canWrite: false,
            canShare: false,
            owner: false,
        },
    ],
    tabs: [
        // =====================================================================
        // Tab 1: Overview — Key indicators and recent activity lists
        // =====================================================================
        {
            $id: Now.ID['tab-overview'],
            name: 'Overview',
            widgets: [
                // ----- Row 0: Four single-score indicator widgets -----

                // 1. Active Lost Items Count
                {
                    $id: Now.ID['widget-active-lost-count'],
                    component: 'single-score',
                    height: 7,
                    width: 12,
                    position: { x: 0, y: 0 },
                    componentProps: {
                        headerTitle: 'Active Lost Items',
                        showHeader: true,
                        showBorder: true,
                        showZero: true,
                        description: 'Lost items in New or Searching state',
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_lost_item',
                                filterQuery: 'state=new^ORstate=searching',
                                id: 'ds_active_lost',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_active_lost',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // 2. Active Found Items Count
                {
                    $id: Now.ID['widget-active-found-count'],
                    component: 'single-score',
                    height: 7,
                    width: 12,
                    position: { x: 12, y: 0 },
                    componentProps: {
                        headerTitle: 'Active Found Items',
                        showHeader: true,
                        showBorder: true,
                        showZero: true,
                        description: 'Found items in Received or Cataloged state',
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_found_item',
                                filterQuery: 'state=received^ORstate=cataloged',
                                id: 'ds_active_found',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_active_found',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // 3. Pending Matches Count
                {
                    $id: Now.ID['widget-pending-matches-count'],
                    component: 'single-score',
                    height: 7,
                    width: 12,
                    position: { x: 24, y: 0 },
                    componentProps: {
                        headerTitle: 'Pending Matches',
                        showHeader: true,
                        showBorder: true,
                        showZero: true,
                        description: 'Matches in Pending or Reviewing state',
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_match',
                                filterQuery: 'state=pending^ORstate=reviewing',
                                id: 'ds_pending_matches',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_pending_matches',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // 4. Active Claims Count
                {
                    $id: Now.ID['widget-active-claims-count'],
                    component: 'single-score',
                    height: 7,
                    width: 12,
                    position: { x: 36, y: 0 },
                    componentProps: {
                        headerTitle: 'Active Claims',
                        showHeader: true,
                        showBorder: true,
                        showZero: true,
                        description: 'Claims in Submitted or Verifying state',
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_claim',
                                filterQuery: 'state=submitted^ORstate=verifying',
                                id: 'ds_active_claims',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_active_claims',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // ----- Section heading -----
                {
                    $id: Now.ID['widget-heading-recent-activity'],
                    component: 'heading',
                    height: 3,
                    width: 48,
                    position: { x: 0, y: 7 },
                    componentProps: {
                        label: 'Recent Activity',
                        variant: 'header-secondary',
                        level: '2',
                    },
                },

                // ----- Row 1: Recent activity lists -----

                // 5. Recent Lost Items
                {
                    $id: Now.ID['widget-recent-lost-items'],
                    component: 'list-simple',
                    height: 16,
                    width: 24,
                    position: { x: 0, y: 10 },
                    componentProps: {
                        listTitle: 'Recent Lost Items',
                        table: 'x_1927922_campus_l_lost_item',
                        query: '^ORDERBYDESCsys_created_on',
                        fixedQuery: '',
                        columns:
                            'number,short_description,category,state,last_seen_location,last_seen_date',
                        limit: 10,
                        showBorder: true,
                    },
                },

                // 6. Found Items Awaiting Processing
                {
                    $id: Now.ID['widget-found-awaiting-processing'],
                    component: 'list-simple',
                    height: 16,
                    width: 24,
                    position: { x: 24, y: 10 },
                    componentProps: {
                        listTitle: 'Found Items Awaiting Processing',
                        table: 'x_1927922_campus_l_found_item',
                        query: 'state=received^ORDERBYDESCsys_created_on',
                        fixedQuery: '',
                        columns:
                            'number,short_description,category,found_location,found_date,found_by',
                        limit: 10,
                        showBorder: true,
                    },
                },
            ],
        },

        // =====================================================================
        // Tab 2: Matches & Claims — Action-oriented lists for desk staff
        // =====================================================================
        {
            $id: Now.ID['tab-matches-claims'],
            name: 'Matches & Claims',
            widgets: [
                // 7. High Confidence Matches
                {
                    $id: Now.ID['widget-high-confidence-matches'],
                    component: 'list-simple',
                    height: 20,
                    width: 24,
                    position: { x: 0, y: 0 },
                    componentProps: {
                        listTitle: 'High Confidence Matches (≥70%)',
                        table: 'x_1927922_campus_l_match',
                        query: 'confidence_score>=70^stateINpending,reviewing^ORDERBYDESCconfidence_score',
                        fixedQuery: '',
                        columns:
                            'number,lost_item,found_item,confidence_score,state',
                        limit: 15,
                        showBorder: true,
                    },
                },

                // 8. Claims Pending Verification
                {
                    $id: Now.ID['widget-claims-pending-verification'],
                    component: 'list-simple',
                    height: 20,
                    width: 24,
                    position: { x: 24, y: 0 },
                    componentProps: {
                        listTitle: 'Claims Pending Verification',
                        table: 'x_1927922_campus_l_claim',
                        query: 'state=verifying^ORDERBYDESCsys_created_on',
                        fixedQuery: '',
                        columns:
                            'number,match,claimant,verification_method,verified_by',
                        limit: 15,
                        showBorder: true,
                    },
                },
            ],
        },

        // =====================================================================
        // Tab 3: Analytics — Charts and performance metrics
        // =====================================================================
        {
            $id: Now.ID['tab-analytics'],
            name: 'Analytics',
            widgets: [
                // 9. Match Success Rate — Donut chart
                {
                    $id: Now.ID['widget-match-success-rate'],
                    component: 'donut',
                    height: 18,
                    width: 24,
                    position: { x: 0, y: 0 },
                    componentProps: {
                        headerTitle: 'Match Success Rate',
                        showHeader: true,
                        showBorder: true,
                        showLegend: true,
                        legendPosition: 'bottom',
                        showDataLabels: true,
                        showPercentageOfTotalInTooltip: true,
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_match',
                                filterQuery: 'stateINconfirmed,rejected,expired',
                                id: 'ds_match_outcomes',
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'ds_match_outcomes',
                                        groupByField: 'state',
                                        isChoice: true,
                                    },
                                ],
                                maxNumberOfGroups: 'ALL',
                                sortBy: 'value',
                                sortByOrder: 'desc',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_match_outcomes',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // 10. Items by Category — Vertical bar chart
                {
                    $id: Now.ID['widget-items-by-category'],
                    component: 'vertical-bar',
                    height: 18,
                    width: 24,
                    position: { x: 24, y: 0 },
                    componentProps: {
                        headerTitle: 'Lost Items by Category',
                        showHeader: true,
                        showBorder: true,
                        showLegend: false,
                        showDataLabels: true,
                        dataSources: [
                            {
                                sourceType: 'table',
                                tableOrViewName: 'x_1927922_campus_l_lost_item',
                                filterQuery: '',
                                id: 'ds_lost_categories',
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'ds_lost_categories',
                                        groupByField: 'category',
                                        isChoice: true,
                                    },
                                ],
                                maxNumberOfGroups: 'ALL',
                                sortBy: 'value',
                                sortByOrder: 'desc',
                            },
                        ],
                        metrics: [
                            {
                                dataSource: 'ds_lost_categories',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                            },
                        ],
                    },
                },

                // Section heading for unclaimed items
                {
                    $id: Now.ID['widget-heading-unclaimed'],
                    component: 'heading',
                    height: 3,
                    width: 48,
                    position: { x: 0, y: 18 },
                    componentProps: {
                        label: 'Unclaimed Items',
                        variant: 'header-secondary',
                        level: '2',
                    },
                },

                // 11. Unclaimed Items Timeline
                {
                    $id: Now.ID['widget-unclaimed-items'],
                    component: 'list-simple',
                    height: 14,
                    width: 48,
                    position: { x: 0, y: 21 },
                    componentProps: {
                        listTitle: 'Unclaimed Items (May Need Disposal)',
                        table: 'x_1927922_campus_l_found_item',
                        query: 'state=unclaimed^ORDERBYDESCfound_date',
                        fixedQuery: '',
                        columns:
                            'number,short_description,category,found_date,found_location,storage_location',
                        limit: 20,
                        showBorder: true,
                    },
                },
            ],
        },
    ],
})
