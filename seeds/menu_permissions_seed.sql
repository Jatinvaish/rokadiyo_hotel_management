-- =============================================================================
-- SUPER ADMIN MENU SEED
-- Insert menu items for the super admin panel into menu_permissions table.
-- These menus appear for super_admin because menu_key does NOT contain 'tenant_'
-- Run this script ONCE against: rokadiyo_hotel_mgmt
-- DO NOT modify table.sql — this is only data seeding.
-- =============================================================================

USE [rokadiyo_hotel_mgmt];

-- ===================== SUPER ADMIN TOP-LEVEL MENUS =====================

MERGE INTO menu_permissions AS target
USING (VALUES
  -- Dashboard
  ('dashboard',          'Dashboard',             NULL,          'Home',         '/dashboard',                              1,  'any'),
  -- Tenants
  ('tenants',            'Tenants',               NULL,          'Building2',    '/dashboard/admin',                        2,  'any'),
  ('tenants_list',       'All Tenants',           'tenants',     'List',         '/dashboard/admin',                        1,  'any'),
  ('tenants_create',     'Create Tenant',         'tenants',     'Plus',         '/dashboard/admin',                        2,  'any'),
  -- Subscription Management
  ('subscriptions',      'Subscriptions',         NULL,          'CreditCard',   '/dashboard/subscription-management',      3,  'any'),
  ('sub_plans',          'Manage Plans',          'subscriptions','CreditCard',  '/dashboard/subscription-management',      1,  'any'),
  ('sub_tenants',        'Assign to Tenants',     'subscriptions','Building',    '/dashboard/subscription-management/tenants',2,'any'),
  -- Access Control
  ('access_control',     'Access Control',        NULL,          'Shield',       '/dashboard/access-control',               4,  'any'),
  ('roles',              'Roles',                 'access_control','Lock',       '/dashboard/access-control',               1,  'any'),
  ('permissions',        'Permissions',           'access_control','Key',        '/dashboard/access-control',               2,  'any'),
  ('menus',              'Menu Management',       'access_control','Layout',     '/dashboard/access-control',               3,  'any'),
  -- Reports & Analytics
  ('reports',            'Reports',               NULL,          'BarChart3',    '/dashboard/reports',                      5,  'any'),
  ('report_bookings',    'Bookings Report',       'reports',     'Calendar',     '/dashboard/reports/bookings',             1,  'any'),
  ('report_revenue',     'Revenue Report',        'reports',     'TrendingUp',   '/dashboard/reports/revenue',              2,  'any'),
  ('report_occupancy',   'Occupancy Report',      'reports',     'BarChart',     '/dashboard/reports/occupancy',            3,  'any'),
  ('analytics',          'Analytics',             NULL,          'Activity',     '/dashboard/analytics',                    6,  'any'),
  -- Settings
  ('settings',           'Settings',              NULL,          'Settings',     '/dashboard/settings',                     7,  'any')
) AS source (menu_key, menu_name, parent_menu_key, icon, route, display_order, match_type)
ON target.menu_key = source.menu_key
WHEN NOT MATCHED BY TARGET THEN
  INSERT (menu_key, menu_name, parent_menu_key, icon, route, display_order, match_type, status, is_active, created_at)
  VALUES (source.menu_key, source.menu_name, source.parent_menu_key, source.icon, source.route, source.display_order, source.match_type, 'active', 1, GETUTCDATE())
WHEN MATCHED THEN
  UPDATE SET
    menu_name     = source.menu_name,
    icon          = source.icon,
    route         = source.route,
    display_order = source.display_order,
    match_type    = source.match_type,
    is_active     = 1,
    status        = 'active',
    updated_at    = GETUTCDATE();

PRINT 'Super admin menus seeded successfully.';

-- ===================== TENANT ADMIN MENUS =====================
-- These have 'tenant_' prefix so they show for tenant_admin role

MERGE INTO menu_permissions AS target
USING (VALUES
  ('tenant_dashboard',     'Dashboard',          NULL,               'Home',       '/dashboard',                    1, 'any'),
  ('tenant_hotels',        'Hotels',             NULL,               'Building2',  '/dashboard/hotels',             2, 'any'),
  ('tenant_rooms',         'Rooms',              NULL,               'Bed',        '/dashboard/rooms',              3, 'any'),
  ('tenant_guests',        'Guests',             NULL,               'Users',      '/dashboard/guests',             4, 'any'),
  ('tenant_bookings',      'Bookings',           NULL,               'Calendar',   '/dashboard/bookings',           5, 'any'),
  ('tenant_reports',       'Reports',            NULL,               'BarChart3',  '/dashboard/reports',            6, 'any'),
  ('tenant_rpt_revenue',   'Revenue Report',     'tenant_reports',   'TrendingUp', '/dashboard/reports/revenue',    2, 'any'),
  ('tenant_analytics',     'Analytics',          NULL,               'Activity',   '/dashboard/analytics',          7, 'any'),
  ('tenant_settings',      'Settings',           NULL,               'Settings',   '/dashboard/settings',           8, 'any'),
  ('tenant_billing',       'Billing',            'tenant_settings',  'CreditCard', '/dashboard/settings?tab=billing',1,'any')
) AS source (menu_key, menu_name, parent_menu_key, icon, route, display_order, match_type)
ON target.menu_key = source.menu_key
WHEN NOT MATCHED BY TARGET THEN
  INSERT (menu_key, menu_name, parent_menu_key, icon, route, display_order, match_type, status, is_active, created_at)
  VALUES (source.menu_key, source.menu_name, source.parent_menu_key, source.icon, source.route, source.display_order, source.match_type, 'active', 1, GETUTCDATE())
WHEN MATCHED THEN
  UPDATE SET
    menu_name     = source.menu_name,
    icon          = source.icon,
    route         = source.route,
    display_order = source.display_order,
    match_type    = source.match_type,
    is_active     = 1,
    status        = 'active',
    updated_at    = GETUTCDATE();

PRINT 'Tenant admin menus seeded successfully.';
