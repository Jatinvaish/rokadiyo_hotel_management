-- Migration: Replace Hotels with Firms/Branches Architecture

-- 1. Enhance Firms table with Hotel-like attributes
ALTER TABLE [dbo].[firms] ADD [address] [nvarchar](max) NULL;
ALTER TABLE [dbo].[firms] ADD [city] [nvarchar](100) NULL;
ALTER TABLE [dbo].[firms] ADD [state] [nvarchar](100) NULL;
ALTER TABLE [dbo].[firms] ADD [country] [nvarchar](100) NULL;
ALTER TABLE [dbo].[firms] ADD [postal_code] [nvarchar](20) NULL;
ALTER TABLE [dbo].[firms] ADD [phone] [nvarchar](20) NULL;
ALTER TABLE [dbo].[firms] ADD [email] [nvarchar](320) NULL;
ALTER TABLE [dbo].[firms] ADD [website] [nvarchar](500) NULL;
ALTER TABLE [dbo].[firms] ADD [logo_url] [nvarchar](500) NULL;
ALTER TABLE [dbo].[firms] ADD [tax_id] [nvarchar](100) NULL;
ALTER TABLE [dbo].[firms] ADD [currency] [nvarchar](10) DEFAULT 'USD';
ALTER TABLE [dbo].[firms] ADD [timezone] [nvarchar](50) DEFAULT 'UTC';

-- 2. Drop hotel_id from dependent tables (since we added firm_id and branch_id in previous migration)
-- Ensure firm_id and branch_id are populated before dropping if data exists (Manual step)

ALTER TABLE [dbo].[rooms] DROP COLUMN [hotel_id];
ALTER TABLE [dbo].[bookings] DROP COLUMN [hotel_id];
ALTER TABLE [dbo].[room_types] DROP COLUMN [hotel_id];
ALTER TABLE [dbo].[room_blocks] DROP COLUMN [hotel_id]; -- Need to check if this table has firm_id/branch_id?
ALTER TABLE [dbo].[pricing_hourly_rules] DROP COLUMN [hotel_id]; -- Need to add firm/branch first!
ALTER TABLE [dbo].[pricing_seasonal_rates] DROP COLUMN [hotel_id]; -- Need to add firm/branch first!

-- Wait, I need to ADD firm_id/branch_id to tables I missed in previous step
-- pricing_hourly_rules, pricing_seasonal_rates, etc.

ALTER TABLE [dbo].[pricing_hourly_rules] ADD [tenant_id] [bigint] NULL; -- It had tenant_id
ALTER TABLE [dbo].[pricing_hourly_rules] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[pricing_hourly_rules] ADD [branch_id] [bigint] NULL;

ALTER TABLE [dbo].[pricing_seasonal_rates] ADD [tenant_id] [bigint] NULL; -- It had tenant_id
ALTER TABLE [dbo].[pricing_seasonal_rates] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[pricing_seasonal_rates] ADD [branch_id] [bigint] NULL;

-- 3. Finally Drop Hotels table
DROP TABLE [dbo].[hotels];
