-- Migration to enforce strict multi-tenancy (Tenant -> Firm -> Branch -> [Hotel/Entity])

-- 1. Add firm_id and branch_id to Hotels (it already has tenant_id)
ALTER TABLE [dbo].[hotels] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[hotels] ADD [branch_id] [bigint] NULL;

-- 2. Add tenant_id, firm_id, branch_id to Rooms
ALTER TABLE [dbo].[rooms] ADD [tenant_id] [bigint] NULL;
ALTER TABLE [dbo].[rooms] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[rooms] ADD [branch_id] [bigint] NULL;

-- 3. Add tenant_id, firm_id, branch_id to Room Types
ALTER TABLE [dbo].[room_types] ADD [tenant_id] [bigint] NULL;
ALTER TABLE [dbo].[room_types] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[room_types] ADD [branch_id] [bigint] NULL;

-- 4. Add tenant_id to Bookings (it was missing!), plus firm_id and branch_id
ALTER TABLE [dbo].[bookings] ADD [tenant_id] [bigint] NULL;
ALTER TABLE [dbo].[bookings] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[bookings] ADD [branch_id] [bigint] NULL;

-- 5. Add firm_id, branch_id to Guests (already has tenant_id)
ALTER TABLE [dbo].[guests] ADD [firm_id] [bigint] NULL;
ALTER TABLE [dbo].[guests] ADD [branch_id] [bigint] NULL;

-- 6. Add Foreign Keys (Optional but recommended, making nullable for now to avoid migration errors on existing data)
-- Assuming firms and branches tables exist as seen in schema

-- Example update query to populate data (Run manually after migration if data exists)
-- UPDATE h SET firm_id = (SELECT TOP 1 id FROM firms f WHERE f.tenant_id = h.tenant_id), 
--              branch_id = (SELECT TOP 1 id FROM branches b WHERE b.firm_id = (SELECT TOP 1 id FROM firms f WHERE f.tenant_id = h.tenant_id))
-- FROM hotels h;

-- After updating hotels, you can propagate to child tables:
-- UPDATE r SET tenant_id = h.tenant_id, firm_id = h.firm_id, branch_id = h.branch_id 
-- FROM rooms r JOIN hotels h ON r.hotel_id = h.id;
