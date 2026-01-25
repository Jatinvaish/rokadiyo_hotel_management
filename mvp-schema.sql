-- Multi-Branch Hotel Management MVP Database Schema

-- Hotels table (supports multi-branch hierarchy)
CREATE TABLE hotels (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    address NVARCHAR(500),
    city NVARCHAR(100),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    parent_hotel_id INT NULL, -- NULL for headquarters, references parent for branches
    is_headquarters BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (parent_hotel_id) REFERENCES hotels(id)
);

-- Room Types (shared across tenant or branch-specific)
CREATE TABLE room_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    base_rate_hourly DECIMAL(10,2) NOT NULL,
    base_rate_daily DECIMAL(10,2) NOT NULL,
    max_occupancy INT DEFAULT 2,
    amenities NVARCHAR(MAX), -- JSON array
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Rooms (belongs to specific hotel/branch)
CREATE TABLE rooms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_type_id INT NOT NULL,
    room_number NVARCHAR(20) NOT NULL,
    floor NVARCHAR(10),
    status NVARCHAR(20) DEFAULT 'available', -- available, booked, occupied, dirty, maintenance
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    UNIQUE(tenant_id, hotel_id, room_number)
);

-- Pricing Rules - Hourly
CREATE TABLE pricing_hourly_rules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_type_id INT NOT NULL,
    hotel_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    rate_multiplier DECIMAL(5,2) DEFAULT 1.0, -- 1.0 = base rate, 1.5 = 50% markup
    days_of_week NVARCHAR(20), -- "1,2,3,4,5" for weekdays
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Pricing Rules - Seasonal
CREATE TABLE pricing_seasonal_rates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_type_id INT NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rate_multiplier DECIMAL(5,2) DEFAULT 1.0,
    season_name NVARCHAR(100),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Guests (centralized across all branches)
CREATE TABLE guests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    id_type NVARCHAR(50), -- passport, license, national_id
    id_number NVARCHAR(100),
    id_document_url NVARCHAR(500),
    date_of_birth DATE,
    nationality NVARCHAR(100),
    address NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    UNIQUE(tenant_id, email),
    UNIQUE(tenant_id, id_number)
);

-- Bookings (can be at any branch)
CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    guest_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATETIME2 NOT NULL,
    check_out_date DATETIME2 NOT NULL,
    actual_check_in DATETIME2 NULL,
    actual_check_out DATETIME2 NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2) NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    booking_type NVARCHAR(20) DEFAULT 'daily', -- hourly, daily
    status NVARCHAR(20) DEFAULT 'confirmed', -- confirmed, checked_in, checked_out, cancelled
    payment_status NVARCHAR(20) DEFAULT 'pending', -- pending, partial, paid
    special_requests NVARCHAR(MAX),
    booking_source NVARCHAR(50) DEFAULT 'walk_in', -- walk_in, online, phone
    check_in_notes NVARCHAR(MAX),
    checkout_notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Payments
CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method NVARCHAR(50) NOT NULL, -- cash, card, transfer
    reference_number NVARCHAR(100),
    payment_date DATETIME2 DEFAULT GETUTCDATE(),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Additional Charges
CREATE TABLE booking_charges (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    booking_id INT NOT NULL,
    charge_type NVARCHAR(50) NOT NULL, -- additional, tax, service
    amount DECIMAL(10,2) NOT NULL,
    description NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Housekeeping Tasks (auto-generated on checkout)
CREATE TABLE housekeeping_tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tenant_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    task_type NVARCHAR(50) NOT NULL, -- checkout_cleaning, maintenance, inspection
    status NVARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
    priority NVARCHAR(20) DEFAULT 'medium', -- low, medium, high
    assigned_to INT NULL, -- user_id
    notes NVARCHAR(MAX),
    completed_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Indexes for performance
CREATE INDEX IX_hotels_tenant_parent ON hotels(tenant_id, parent_hotel_id);
CREATE INDEX IX_rooms_hotel_status ON rooms(hotel_id, status);
CREATE INDEX IX_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IX_bookings_status ON bookings(tenant_id, status);
CREATE INDEX IX_guests_email ON guests(tenant_id, email);
CREATE INDEX IX_payments_booking ON payments(booking_id);