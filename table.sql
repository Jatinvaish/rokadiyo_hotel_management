USE [rokadiyo_hotel_mgmt]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[menu_permissions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[menu_permissions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[menu_permissions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[menu_key] [nvarchar](100) NOT NULL,
	[menu_name] [nvarchar](255) NULL,
	[parent_menu_key] [nvarchar](100) NULL,
	[permission_ids] [nvarchar](max) NULL,
	[match_type] [nvarchar](20) NOT NULL,
	[display_order] [int] NULL,
	[icon] [nvarchar](100) NULL,
	[route] [nvarchar](500) NULL,
	[status] [nvarchar](20) NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[menu_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[policies]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[policies]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[policies](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[policy_key] [nvarchar](100) NOT NULL,
	[policy_name] [nvarchar](255) NULL,
	[permission_id] [bigint] NULL,
	[role_id] [bigint] NULL,
	[policy_type] [nvarchar](50) NOT NULL,
	[effect] [nvarchar](10) NOT NULL,
	[condition] [nvarchar](max) NOT NULL,
	[priority] [int] NOT NULL,
	[tenant_id] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
	[status] [nvarchar](20) NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[policy_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[resources]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[resources]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[resources](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[resource_key] [nvarchar](100) NOT NULL,
	[resource_name] [nvarchar](255) NULL,
	[parent_id] [bigint] NULL,
	[module] [nvarchar](100) NULL,
	[status] [nvarchar](20) NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[resource_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[daily_reports]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[daily_reports]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[daily_reports](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[report_date] [date] NOT NULL,
	[total_rooms] [int] NOT NULL,
	[occupied_rooms] [int] NOT NULL,
	[available_rooms] [int] NOT NULL,
	[blocked_rooms] [int] NOT NULL,
	[occupancy_percent] [decimal](5, 2) NULL,
	[total_revenue] [decimal](10, 2) NULL,
	[room_revenue] [decimal](10, 2) NULL,
	[fb_revenue] [decimal](10, 2) NULL,
	[other_revenue] [decimal](10, 2) NULL,
	[total_checkins] [int] NULL,
	[total_checkouts] [int] NULL,
	[no_shows] [int] NULL,
	[cancellations] [int] NULL,
	[adr] [decimal](10, 2) NULL,
	[revpar] [decimal](10, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[loyalty_transactions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[loyalty_transactions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[loyalty_transactions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[booking_id] [bigint] NULL,
	[transaction_type] [nvarchar](30) NOT NULL,
	[points] [int] NOT NULL,
	[description] [nvarchar](max) NULL,
	[transaction_date] [datetime2](7) NULL,
	[expires_at] [date] NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[revenue_reports]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[revenue_reports]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[revenue_reports](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[report_period] [nvarchar](20) NOT NULL,
	[period_start] [date] NOT NULL,
	[period_end] [date] NOT NULL,
	[room_revenue] [decimal](10, 2) NULL,
	[fb_revenue] [decimal](10, 2) NULL,
	[service_revenue] [decimal](10, 2) NULL,
	[other_revenue] [decimal](10, 2) NULL,
	[total_revenue] [decimal](10, 2) NULL,
	[taxes] [decimal](10, 2) NULL,
	[net_revenue] [decimal](10, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[occupancy_reports]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[occupancy_reports]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[occupancy_reports](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[report_date] [date] NOT NULL,
	[room_type_id] [bigint] NULL,
	[total_rooms] [int] NOT NULL,
	[occupied] [int] NOT NULL,
	[available] [int] NOT NULL,
	[occupancy_percent] [decimal](5, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[lost_and_found]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[lost_and_found]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[lost_and_found](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[room_id] [bigint] NULL,
	[booking_id] [bigint] NULL,
	[item_description] [nvarchar](max) NOT NULL,
	[found_by] [bigint] NULL,
	[found_date] [datetime2](7) NULL,
	[found_location] [nvarchar](255) NULL,
	[category] [nvarchar](100) NULL,
	[status] [nvarchar](30) NULL,
	[storage_location] [nvarchar](255) NULL,
	[claimed_by_guest_id] [bigint] NULL,
	[claimed_date] [datetime2](7) NULL,
	[disposal_date] [datetime2](7) NULL,
	[images] [nvarchar](max) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[email_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[email_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[email_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[recipient_email] [nvarchar](320) NOT NULL,
	[subject] [nvarchar](255) NOT NULL,
	[body] [nvarchar](max) NOT NULL,
	[provider] [nvarchar](50) NULL,
	[message_id] [nvarchar](100) NULL,
	[status] [nvarchar](20) NULL,
	[sent_at] [datetime2](7) NULL,
	[opened_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_blocks]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_blocks]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_blocks](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_id] [bigint] NOT NULL,
	[block_type] [nvarchar](30) NOT NULL,
	[start_date] [datetime2](7) NOT NULL,
	[end_date] [datetime2](7) NOT NULL,
	[blocked_by] [bigint] NULL,
	[reason] [nvarchar](max) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[sms_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[sms_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[sms_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[recipient_phone] [nvarchar](20) NOT NULL,
	[message] [nvarchar](max) NOT NULL,
	[provider] [nvarchar](50) NULL,
	[message_id] [nvarchar](100) NULL,
	[status] [nvarchar](20) NULL,
	[sent_at] [datetime2](7) NULL,
	[delivered_at] [datetime2](7) NULL,
	[cost] [decimal](10, 4) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[loyalty_programs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[loyalty_programs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[loyalty_programs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NULL,
	[program_name] [nvarchar](100) NOT NULL,
	[tier_name] [nvarchar](50) NOT NULL,
	[points_per_currency] [decimal](10, 2) NULL,
	[min_points_required] [int] NULL,
	[benefits] [nvarchar](max) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[notifications]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[notifications]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[notifications](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NULL,
	[guest_id] [bigint] NULL,
	[notification_type] [nvarchar](50) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[message] [nvarchar](max) NOT NULL,
	[action_url] [nvarchar](500) NULL,
	[is_read] [bit] NULL,
	[read_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_communications]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_communications]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_communications](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[booking_id] [bigint] NULL,
	[communication_type] [nvarchar](30) NOT NULL,
	[subject] [nvarchar](255) NULL,
	[message] [nvarchar](max) NOT NULL,
	[sent_at] [datetime2](7) NULL,
	[delivered_at] [datetime2](7) NULL,
	[read_at] [datetime2](7) NULL,
	[status] [nvarchar](20) NULL,
	[error_message] [nvarchar](max) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[travel_agent_commissions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[travel_agent_commissions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[travel_agent_commissions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[agent_name] [nvarchar](255) NOT NULL,
	[agent_code] [nvarchar](50) NOT NULL,
	[contact_person] [nvarchar](255) NULL,
	[contact_email] [nvarchar](320) NULL,
	[contact_phone] [nvarchar](20) NULL,
	[commission_percent] [decimal](5, 2) NOT NULL,
	[payment_terms] [nvarchar](100) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[corporate_contracts]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[corporate_contracts]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[corporate_contracts](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[company_name] [nvarchar](255) NOT NULL,
	[contact_person] [nvarchar](255) NOT NULL,
	[contact_email] [nvarchar](320) NOT NULL,
	[contact_phone] [nvarchar](20) NOT NULL,
	[discount_percent] [decimal](5, 2) NULL,
	[special_rate] [decimal](10, 2) NULL,
	[credit_limit] [decimal](10, 2) NULL,
	[payment_terms_days] [int] NULL,
	[contract_start] [date] NOT NULL,
	[contract_end] [date] NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_reviews]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_reviews]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_reviews](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[overall_rating] [int] NOT NULL,
	[cleanliness_rating] [int] NULL,
	[service_rating] [int] NULL,
	[amenities_rating] [int] NULL,
	[value_rating] [int] NULL,
	[location_rating] [int] NULL,
	[review_title] [nvarchar](255) NULL,
	[review_text] [nvarchar](max) NULL,
	[pros] [nvarchar](max) NULL,
	[cons] [nvarchar](max) NULL,
	[would_recommend] [bit] NULL,
	[is_verified] [bit] NULL,
	[is_published] [bit] NULL,
	[response_text] [nvarchar](max) NULL,
	[responded_by] [bigint] NULL,
	[responded_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[promo_usage]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[promo_usage]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[promo_usage](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[promotion_id] [bigint] NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[discount_applied] [decimal](10, 2) NOT NULL,
	[used_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[shifts]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[shifts]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[shifts](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[shift_name] [nvarchar](50) NOT NULL,
	[start_time] [time](7) NOT NULL,
	[end_time] [time](7) NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[staff_schedules]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[staff_schedules]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[staff_schedules](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[staff_id] [bigint] NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[shift_id] [bigint] NOT NULL,
	[schedule_date] [date] NOT NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[staff_leaves]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[staff_leaves]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[staff_leaves](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[staff_id] [bigint] NOT NULL,
	[leave_type] [nvarchar](30) NOT NULL,
	[from_date] [date] NOT NULL,
	[to_date] [date] NOT NULL,
	[total_days] [int] NOT NULL,
	[reason] [nvarchar](max) NULL,
	[status] [nvarchar](20) NULL,
	[approved_by] [bigint] NULL,
	[approved_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[promotions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[promotions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[promotions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NULL,
	[promo_code] [nvarchar](50) NOT NULL,
	[promo_name] [nvarchar](255) NOT NULL,
	[promo_type] [nvarchar](30) NOT NULL,
	[discount_percent] [decimal](5, 2) NULL,
	[discount_amount] [decimal](10, 2) NULL,
	[min_nights] [int] NULL,
	[min_amount] [decimal](10, 2) NULL,
	[max_discount] [decimal](10, 2) NULL,
	[applicable_room_types] [nvarchar](max) NULL,
	[booking_window_start] [date] NULL,
	[booking_window_end] [date] NULL,
	[stay_period_start] [date] NULL,
	[stay_period_end] [date] NULL,
	[usage_limit] [int] NULL,
	[usage_count] [int] NULL,
	[per_user_limit] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[staff_attendance]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[staff_attendance]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[staff_attendance](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[staff_id] [bigint] NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[attendance_date] [date] NOT NULL,
	[check_in_time] [datetime2](7) NULL,
	[check_out_time] [datetime2](7) NULL,
	[status] [nvarchar](20) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[departments]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[departments]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[departments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[department_name] [nvarchar](100) NOT NULL,
	[department_head_id] [bigint] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[spa_services]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[spa_services]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[spa_services](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[service_name] [nvarchar](255) NOT NULL,
	[duration_minutes] [int] NOT NULL,
	[price] [decimal](10, 2) NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[laundry_items]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[laundry_items]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[laundry_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[laundry_service_id] [bigint] NOT NULL,
	[item_name] [nvarchar](100) NOT NULL,
	[quantity] [int] NOT NULL,
	[service_type] [nvarchar](30) NOT NULL,
	[unit_price] [decimal](10, 2) NOT NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[laundry_services]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[laundry_services]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[laundry_services](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_service_id] [bigint] NOT NULL,
	[pickup_at] [datetime2](7) NULL,
	[delivery_at] [datetime2](7) NULL,
	[urgency] [nvarchar](20) NULL,
	[express_charges] [decimal](10, 2) NULL,
	[total_items] [int] NULL,
	[total_charges] [decimal](10, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[transport_services]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[transport_services]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[transport_services](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_service_id] [bigint] NOT NULL,
	[pickup_location] [nvarchar](255) NULL,
	[drop_location] [nvarchar](255) NOT NULL,
	[vehicle_type] [nvarchar](50) NULL,
	[scheduled_time] [datetime2](7) NOT NULL,
	[driver_name] [nvarchar](100) NULL,
	[driver_phone] [nvarchar](20) NULL,
	[vehicle_number] [nvarchar](50) NULL,
	[charges] [decimal](10, 2) NULL,
	[status] [nvarchar](30) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_services]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_services]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_services](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[service_id] [bigint] NOT NULL,
	[room_id] [bigint] NULL,
	[requested_at] [datetime2](7) NULL,
	[scheduled_for] [datetime2](7) NULL,
	[assigned_to] [bigint] NULL,
	[status] [nvarchar](30) NULL,
	[completed_at] [datetime2](7) NULL,
	[quantity] [int] NULL,
	[charges] [decimal](10, 2) NULL,
	[is_complimentary] [bit] NULL,
	[guest_rating] [int] NULL,
	[guest_feedback] [nvarchar](max) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[kitchen_orders]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[kitchen_orders]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[kitchen_orders](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[food_order_id] [bigint] NOT NULL,
	[assigned_to] [bigint] NULL,
	[started_at] [datetime2](7) NULL,
	[completed_at] [datetime2](7) NULL,
	[status] [nvarchar](30) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[service_categories]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[service_categories]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[service_categories](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[category_name] [nvarchar](100) NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[food_order_items]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[food_order_items]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[food_order_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_id] [bigint] NOT NULL,
	[menu_item_id] [bigint] NOT NULL,
	[variant_id] [bigint] NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [decimal](10, 2) NOT NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[special_instructions] [nvarchar](max) NULL,
	[status] [nvarchar](30) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[services]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[services]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[services](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[category_id] [bigint] NULL,
	[service_code] [nvarchar](50) NULL,
	[service_name] [nvarchar](255) NOT NULL,
	[description] [nvarchar](max) NULL,
	[service_type] [nvarchar](50) NOT NULL,
	[base_price] [decimal](10, 2) NULL,
	[is_chargeable] [bit] NULL,
	[estimated_duration_minutes] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[food_orders]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[food_orders]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[food_orders](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_number] [nvarchar](50) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[booking_id] [bigint] NULL,
	[room_id] [bigint] NULL,
	[guest_id] [bigint] NULL,
	[order_type] [nvarchar](30) NOT NULL,
	[restaurant_id] [bigint] NULL,
	[table_number] [nvarchar](20) NULL,
	[order_date] [datetime2](7) NULL,
	[subtotal] [decimal](10, 2) NOT NULL,
	[tax_amount] [decimal](10, 2) NULL,
	[service_charge] [decimal](10, 2) NULL,
	[delivery_charge] [decimal](10, 2) NULL,
	[total_amount] [decimal](10, 2) NOT NULL,
	[status] [nvarchar](30) NULL,
	[payment_status] [nvarchar](20) NULL,
	[special_instructions] [nvarchar](max) NULL,
	[estimated_time] [datetime2](7) NULL,
	[delivered_at] [datetime2](7) NULL,
	[cancelled_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[restaurants]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[restaurants]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[restaurants](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[restaurant_name] [nvarchar](100) NOT NULL,
	[cuisine_type] [nvarchar](100) NULL,
	[seating_capacity] [int] NULL,
	[opening_time] [time](7) NULL,
	[closing_time] [time](7) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[inventory_transactions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[inventory_transactions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[inventory_transactions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[inventory_item_id] [bigint] NOT NULL,
	[transaction_type] [nvarchar](30) NOT NULL,
	[quantity] [decimal](10, 2) NOT NULL,
	[unit_cost] [decimal](10, 2) NULL,
	[total_cost] [decimal](10, 2) NULL,
	[room_id] [bigint] NULL,
	[booking_id] [bigint] NULL,
	[reference_no] [nvarchar](100) NULL,
	[notes] [nvarchar](max) NULL,
	[transaction_date] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[inventory_items]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[inventory_items]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[inventory_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[category_id] [bigint] NULL,
	[item_code] [nvarchar](50) NOT NULL,
	[item_name] [nvarchar](255) NOT NULL,
	[description] [nvarchar](max) NULL,
	[unit] [nvarchar](50) NULL,
	[current_stock] [decimal](10, 2) NULL,
	[min_stock_level] [decimal](10, 2) NULL,
	[reorder_level] [decimal](10, 2) NULL,
	[max_stock_level] [decimal](10, 2) NULL,
	[unit_cost] [decimal](10, 2) NULL,
	[location] [nvarchar](255) NULL,
	[supplier_id] [bigint] NULL,
	[is_consumable] [bit] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[inventory_categories]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[inventory_categories]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[inventory_categories](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[category_name] [nvarchar](100) NOT NULL,
	[parent_category_id] [bigint] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[inventory_alerts]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[inventory_alerts]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[inventory_alerts](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[inventory_item_id] [bigint] NOT NULL,
	[alert_type] [nvarchar](30) NOT NULL,
	[alert_message] [nvarchar](max) NOT NULL,
	[is_read] [bit] NULL,
	[is_resolved] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[resolved_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[inventory_suppliers]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[inventory_suppliers]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[inventory_suppliers](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[supplier_name] [nvarchar](255) NOT NULL,
	[contact_person] [nvarchar](255) NULL,
	[phone] [nvarchar](20) NOT NULL,
	[email] [nvarchar](320) NULL,
	[address] [nvarchar](max) NULL,
	[payment_terms] [nvarchar](100) NULL,
	[rating] [decimal](2, 1) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_maintenance]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_maintenance]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_maintenance](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_id] [bigint] NOT NULL,
	[maintenance_type] [nvarchar](50) NOT NULL,
	[issue_description] [nvarchar](max) NOT NULL,
	[priority] [nvarchar](20) NULL,
	[reported_by] [bigint] NULL,
	[reported_at] [datetime2](7) NULL,
	[assigned_to] [bigint] NULL,
	[vendor_id] [bigint] NULL,
	[scheduled_at] [datetime2](7) NULL,
	[started_at] [datetime2](7) NULL,
	[completed_at] [datetime2](7) NULL,
	[status] [nvarchar](30) NULL,
	[estimated_cost] [decimal](10, 2) NULL,
	[actual_cost] [decimal](10, 2) NULL,
	[parts_used] [nvarchar](max) NULL,
	[resolution_notes] [nvarchar](max) NULL,
	[images] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[maintenance_vendors]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[maintenance_vendors]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[maintenance_vendors](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[vendor_name] [nvarchar](255) NOT NULL,
	[vendor_type] [nvarchar](50) NULL,
	[contact_person] [nvarchar](255) NULL,
	[phone] [nvarchar](20) NOT NULL,
	[email] [nvarchar](320) NULL,
	[address] [nvarchar](max) NULL,
	[specialization] [nvarchar](max) NULL,
	[rating] [decimal](2, 1) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[housekeeping_staff_assignments]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[housekeeping_staff_assignments]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[housekeeping_staff_assignments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[staff_id] [bigint] NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[assigned_date] [date] NOT NULL,
	[assigned_floors] [nvarchar](100) NULL,
	[assigned_rooms] [nvarchar](max) NULL,
	[shift] [nvarchar](30) NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[maintenance_schedules]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[maintenance_schedules]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[maintenance_schedules](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[room_id] [bigint] NULL,
	[equipment_name] [nvarchar](255) NOT NULL,
	[maintenance_type] [nvarchar](50) NOT NULL,
	[frequency] [nvarchar](30) NOT NULL,
	[last_done_at] [date] NULL,
	[next_due_at] [date] NOT NULL,
	[assigned_to] [bigint] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[cleaning_checklists]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[cleaning_checklists]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[cleaning_checklists](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[checklist_name] [nvarchar](100) NOT NULL,
	[cleaning_type] [nvarchar](30) NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_cleaning_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_cleaning_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_cleaning_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_id] [bigint] NOT NULL,
	[booking_id] [bigint] NULL,
	[cleaning_type] [nvarchar](30) NOT NULL,
	[assigned_to] [bigint] NULL,
	[priority] [nvarchar](20) NULL,
	[scheduled_at] [datetime2](7) NULL,
	[started_at] [datetime2](7) NULL,
	[completed_at] [datetime2](7) NULL,
	[inspected_at] [datetime2](7) NULL,
	[inspected_by] [bigint] NULL,
	[status] [nvarchar](30) NULL,
	[inspection_notes] [nvarchar](max) NULL,
	[issues_found] [nvarchar](max) NULL,
	[items_replenished] [nvarchar](max) NULL,
	[time_taken_minutes] [int] NULL,
	[rating] [int] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[cleaning_checklist_items]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[cleaning_checklist_items]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[cleaning_checklist_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[checklist_id] [bigint] NOT NULL,
	[item_description] [nvarchar](255) NOT NULL,
	[is_mandatory] [bit] NULL,
	[display_order] [int] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[cleaning_checklist_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[cleaning_checklist_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[cleaning_checklist_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[cleaning_log_id] [bigint] NOT NULL,
	[checklist_item_id] [bigint] NOT NULL,
	[is_completed] [bit] NULL,
	[notes] [nvarchar](max) NULL,
	[completed_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_inventory]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_inventory]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_inventory](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_room_mapping_id] [bigint] NOT NULL,
	[date] [date] NOT NULL,
	[available_rooms] [int] NOT NULL,
	[sold_rooms] [int] NULL,
	[blocked_rooms] [int] NULL,
	[last_updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_rate_mappings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_rate_mappings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_rate_mappings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_integration_id] [bigint] NOT NULL,
	[rate_plan_id] [bigint] NOT NULL,
	[channel_rate_id] [nvarchar](100) NOT NULL,
	[channel_rate_name] [nvarchar](255) NULL,
	[markup_percent] [decimal](5, 2) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_rates]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_rates]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_rates](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_rate_mapping_id] [bigint] NOT NULL,
	[date] [date] NOT NULL,
	[rate] [decimal](10, 2) NOT NULL,
	[min_stay] [int] NULL,
	[max_stay] [int] NULL,
	[closed_to_arrival] [bit] NULL,
	[closed_to_departure] [bit] NULL,
	[stop_sell] [bit] NULL,
	[last_updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_sync_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_sync_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_sync_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_integration_id] [bigint] NOT NULL,
	[sync_type] [nvarchar](30) NOT NULL,
	[sync_direction] [nvarchar](20) NOT NULL,
	[status] [nvarchar](20) NOT NULL,
	[records_processed] [int] NULL,
	[records_failed] [int] NULL,
	[error_message] [nvarchar](max) NULL,
	[started_at] [datetime2](7) NULL,
	[completed_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_bookings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_bookings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_bookings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_integration_id] [bigint] NOT NULL,
	[booking_id] [bigint] NULL,
	[channel_booking_id] [nvarchar](100) NOT NULL,
	[channel_confirmation_code] [nvarchar](100) NULL,
	[guest_name] [nvarchar](255) NOT NULL,
	[guest_email] [nvarchar](320) NULL,
	[guest_phone] [nvarchar](20) NULL,
	[check_in] [date] NOT NULL,
	[check_out] [date] NOT NULL,
	[adults] [int] NOT NULL,
	[children] [int] NULL,
	[total_amount] [decimal](10, 2) NOT NULL,
	[commission] [decimal](10, 2) NULL,
	[status] [nvarchar](30) NULL,
	[imported_at] [datetime2](7) NULL,
	[synced_at] [datetime2](7) NULL,
	[raw_data] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[housekeeping_tasks]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[housekeeping_tasks]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[housekeeping_tasks](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[task_name] [nvarchar](100) NOT NULL,
	[task_type] [nvarchar](30) NOT NULL,
	[description] [nvarchar](max) NULL,
	[estimated_minutes] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_room_mappings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_room_mappings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_room_mappings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_integration_id] [bigint] NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[channel_room_id] [nvarchar](100) NOT NULL,
	[channel_room_name] [nvarchar](255) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channel_integrations]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channel_integrations]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channel_integrations](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[channel_id] [bigint] NOT NULL,
	[channel_hotel_id] [nvarchar](100) NULL,
	[api_key] [nvarchar](500) NULL,
	[api_secret] [nvarchar](500) NULL,
	[auth_token] [nvarchar](500) NULL,
	[last_sync_at] [datetime2](7) NULL,
	[sync_frequency_minutes] [int] NULL,
	[is_active] [bit] NULL,
	[config] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[payment_gateways]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[payment_gateways]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[payment_gateways](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[gateway_name] [nvarchar](50) NOT NULL,
	[gateway_type] [nvarchar](30) NOT NULL,
	[api_key] [nvarchar](500) NULL,
	[api_secret] [nvarchar](500) NULL,
	[merchant_id] [nvarchar](100) NULL,
	[is_active] [bit] NULL,
	[is_default] [bit] NULL,
	[config] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[channels]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[channels]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[channels](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[channel_name] [nvarchar](50) NOT NULL,
	[channel_type] [nvarchar](30) NOT NULL,
	[logo_url] [nvarchar](500) NULL,
	[commission_percent] [decimal](5, 2) NULL,
	[api_endpoint] [nvarchar](500) NULL,
	[requires_mapping] [bit] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[refunds]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[refunds]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[refunds](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[payment_id] [bigint] NULL,
	[refund_amount] [decimal](10, 2) NOT NULL,
	[refund_reason] [nvarchar](max) NULL,
	[refund_method] [nvarchar](30) NOT NULL,
	[refund_status] [nvarchar](20) NULL,
	[transaction_id] [nvarchar](100) NULL,
	[processed_at] [datetime2](7) NULL,
	[processed_by] [bigint] NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[invoice_items]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[invoice_items]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[invoice_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[invoice_id] [bigint] NOT NULL,
	[item_type] [nvarchar](50) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
	[quantity] [decimal](10, 2) NULL,
	[rate] [decimal](10, 2) NOT NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[tax_percent] [decimal](5, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[invoices]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[invoices]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[invoices](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[invoice_number] [nvarchar](50) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[invoice_date] [date] NULL,
	[due_date] [date] NULL,
	[subtotal] [decimal](10, 2) NOT NULL,
	[tax_amount] [decimal](10, 2) NULL,
	[discount_amount] [decimal](10, 2) NULL,
	[total_amount] [decimal](10, 2) NOT NULL,
	[paid_amount] [decimal](10, 2) NULL,
	[balance] [decimal](10, 2) NOT NULL,
	[status] [nvarchar](20) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[check_in_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[check_in_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[check_in_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[room_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[scheduled_check_in] [datetime2](7) NOT NULL,
	[actual_check_in] [datetime2](7) NULL,
	[is_early] [bit] NULL,
	[early_checkin_fee] [decimal](10, 2) NULL,
	[checked_in_by] [bigint] NULL,
	[id_verified] [bit] NULL,
	[advance_collected] [decimal](10, 2) NULL,
	[key_card_number] [nvarchar](50) NULL,
	[special_instructions] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[early_late_requests]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[early_late_requests]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[early_late_requests](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[request_type] [nvarchar](20) NOT NULL,
	[requested_time] [datetime2](7) NOT NULL,
	[approved] [bit] NULL,
	[approved_by] [bigint] NULL,
	[approved_at] [datetime2](7) NULL,
	[charges] [decimal](10, 2) NULL,
	[reason] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_status_transitions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_status_transitions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_status_transitions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_id] [bigint] NOT NULL,
	[from_status] [nvarchar](30) NOT NULL,
	[to_status] [nvarchar](30) NOT NULL,
	[trigger_type] [nvarchar](30) NOT NULL,
	[trigger_event] [nvarchar](100) NULL,
	[triggered_by] [bigint] NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[check_out_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[check_out_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[check_out_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[room_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[scheduled_check_out] [datetime2](7) NOT NULL,
	[actual_check_out] [datetime2](7) NULL,
	[is_late] [bit] NULL,
	[late_checkout_fee] [decimal](10, 2) NULL,
	[checked_out_by] [bigint] NULL,
	[final_bill_amount] [decimal](10, 2) NOT NULL,
	[payment_settled] [bit] NULL,
	[damages_reported] [bit] NULL,
	[damage_charges] [decimal](10, 2) NULL,
	[room_condition] [nvarchar](30) NULL,
	[guest_feedback] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_payments]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_payments]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_payments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[payment_type] [nvarchar](30) NOT NULL,
	[payment_method] [nvarchar](30) NOT NULL,
	[payment_gateway] [nvarchar](50) NULL,
	[transaction_id] [nvarchar](100) NULL,
	[card_last4] [nvarchar](4) NULL,
	[upi_id] [nvarchar](100) NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[payment_status] [nvarchar](20) NULL,
	[payment_date] [datetime2](7) NULL,
	[gateway_response] [nvarchar](max) NULL,
	[notes] [nvarchar](max) NULL,
	[received_by] [bigint] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_amendments]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_amendments]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_amendments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[amendment_type] [nvarchar](50) NOT NULL,
	[old_room_id] [bigint] NULL,
	[new_room_id] [bigint] NULL,
	[old_check_in] [datetime2](7) NULL,
	[new_check_in] [datetime2](7) NULL,
	[old_check_out] [datetime2](7) NULL,
	[new_check_out] [datetime2](7) NULL,
	[old_amount] [decimal](10, 2) NULL,
	[new_amount] [decimal](10, 2) NULL,
	[amendment_fee] [decimal](10, 2) NULL,
	[reason] [nvarchar](max) NULL,
	[approved_by] [bigint] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_cancellations]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_cancellations]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_cancellations](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[cancellation_type] [nvarchar](30) NOT NULL,
	[cancellation_reason] [nvarchar](max) NULL,
	[cancelled_at] [datetime2](7) NULL,
	[cancelled_by] [bigint] NULL,
	[cancellation_fee] [decimal](10, 2) NULL,
	[refund_amount] [decimal](10, 2) NULL,
	[refund_status] [nvarchar](30) NULL,
	[refund_processed_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_waitlist]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_waitlist]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_waitlist](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[check_in] [date] NOT NULL,
	[check_out] [date] NOT NULL,
	[adults] [int] NOT NULL,
	[children] [int] NULL,
	[priority] [int] NULL,
	[status] [nvarchar](30) NULL,
	[allocated_at] [datetime2](7) NULL,
	[expires_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_rooms]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_rooms]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_rooms](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[room_id] [bigint] NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[room_rate] [decimal](10, 2) NOT NULL,
	[extra_beds] [int] NULL,
	[check_in] [datetime2](7) NOT NULL,
	[check_out] [datetime2](7) NOT NULL,
	[actual_check_in] [datetime2](7) NULL,
	[actual_check_out] [datetime2](7) NULL,
	[status] [nvarchar](30) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[group_bookings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[group_bookings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[group_bookings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[group_code] [nvarchar](50) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[group_name] [nvarchar](255) NOT NULL,
	[event_type] [nvarchar](100) NULL,
	[total_rooms] [int] NOT NULL,
	[total_guests] [int] NULL,
	[check_in] [date] NOT NULL,
	[check_out] [date] NOT NULL,
	[contact_person] [nvarchar](255) NOT NULL,
	[contact_phone] [nvarchar](20) NOT NULL,
	[contact_email] [nvarchar](320) NULL,
	[special_arrangements] [nvarchar](max) NULL,
	[total_amount] [decimal](10, 2) NULL,
	[discount_percent] [decimal](5, 2) NULL,
	[status] [nvarchar](30) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[advance_bookings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[advance_bookings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[advance_bookings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[preferred_check_in] [datetime2](7) NOT NULL,
	[preferred_check_out] [datetime2](7) NOT NULL,
	[adults] [int] NOT NULL,
	[children] [int] NULL,
	[special_requests] [nvarchar](max) NULL,
	[advance_paid] [decimal](10, 2) NULL,
	[status] [nvarchar](30) NULL,
	[allocated_booking_id] [bigint] NULL,
	[expires_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[booking_guests]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[booking_guests]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[booking_guests](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_id] [bigint] NOT NULL,
	[guest_id] [bigint] NULL,
	[guest_name] [nvarchar](255) NOT NULL,
	[age] [int] NULL,
	[guest_type] [nvarchar](20) NULL,
	[id_proof_type] [nvarchar](50) NULL,
	[id_proof_number] [nvarchar](100) NULL,
	[is_primary] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_preferences]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_preferences]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_preferences](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[preference_type] [nvarchar](50) NOT NULL,
	[preference_value] [nvarchar](max) NOT NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[bookings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[bookings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[bookings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[booking_code] [nvarchar](50) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[rate_plan_id] [bigint] NULL,
	[booking_source] [nvarchar](50) NULL,
	[channel_id] [bigint] NULL,
	[booking_type] [nvarchar](20) NULL,
	[check_in] [datetime2](7) NOT NULL,
	[check_out] [datetime2](7) NOT NULL,
	[actual_check_in] [datetime2](7) NULL,
	[actual_check_out] [datetime2](7) NULL,
	[total_hours] [int] NULL,
	[total_nights] [int] NULL,
	[adults] [int] NOT NULL,
	[children] [int] NULL,
	[infants] [int] NULL,
	[total_rooms] [int] NULL,
	[room_charges] [decimal](10, 2) NOT NULL,
	[extra_charges] [decimal](10, 2) NULL,
	[service_charges] [decimal](10, 2) NULL,
	[tax_amount] [decimal](10, 2) NULL,
	[discount_amount] [decimal](10, 2) NULL,
	[total_amount] [decimal](10, 2) NOT NULL,
	[paid_amount] [decimal](10, 2) NULL,
	[advance_amount] [decimal](10, 2) NULL,
	[balance_amount] [decimal](10, 2) NULL,
	[payment_status] [nvarchar](20) NULL,
	[booking_status] [nvarchar](30) NULL,
	[special_requests] [nvarchar](max) NULL,
	[guest_notes] [nvarchar](max) NULL,
	[internal_notes] [nvarchar](max) NULL,
	[cancellation_policy] [nvarchar](max) NULL,
	[cancelled_at] [datetime2](7) NULL,
	[cancelled_by] [bigint] NULL,
	[cancellation_reason] [nvarchar](max) NULL,
	[cancellation_fee] [decimal](10, 2) NULL,
	[no_show_fee] [decimal](10, 2) NULL,
	[confirmation_sent_at] [datetime2](7) NULL,
	[reminder_sent_at] [datetime2](7) NULL,
	[is_group_booking] [bit] NULL,
	[group_booking_id] [bigint] NULL,
	[assigned_to] [bigint] NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[tenant_id] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_companions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_companions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_companions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[companion_name] [nvarchar](255) NOT NULL,
	[relation] [nvarchar](50) NULL,
	[age] [int] NULL,
	[id_proof_type] [nvarchar](50) NULL,
	[id_proof_number] [nvarchar](100) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_documents]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_documents]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_documents](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[document_type] [nvarchar](50) NOT NULL,
	[document_number] [nvarchar](100) NOT NULL,
	[document_file] [nvarchar](500) NULL,
	[issue_date] [date] NULL,
	[expiry_date] [date] NULL,
	[issued_by] [nvarchar](100) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guest_addresses]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guest_addresses]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guest_addresses](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[guest_id] [bigint] NOT NULL,
	[address_type] [nvarchar](30) NULL,
	[address_line1] [nvarchar](255) NOT NULL,
	[address_line2] [nvarchar](255) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[postal_code] [nvarchar](20) NULL,
	[is_primary] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[seasonal_rates]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[seasonal_rates]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[seasonal_rates](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[season_name] [nvarchar](100) NOT NULL,
	[season_type] [nvarchar](30) NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
	[markup_percent] [decimal](5, 2) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[guests]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[guests]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[guests](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[guest_code] [nvarchar](50) NOT NULL,
	[first_name] [nvarchar](100) NOT NULL,
	[last_name] [nvarchar](100) NULL,
	[email] [nvarchar](320) NULL,
	[phone] [nvarchar](20) NOT NULL,
	[phone_secondary] [nvarchar](20) NULL,
	[date_of_birth] [date] NULL,
	[gender] [nvarchar](20) NULL,
	[nationality] [nvarchar](100) NULL,
	[id_proof_type] [nvarchar](50) NULL,
	[id_proof_number] [nvarchar](100) NULL,
	[company_name] [nvarchar](255) NULL,
	[gst_number] [nvarchar](50) NULL,
	[vip_status] [nvarchar](30) NULL,
	[loyalty_tier] [nvarchar](30) NULL,
	[loyalty_points] [int] NULL,
	[total_bookings] [int] NULL,
	[total_spent] [decimal](10, 2) NULL,
	[average_rating] [decimal](2, 1) NULL,
	[blacklisted] [bit] NULL,
	[blacklist_reason] [nvarchar](max) NULL,
	[notes] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_amenity_inventory]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_amenity_inventory]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_amenity_inventory](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_id] [bigint] NOT NULL,
	[amenity_name] [nvarchar](100) NOT NULL,
	[quantity] [int] NOT NULL,
	[condition] [nvarchar](30) NULL,
	[last_checked_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[rate_plans]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[rate_plans]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[rate_plans](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[plan_code] [nvarchar](50) NOT NULL,
	[plan_name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NULL,
	[plan_type] [nvarchar](30) NOT NULL,
	[meal_plan] [nvarchar](30) NULL,
	[is_refundable] [bit] NULL,
	[advance_booking_days] [int] NULL,
	[min_stay_nights] [int] NULL,
	[max_stay_nights] [int] NULL,
	[booking_window_start] [date] NULL,
	[booking_window_end] [date] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[hourly_pricing_rules]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[hourly_pricing_rules]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[hourly_pricing_rules](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[min_hours] [int] NOT NULL,
	[max_hours] [int] NULL,
	[hour_rate] [decimal](10, 2) NOT NULL,
	[time_slot_start] [time](7) NULL,
	[time_slot_end] [time](7) NULL,
	[days_of_week] [nvarchar](50) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[rate_schedules]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[rate_schedules]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[rate_schedules](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[rate_plan_id] [bigint] NULL,
	[schedule_name] [nvarchar](100) NOT NULL,
	[schedule_type] [nvarchar](30) NOT NULL,
	[rate_hourly] [decimal](10, 2) NULL,
	[rate_daily] [decimal](10, 2) NOT NULL,
	[rate_weekly] [decimal](10, 2) NULL,
	[rate_monthly] [decimal](10, 2) NULL,
	[min_hours] [int] NULL,
	[discount_percent] [decimal](5, 2) NULL,
	[markup_percent] [decimal](5, 2) NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
	[start_time] [time](7) NULL,
	[end_time] [time](7) NULL,
	[days_of_week] [nvarchar](50) NULL,
	[priority] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[dynamic_pricing_rules]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[dynamic_pricing_rules]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[dynamic_pricing_rules](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[rule_name] [nvarchar](100) NOT NULL,
	[rule_type] [nvarchar](30) NOT NULL,
	[trigger_condition] [nvarchar](max) NULL,
	[occupancy_threshold_min] [int] NULL,
	[occupancy_threshold_max] [int] NULL,
	[price_adjustment_type] [nvarchar](20) NOT NULL,
	[adjustment_value] [decimal](10, 2) NOT NULL,
	[applicable_room_types] [nvarchar](max) NULL,
	[priority] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_type_amenities]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_type_amenities]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_type_amenities](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[amenity_name] [nvarchar](100) NOT NULL,
	[icon] [nvarchar](100) NULL,
	[quantity] [int] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_type_images]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_type_images]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_type_images](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[image_url] [nvarchar](500) NOT NULL,
	[display_order] [int] NULL,
	[is_primary] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[room_types]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[room_types]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[room_types](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[type_code] [nvarchar](50) NOT NULL,
	[type_name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NULL,
	[max_adults] [int] NOT NULL,
	[max_children] [int] NULL,
	[max_occupancy] [int] NOT NULL,
	[max_extra_beds] [int] NULL,
	[base_rate_hourly] [decimal](10, 2) NULL,
	[base_rate_daily] [decimal](10, 2) NOT NULL,
	[base_rate_weekly] [decimal](10, 2) NULL,
	[base_rate_monthly] [decimal](10, 2) NULL,
	[extra_bed_rate] [decimal](10, 2) NULL,
	[extra_person_rate] [decimal](10, 2) NULL,
	[child_rate] [decimal](10, 2) NULL,
	[size_sqft] [int] NULL,
	[bed_type] [nvarchar](100) NULL,
	[bed_count] [int] NULL,
	[view_type] [nvarchar](100) NULL,
	[smoking_allowed] [bit] NULL,
	[pet_friendly] [bit] NULL,
	[sort_order] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[tenant_id] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[rooms]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[rooms]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[rooms](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[room_type_id] [bigint] NOT NULL,
	[room_number] [nvarchar](20) NOT NULL,
	[floor_number] [int] NULL,
	[block_name] [nvarchar](50) NULL,
	[status] [nvarchar](30) NULL,
	[condition] [nvarchar](30) NULL,
	[is_accessible] [bit] NULL,
	[connecting_rooms] [nvarchar](max) NULL,
	[last_cleaned_at] [datetime2](7) NULL,
	[last_maintenance_at] [datetime2](7) NULL,
	[next_maintenance_due] [date] NULL,
	[notes] [nvarchar](max) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[tenant_id] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[hotel_images]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[hotel_images]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[hotel_images](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[image_url] [nvarchar](500) NOT NULL,
	[image_type] [nvarchar](50) NULL,
	[display_order] [int] NULL,
	[is_primary] [bit] NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[hotel_amenities]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[hotel_amenities]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[hotel_amenities](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[amenity_name] [nvarchar](100) NOT NULL,
	[amenity_type] [nvarchar](50) NULL,
	[icon] [nvarchar](100) NULL,
	[is_chargeable] [bit] NULL,
	[charge_amount] [decimal](10, 2) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[hotel_policies]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[hotel_policies]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[hotel_policies](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hotel_id] [bigint] NOT NULL,
	[policy_type] [nvarchar](50) NOT NULL,
	[policy_text] [nvarchar](max) NOT NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[hotels]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[hotels]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[hotels](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[parent_hotel_id] [bigint] NULL,
	[hotel_code] [nvarchar](50) NOT NULL,
	[hotel_name] [nvarchar](255) NOT NULL,
	[brand_name] [nvarchar](255) NULL,
	[hotel_type] [nvarchar](50) NULL,
	[address] [nvarchar](max) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[postal_code] [nvarchar](20) NULL,
	[latitude] [decimal](10, 8) NULL,
	[longitude] [decimal](11, 8) NULL,
	[phone] [nvarchar](20) NULL,
	[email] [nvarchar](320) NULL,
	[website] [nvarchar](500) NULL,
	[rating] [decimal](2, 1) NULL,
	[total_rooms] [int] NULL,
	[total_floors] [int] NULL,
	[check_in_time] [time](7) NULL,
	[check_out_time] [time](7) NULL,
	[early_check_in_fee] [decimal](10, 2) NULL,
	[late_check_out_fee] [decimal](10, 2) NULL,
	[cancellation_hours] [int] NULL,
	[status] [nvarchar](20) NULL,
	[tax_registration_no] [nvarchar](100) NULL,
	[license_no] [nvarchar](100) NULL,
	[opening_date] [date] NULL,
	[manager_id] [bigint] NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[branches]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[branches]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[branches](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[firm_id] [bigint] NOT NULL,
	[branch_code] [nvarchar](50) NOT NULL,
	[branch_name] [nvarchar](255) NOT NULL,
	[address] [nvarchar](max) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[firm_id] ASC,
	[branch_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[firms]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[firms]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[firms](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[firm_code] [nvarchar](50) NOT NULL,
	[firm_name] [nvarchar](255) NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[address] [nvarchar](max) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[postal_code] [nvarchar](20) NULL,
	[phone] [nvarchar](20) NULL,
	[email] [nvarchar](320) NULL,
	[website] [nvarchar](500) NULL,
	[logo_url] [nvarchar](500) NULL,
	[tax_id] [nvarchar](100) NULL,
	[currency] [nvarchar](10) NULL,
	[timezone] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[tenant_id] ASC,
	[firm_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[password_resets]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[password_resets]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[password_resets](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[reset_token] [varchar](255) NOT NULL,
	[expires_at] [datetime2](7) NOT NULL,
	[used] [bit] NULL,
	[used_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[reset_token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[activities]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[activities]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[activities](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[user_id] [bigint] NOT NULL,
	[activity_type] [nvarchar](50) NOT NULL,
	[subject_type] [nvarchar](50) NULL,
	[subject_id] [bigint] NULL,
	[action] [nvarchar](50) NOT NULL,
	[description] [nvarchar](max) NULL,
	[metadata] [nvarchar](max) NULL,
	[is_read] [bit] NULL,
	[read_at] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[audit_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[audit_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[audit_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NULL,
	[user_id] [bigint] NULL,
	[entity_type] [nvarchar](100) NOT NULL,
	[entity_id] [bigint] NULL,
	[action_type] [nvarchar](50) NOT NULL,
	[old_values] [nvarchar](max) NULL,
	[new_values] [nvarchar](max) NULL,
	[ip_address] [nvarchar](45) NULL,
	[user_agent] [nvarchar](max) NULL,
	[session_id] [bigint] NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[error_logs]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[error_logs]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[error_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NULL,
	[user_id] [bigint] NULL,
	[error_type] [nvarchar](100) NOT NULL,
	[error_message] [nvarchar](max) NOT NULL,
	[error_code] [nvarchar](50) NULL,
	[stack_trace] [nvarchar](max) NULL,
	[request_url] [nvarchar](max) NULL,
	[request_method] [nvarchar](10) NULL,
	[request_headers] [nvarchar](max) NULL,
	[request_body] [nvarchar](max) NULL,
	[response_status] [int] NULL,
	[severity] [nvarchar](20) NULL,
	[resolved] [bit] NULL,
	[resolved_at] [datetime2](7) NULL,
	[resolved_by] [bigint] NULL,
	[occurrence_count] [int] NULL,
	[first_occurred_at] [datetime2](7) NULL,
	[last_occurred_at] [datetime2](7) NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[invitations]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[invitations]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[invitations](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[invited_by] [bigint] NOT NULL,
	[invitee_email] [nvarchar](320) NOT NULL,
	[invitee_phone] [nvarchar](20) NULL,
	[invitee_name] [nvarchar](255) NULL,
	[invitee_type] [nvarchar](50) NOT NULL,
	[role_id] [bigint] NULL,
	[invitation_token] [nvarchar](255) NOT NULL,
	[invitation_message] [nvarchar](max) NULL,
	[status] [nvarchar](20) NULL,
	[expires_at] [datetime2](7) NOT NULL,
	[accepted_at] [datetime2](7) NULL,
	[declined_at] [datetime2](7) NULL,
	[decline_reason] [nvarchar](max) NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[subscription_feature_permissions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[subscription_feature_permissions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[subscription_feature_permissions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subscription_id] [int] NOT NULL,
	[feature_id] [int] NOT NULL,
	[permission_id] [int] NOT NULL,
	[permission_price] [decimal](18, 2) NULL,
	[restricted_to] [nvarchar](50) NULL,
	[is_deleted] [bit] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[created_by] [int] NULL,
	[updated_at] [datetime] NULL,
	[updated_by] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[subscription_features]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[subscription_features]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[subscription_features](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subscription_id] [int] NOT NULL,
	[feature_price] [decimal](18, 2) NULL,
	[restricted_to] [nvarchar](50) NULL,
	[name] [nvarchar](50) NOT NULL,
	[is_deleted] [bit] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[created_by] [int] NULL,
	[updated_at] [datetime] NULL,
	[updated_by] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[subscription_history]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[subscription_history]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[subscription_history](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[from_plan_id] [bigint] NULL,
	[to_plan_id] [bigint] NOT NULL,
	[change_type] [nvarchar](20) NOT NULL,
	[change_reason] [nvarchar](max) NULL,
	[price_at_change] [decimal](10, 2) NULL,
	[currency] [nvarchar](3) NULL,
	[billing_cycle] [nvarchar](20) NULL,
	[effective_date] [date] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[subscription_offers]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[subscription_offers]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[subscription_offers](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[offer_code] [nvarchar](50) NOT NULL,
	[offer_name] [nvarchar](255) NOT NULL,
	[offer_type] [nvarchar](20) NOT NULL,
	[discount_percent] [decimal](5, 2) NULL,
	[discount_amount] [decimal](10, 2) NULL,
	[trial_extension_days] [int] NULL,
	[min_purchase_amount] [decimal](10, 2) NULL,
	[max_discount_amount] [decimal](10, 2) NULL,
	[usage_limit] [int] NULL,
	[usage_count] [int] NOT NULL,
	[usage_per_user_limit] [int] NULL,
	[is_active] [bit] NOT NULL,
	[is_festival_offer] [bit] NOT NULL,
	[festival_name] [nvarchar](100) NULL,
	[start_date] [datetime2](7) NOT NULL,
	[end_date] [datetime2](7) NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[offer_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[role_permissions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[role_permissions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[role_permissions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[role_id] [bigint] NOT NULL,
	[permission_id] [bigint] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[granted] [bit] NOT NULL,
	[status] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[roles]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[roles]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[roles](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NULL,
	[name] [nvarchar](100) NOT NULL,
	[display_name] [nvarchar](255) NULL,
	[description] [nvarchar](max) NULL,
	[is_system_role] [bit] NULL,
	[is_default] [bit] NULL,
	[hierarchy_level] [int] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[is_visible_to_all] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[user_roles]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[user_roles]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[user_roles](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[role_id] [bigint] NOT NULL,
	[assigned_at] [datetime2](7) NULL,
	[expires_at] [datetime2](7) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[permissions]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[permissions]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[permissions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[permission_key] [nvarchar](100) NOT NULL,
	[resource] [nvarchar](100) NOT NULL,
	[action] [nvarchar](50) NOT NULL,
	[description] [nvarchar](max) NULL,
	[category] [nvarchar](100) NULL,
	[applicable_to] [nvarchar](max) NULL,
	[is_system_permission] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[resource_id] [bigint] NULL,
	[scope] [nvarchar](50) NULL,
	[fields] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[permission_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[users]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[users]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NULL,
	[email] [nvarchar](320) NULL,
	[username] [nvarchar](100) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[user_type] [nvarchar](50) NOT NULL,
	[first_name] [nvarchar](100) NULL,
	[last_name] [nvarchar](100) NULL,
	[avatar_url] [nvarchar](max) NULL,
	[phone] [nvarchar](20) NULL,
	[timezone] [nvarchar](50) NULL,
	[locale] [nvarchar](10) NULL,
	[email_verified_at] [datetime2](7) NULL,
	[phone_verified_at] [datetime2](7) NULL,
	[onboarding_completed_at] [datetime2](7) NULL,
	[onboarding_step] [int] NULL,
	[last_login_at] [datetime2](7) NULL,
	[last_active_at] [datetime2](7) NULL,
	[login_count] [int] NULL,
	[failed_login_count] [int] NULL,
	[locked_until] [datetime2](7) NULL,
	[password_changed_at] [datetime2](7) NULL,
	[must_change_password] [bit] NULL,
	[metadata] [nvarchar](max) NULL,
	[status] [nvarchar](20) NULL,
	[is_system_user] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
	[firm_id] [bigint] NULL,
	[branch_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[tenant_settings]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[tenant_settings]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tenant_settings](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_id] [bigint] NOT NULL,
	[setting_key] [nvarchar](100) NOT NULL,
	[setting_value] [nvarchar](max) NULL,
	[setting_type] [nvarchar](30) NULL,
	[category] [nvarchar](50) NULL,
	[is_encrypted] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[subscription_plans]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[subscription_plans]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[subscription_plans](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[plan_name] [nvarchar](100) NOT NULL,
	[plan_slug] [nvarchar](50) NOT NULL,
	[plan_type] [nvarchar](20) NOT NULL,
	[price_monthly] [decimal](10, 2) NULL,
	[price_yearly] [decimal](10, 2) NULL,
	[currency] [nvarchar](3) NULL,
	[trial_days] [int] NULL,
	[max_staff] [int] NULL,
	[max_storage_gb] [int] NULL,
	[max_branches] [int] NULL,
	[max_rooms] [int] NULL,
	[max_bookings_per_month] [int] NULL,
	[max_integrations] [int] NULL,
	[features] [nvarchar](max) NULL,
	[is_active] [bit] NULL,
	[sort_order] [int] NULL,
	[is_free] [bit] NOT NULL,
	[is_default] [bit] NOT NULL,
	[plan_tier] [nvarchar](20) NULL,
	[billing_cycle] [nvarchar](20) NULL,
	[max_file_size_mb] [int] NULL,
	[max_api_calls_per_day] [int] NULL,
	[priority_support] [bit] NOT NULL,
	[custom_branding] [bit] NOT NULL,
	[white_label] [bit] NOT NULL,
	[sso_enabled] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[plan_slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

<<<<<<< HEAD
/****** Object:  Table [dbo].[tenants]    Script Date: 04-03-2026 23:59:47 ******/
=======
/****** Object:  Table [dbo].[tenants]    Script Date: 01-02-2026 23:29:57 ******/
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tenants](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tenant_code] [nvarchar](50) NOT NULL,
	[company_name] [nvarchar](255) NOT NULL,
	[legal_name] [nvarchar](255) NULL,
	[parent_tenant_id] [bigint] NULL,
	[tenant_type] [nvarchar](30) NOT NULL,
	[logo_url] [nvarchar](500) NULL,
	[primary_email] [nvarchar](320) NOT NULL,
	[primary_phone] [nvarchar](20) NOT NULL,
	[address] [nvarchar](max) NULL,
	[city] [nvarchar](100) NULL,
	[state] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[postal_code] [nvarchar](20) NULL,
	[tax_id] [nvarchar](100) NULL,
	[registration_no] [nvarchar](100) NULL,
	[website] [nvarchar](500) NULL,
	[subscription_plan_id] [bigint] NULL,
	[subscription_status] [nvarchar](20) NULL,
	[subscription_start] [date] NULL,
	[subscription_end] [date] NULL,
	[metadata] [nvarchar](max) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[created_by] [bigint] NULL,
	[updated_at] [datetime2](7) NULL,
	[updated_by] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[tenant_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[menu_permissions] ADD  DEFAULT ('any') FOR [match_type]
GO

ALTER TABLE [dbo].[menu_permissions] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [dbo].[menu_permissions] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[menu_permissions] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[policies] ADD  DEFAULT ((0)) FOR [priority]
GO

ALTER TABLE [dbo].[policies] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [dbo].[policies] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[policies] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[resources] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [dbo].[resources] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[resources] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[branches] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[firms] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[firms] ADD  DEFAULT ('USD') FOR [currency]
GO

ALTER TABLE [dbo].[firms] ADD  DEFAULT ('UTC') FOR [timezone]
GO

ALTER TABLE [dbo].[password_resets] ADD  DEFAULT ((0)) FOR [used]
GO

ALTER TABLE [dbo].[password_resets] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[activities] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[audit_logs] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[error_logs] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[invitations] ADD  DEFAULT ('pending') FOR [status]
GO

ALTER TABLE [dbo].[invitations] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[subscription_feature_permissions] ADD  DEFAULT ((0)) FOR [is_deleted]
GO

ALTER TABLE [dbo].[subscription_feature_permissions] ADD  DEFAULT (getdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[subscription_features] ADD  DEFAULT ((0)) FOR [is_deleted]
GO

ALTER TABLE [dbo].[subscription_features] ADD  DEFAULT (getdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[subscription_history] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[subscription_offers] ADD  DEFAULT ((0)) FOR [usage_count]
GO

ALTER TABLE [dbo].[subscription_offers] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[subscription_offers] ADD  DEFAULT ((0)) FOR [is_festival_offer]
GO

ALTER TABLE [dbo].[subscription_offers] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[role_permissions] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[role_permissions] ADD  DEFAULT ((1)) FOR [granted]
GO

ALTER TABLE [dbo].[role_permissions] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [dbo].[roles] ADD  DEFAULT ((0)) FOR [is_system_role]
GO

ALTER TABLE [dbo].[roles] ADD  DEFAULT ((0)) FOR [is_default]
GO

ALTER TABLE [dbo].[roles] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[roles] ADD  DEFAULT ((0)) FOR [is_visible_to_all]
GO

ALTER TABLE [dbo].[user_roles] ADD  DEFAULT (getutcdate()) FOR [assigned_at]
GO

ALTER TABLE [dbo].[user_roles] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[user_roles] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[permissions] ADD  DEFAULT ((0)) FOR [is_system_permission]
GO

ALTER TABLE [dbo].[permissions] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [login_count]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [failed_login_count]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [must_change_password]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [is_system_user]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[tenant_settings] ADD  DEFAULT ('string') FOR [setting_type]
GO

ALTER TABLE [dbo].[tenant_settings] ADD  DEFAULT ((0)) FOR [is_encrypted]
GO

ALTER TABLE [dbo].[tenant_settings] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ('INR') FOR [currency]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((14)) FOR [trial_days]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [is_free]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [is_default]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [priority_support]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [custom_branding]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [white_label]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT ((0)) FOR [sso_enabled]
GO

ALTER TABLE [dbo].[subscription_plans] ADD  DEFAULT (getutcdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[tenants] ADD  DEFAULT ('independent') FOR [tenant_type]
GO

ALTER TABLE [dbo].[tenants] ADD  DEFAULT ('trial') FOR [subscription_status]
GO

ALTER TABLE [dbo].[tenants] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[tenants] ADD  DEFAULT (getutcdate()) FOR [created_at]
<<<<<<< HEAD
GO




USE [rokadiyo_hotel_mgmt]
GO

/****** Object:  StoredProcedure [dbo].[sp_get_user_permissions_with_subscription]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create or alter procedure for subscription-filtered permissions
CREATE   PROCEDURE [dbo].[sp_get_user_permissions_with_subscription]
    @user_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @user_tenant_id BIGINT;
    DECLARE @user_type NVARCHAR(50);
    
    -- Get user info
    SELECT @user_tenant_id = tenant_id, @user_type = user_type
    FROM users 
    WHERE id = @user_id AND status = 'active';
    
    -- Return permissions based on user type
    IF @user_type = 'SUPER_ADMIN'
    BEGIN
        -- Super admin gets all permissions
        SELECT 
            p.id,
            p.permission_key,
            p.resource,
            p.action,
            p.description,
            p.category,
            1 as granted_from_subscription
        FROM permissions p
        WHERE p.is_system_permission = 1 OR p.is_system_permission = 0;
    END
    ELSE IF @user_tenant_id IS NOT NULL
    BEGIN
        -- Tenant users get permissions based on subscription + role permissions
        SELECT DISTINCT
            p.id,
            p.permission_key,
            p.resource,
            p.action,
            p.description,
            p.category,
            CASE 
                WHEN vp.permission_id IS NOT NULL THEN 1 
                ELSE 0 
            END as granted_from_subscription
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        LEFT JOIN v_subscription_permissions vp ON p.id = vp.permission_id AND vp.tenant_id = @user_tenant_id
        WHERE ur.user_id = @user_id
        AND rp.granted = 1 
        AND rp.status = 'active'
        AND ur.is_active = 1
        AND (
            -- Include if granted from role
            1 = 1
            OR
            -- Include if available in subscription
            vp.permission_id IS NOT NULL
        );
    END
    ELSE
    BEGIN
        -- Non-tenant, non-super admin users get role permissions only
        SELECT 
            p.id,
            p.permission_key,
            p.resource,
            p.action,
            p.description,
            p.category,
            0 as granted_from_subscription
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = @user_id
        AND rp.granted = 1 
        AND rp.status = 'active'
        AND ur.is_active = 1;
    END
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_check_user_menu_access]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create a procedure to check if user can access a specific menu
CREATE   PROCEDURE [dbo].[sp_check_user_menu_access]
    @user_id BIGINT,
    @menu_key NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @has_access BIT = 0;
    DECLARE @user_role NVARCHAR(100);
    DECLARE @user_tenant_id BIGINT;
    DECLARE @menu_permission_ids NVARCHAR(MAX);
    DECLARE @menu_match_type NVARCHAR(20);
    
    -- Get user's role and tenant
    SELECT @user_role = r.name, @user_tenant_id = u.tenant_id
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
    WHERE u.id = @user_id  ;
    
    -- Get menu details
    SELECT @menu_permission_ids = permission_ids, @menu_match_type = match_type
    FROM menu_permissions
    WHERE menu_key = @menu_key AND is_active = 1 AND status = 'active';
    
    IF @menu_permission_ids IS NOT NULL
    BEGIN
        -- Check access based on role and menu type
        IF @user_role = 'super_admin' AND @menu_key NOT LIKE 'tenant_%'
        BEGIN
            SET @has_access = 1;
        END
        ELSE IF @user_role = 'tenant_admin' AND @menu_key LIKE 'tenant_%'
        BEGIN
            SET @has_access = 1;
        END
        ELSE IF @user_role NOT IN ('super_admin', 'tenant_admin')
        BEGIN
            -- Check if user has required permissions
            IF @menu_match_type = 'ANY'
            BEGIN
                -- User needs ANY of the required permissions
                IF EXISTS (
                    SELECT 1 
                    FROM v_api_user_permissions up
                    WHERE up.user_id = @user_id
                    AND up.permission_id IN (
                        SELECT value FROM STRING_SPLIT(@menu_permission_ids, ',')
                    )
                )
                BEGIN
                    SET @has_access = 1;
                END
            END
            ELSE IF @menu_match_type = 'ALL'
            BEGIN
                -- User needs ALL of the required permissions
                DECLARE @required_count INT;
                DECLARE @user_has_count INT;
                
                SELECT @required_count = COUNT(*) 
                FROM STRING_SPLIT(@menu_permission_ids, ',') 
                WHERE value IS NOT NULL AND value != '';
                
                SELECT @user_has_count = COUNT(DISTINCT up.permission_id)
                FROM v_api_user_permissions up
                WHERE up.user_id = @user_id
                AND up.permission_id IN (
                    SELECT value FROM STRING_SPLIT(@menu_permission_ids, ',')
                );
                
                IF @user_has_count >= @required_count
                BEGIN
                    SET @has_access = 1;
                END
            END
        END
    END
    
    SELECT @has_access as has_access;
END
GO

/****** Object:  StoredProcedure [dbo].[sp_get_user_menus]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create a stored procedure to get user menus with proper filtering
CREATE   PROCEDURE [dbo].[sp_get_user_menus]
    @user_id BIGINT,
    @include_tenant_menus BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @user_role NVARCHAR(100);
    DECLARE @user_tenant_id BIGINT;
    
    -- Get user's role and tenant
    SELECT @user_role = r.name, @user_tenant_id = u.tenant_id
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
    WHERE u.id = @user_id  ;
    
    -- Return filtered menus based on user role
    IF @user_role = 'super_admin'
    BEGIN
        -- Super admin gets all non-tenant menus
        SELECT 
            menu_key,
            menu_name,
            parent_menu_key,
            display_order,
            icon,
            route
        FROM menu_permissions
        WHERE is_active = 1 
        AND status = 'active'
        AND menu_key NOT LIKE 'tenant_%'
        ORDER BY display_order, menu_key;
    END
    ELSE IF @user_role = 'tenant_admin'
    BEGIN
        -- Tenant admin gets only tenant menus
        SELECT 
            menu_key,
            menu_name,
            parent_menu_key,
            display_order,
            icon,
            route
        FROM menu_permissions
        WHERE is_active = 1 
        AND status = 'active'
        AND menu_key LIKE 'tenant_%'
        ORDER BY display_order, menu_key;
    END
    ELSE
    BEGIN
        -- Other roles get menus based on their permissions
        SELECT DISTINCT
            mp.menu_key,
            mp.menu_name,
            mp.parent_menu_key,
            mp.display_order,
            mp.icon,
            mp.route
        FROM menu_permissions mp
        INNER JOIN v_api_user_permissions up ON 1=1
        WHERE up.user_id = @user_id
        AND mp.is_active = 1 
        AND mp.status = 'active'
        AND mp.menu_key NOT LIKE 'tenant_%'
        AND EXISTS (
            SELECT 1 
            FROM STRING_SPLIT(mp.permission_ids, ',') perm_ids
            WHERE CAST(perm_ids.value AS BIGINT) = up.permission_id
            AND (
                mp.match_type = 'ANY' 
                OR mp.match_type = 'ALL'
            )
        )
        ORDER BY mp.display_order, mp.menu_key;
    END
END
GO

/****** Object:  StoredProcedure [dbo].[sp_check_tenant_menu_access]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_check_tenant_menu_access]
    @user_id BIGINT,
    @menu_key NVARCHAR(100),
    @tenant_id BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @has_access BIT = 0;
    DECLARE @permission_ids NVARCHAR(MAX);
    DECLARE @user_tenant_id BIGINT;
    
    -- Get user's tenant_id if not provided
    IF @tenant_id IS NULL
    BEGIN
        SELECT @user_tenant_id = tenant_id FROM users WHERE id = @user_id;
    END
    ELSE
    BEGIN
        SET @user_tenant_id = @tenant_id;
    END
    
    -- Get permission IDs required for the menu
    SELECT @permission_ids = permission_ids 
    FROM menu_permissions 
    WHERE menu_key = @menu_key AND is_active = 1;
    
    IF @permission_ids IS NOT NULL
    BEGIN
        -- Check if user has any of the required permissions within their tenant
        SELECT @has_access = CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM v_api_user_permissions up
                INNER JOIN users u ON up.user_id = u.id
                WHERE up.user_id = @user_id 
                AND (u.tenant_id = @user_tenant_id OR @user_tenant_id IS NULL)
                AND up.permission_id IN (
                    SELECT value FROM STRING_SPLIT(@permission_ids, ',')
                )
            ) THEN 1 
            ELSE 0 
        END;
    END
    
    SELECT @has_access AS has_access;
END
GO

/****** Object:  StoredProcedure [dbo].[sp_verify_route_access_control]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- Create procedure to verify route access control
CREATE   PROCEDURE [dbo].[sp_verify_route_access_control]
    @user_id BIGINT = NULL,
    @check_all_routes BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @check_all_routes = 1
    BEGIN
        -- Check all routes and their permission requirements
        SELECT 
            mp.menu_key,
            mp.menu_name,
            mp.route,
            mp.permission_ids,
            CASE 
                WHEN mp.permission_ids IS NULL OR mp.permission_ids = '' THEN 'NO_PERMISSIONS_REQUIRED'
                WHEN EXISTS (
                    SELECT 1 FROM permissions p 
                    WHERE p.id IN (SELECT value FROM STRING_SPLIT(mp.permission_ids, ','))
                ) THEN 'VALID_PERMISSIONS'
                ELSE 'INVALID_PERMISSIONS'
            END as permission_status,
            mp.is_active,
            mp.status
        FROM menu_permissions mp
        WHERE mp.route IS NOT NULL AND mp.route != ''
        ORDER BY mp.display_order, mp.menu_key;
    END
    ELSE IF @user_id IS NOT NULL
    BEGIN
        -- Check specific user's access to all routes
        SELECT 
            mp.menu_key,
            mp.menu_name,
            mp.route,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM v_api_user_permissions up
                    WHERE up.user_id = @user_id
                    AND up.permission_id IN (
                        SELECT value FROM STRING_SPLIT(mp.permission_ids, ',')
                    )
                ) THEN 'ACCESS_GRANTED'
                ELSE 'ACCESS_DENIED'
            END as access_status,
            mp.permission_ids as required_permissions
        FROM menu_permissions mp
        WHERE mp.route IS NOT NULL AND mp.route != '' AND mp.is_active = 1
        ORDER BY mp.display_order, mp.menu_key;
    END
END
GO

/****** Object:  StoredProcedure [dbo].[sp_get_user_effective_permissions]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE   PROCEDURE [dbo].[sp_get_user_effective_permissions]
    @user_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        p.id as permission_id,
        p.permission_key,
        p.resource,
        p.action,
        p.description,
        p.category,
        r.resource_name,
        r.resource_key
    FROM v_api_user_permissions up
    INNER JOIN permissions p ON up.permission_id = p.id
    INNER JOIN resources r ON p.resource_id = r.id
    WHERE up.user_id = @user_id
    AND r.is_active = 1
    ORDER BY r.resource_key, p.permission_key;
END
GO

/****** Object:  StoredProcedure [dbo].[sp_check_menu_access]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_check_menu_access]
    @user_id BIGINT,
    @menu_key NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @has_access BIT = 0;
    DECLARE @permission_ids NVARCHAR(MAX);
    
    -- Get permission IDs required for the menu
    SELECT @permission_ids = permission_ids 
    FROM menu_permissions 
    WHERE menu_key = @menu_key AND is_active = 1;
    
    IF @permission_ids IS NOT NULL
    BEGIN
        -- Check if user has any of the required permissions
        SELECT @has_access = CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM v_api_user_permissions 
                WHERE user_id = @user_id 
                AND permission_id IN (
                    SELECT value FROM STRING_SPLIT(@permission_ids, ',')
                )
            ) THEN 1 
            ELSE 0 
        END;
    END
    
    SELECT @has_access AS has_access;
END
GO

/****** Object:  StoredProcedure [dbo].[sp_CreatePasswordReset]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CreatePasswordReset]
  @user_id BIGINT,
  @reset_token VARCHAR(255),
  @expires_at DATETIME2
AS
BEGIN
  -- Invalidate old tokens
  UPDATE password_resets SET used = 1 WHERE user_id = @user_id AND used = 0;
  
  -- Create new token
  INSERT INTO password_resets (user_id, reset_token, expires_at)
  VALUES (@user_id, @reset_token, @expires_at);
  
  SELECT id FROM password_resets WHERE reset_token = @reset_token;
END

GO

/****** Object:  StoredProcedure [dbo].[sp_CreateInvitation]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- ============================================
-- sp_CreateInvitation - Invite users
-- ============================================
CREATE PROCEDURE [dbo].[sp_CreateInvitation]
    @tenant_id BIGINT,
    @invited_by BIGINT,
    @invitee_email NVARCHAR(320),
    @invitee_type NVARCHAR(50),
    @role_id BIGINT,
    @invitation_token NVARCHAR(255),
    @expires_at DATETIME2(7)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO invitations (
        tenant_id, invited_by, invitee_email, invitee_type, role_id,
        invitation_token, status, expires_at, created_at
    )
    VALUES (
        @tenant_id, @invited_by, @invitee_email, @invitee_type, @role_id,
        @invitation_token, 'pending', @expires_at, GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateUser]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- ============================================
-- sp_CreateUser - User registration
-- ============================================
CREATE PROCEDURE [dbo].[sp_CreateUser]
    @email NVARCHAR(320),
    @username NVARCHAR(100),
    @password_hash NVARCHAR(255),
    @user_type NVARCHAR(50) = 'user',
    @tenant_id BIGINT = NULL,
    @first_name NVARCHAR(100) = NULL,
    @last_name NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @userId BIGINT;
    
    INSERT INTO users (
        email, username, password_hash, user_type, tenant_id,
        first_name, last_name, status, created_at
    )
    VALUES (
        @email, @username, @password_hash, @user_type, @tenant_id,
        @first_name, @last_name, 'active', GETUTCDATE()
    );
    
    SET @userId = SCOPE_IDENTITY();
    
    -- Auto-assign default role if tenant exists
    IF @tenant_id IS NOT NULL
    BEGIN
        DECLARE @defaultRoleId BIGINT;
        SELECT @defaultRoleId = id FROM roles 
        WHERE tenant_id = @tenant_id AND is_default = 1;
        
        IF @defaultRoleId IS NOT NULL
        BEGIN
            INSERT INTO user_roles (user_id, role_id, is_active, created_at)
            VALUES (@userId, @defaultRoleId, 1, GETUTCDATE());
        END
    END
    
    SELECT @userId AS id;
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_GetUserPermissions]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- ============================================
-- sp_GetUserPermissions - Get user permissions
-- ============================================
CREATE PROCEDURE [dbo].[sp_GetUserPermissions]
    @user_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT p.permission_key
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = @user_id AND ur.is_active = 1;
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateAuditLog]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- ============================================
-- sp_CreateAuditLog - Audit trail
-- ============================================
CREATE PROCEDURE [dbo].[sp_CreateAuditLog]
    @tenant_id BIGINT = NULL,
    @user_id BIGINT = NULL,
    @entity_type NVARCHAR(100),
    @entity_id BIGINT = NULL,
    @action_type NVARCHAR(50),
    @old_values NVARCHAR(MAX) = NULL,
    @new_values NVARCHAR(MAX) = NULL,
    @ip_address NVARCHAR(45) = NULL,
    @user_agent NVARCHAR(MAX) = NULL,
    @metadata NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO audit_logs (
        tenant_id, user_id, entity_type, entity_id, action_type,
        old_values, new_values, ip_address, user_agent, metadata, created_at
    )
    VALUES (
        @tenant_id, @user_id, @entity_type, @entity_id, @action_type,
        @old_values, @new_values, @ip_address, @user_agent, @metadata, GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateErrorLog]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- ============================================
-- sp_CreateErrorLog - Error logging
-- ============================================
CREATE PROCEDURE [dbo].[sp_CreateErrorLog]
    @tenant_id BIGINT = NULL,
    @user_id BIGINT = NULL,
    @error_type NVARCHAR(100),
    @error_message NVARCHAR(MAX),
    @stack_trace NVARCHAR(MAX) = NULL,
    @request_url NVARCHAR(MAX) = NULL,
    @request_method NVARCHAR(10) = NULL,
    @request_body NVARCHAR(MAX) = NULL,
    @severity NVARCHAR(20) = 'error',
    @metadata NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO error_logs (
        tenant_id, user_id, error_type, error_message, stack_trace,
        request_url, request_method, request_body, severity, metadata,
        created_at, first_occurred_at, last_occurred_at, occurrence_count
    )
    VALUES (
        @tenant_id, @user_id, @error_type, @error_message, @stack_trace,
        @request_url, @request_method, @request_body, @severity, @metadata,
        GETUTCDATE(), GETUTCDATE(), GETUTCDATE(), 1
    );
    
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateActivity]    Script Date: 05-03-2026 00:00:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- ============================================
-- sp_CreateActivity - Log user activities
-- ============================================
CREATE PROCEDURE [dbo].[sp_CreateActivity]
    @tenant_id BIGINT,
    @user_id BIGINT,
    @activity_type NVARCHAR(50),
    @action NVARCHAR(50),
    @subject_type NVARCHAR(50) = NULL,
    @subject_id BIGINT = NULL,
    @description NVARCHAR(MAX) = NULL,
    @metadata NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO activities (
        tenant_id, user_id, activity_type, subject_type, subject_id,
        action, description, metadata, created_at
    )
    VALUES (
        @tenant_id, @user_id, @activity_type, @subject_type, @subject_id,
        @action, @description, @metadata, GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS id;
END;
GO


=======
GO
>>>>>>> 61a8996c7378ab916d9ca45cbbd276dbcc253259
