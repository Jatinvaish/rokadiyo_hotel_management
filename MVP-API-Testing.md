# Multi-Branch Hotel Management MVP - API Testing Guide

## Prerequisites
1. Run the database schema: `mvp-schema.sql`
2. Start the backend: `pnpm run start:dev`
3. Get JWT token from login endpoint

## Phase 1: Hotel & Branch Setup

### 1. Create Headquarters Hotel
```bash
curl -X POST http://localhost:3000/api/v1/hotels/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel Headquarters",
    "address": "123 Main Street",
    "city": "New York",
    "phone": "+1-555-0001",
    "email": "hq@grandhotel.com",
    "is_headquarters": true
  }'
```

### 2. Create Branch Hotels
```bash
curl -X POST http://localhost:3000/api/v1/hotels/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel Downtown",
    "address": "456 Downtown Ave",
    "city": "New York",
    "phone": "+1-555-0002",
    "email": "downtown@grandhotel.com",
    "parent_hotel_id": 1
  }'

curl -X POST http://localhost:3000/api/v1/hotels/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel Airport",
    "address": "789 Airport Blvd",
    "city": "New York",
    "phone": "+1-555-0003",
    "email": "airport@grandhotel.com",
    "parent_hotel_id": 1
  }'
```

## Phase 2: Room Types & Rooms Setup

### 3. Create Room Types
```bash
curl -X POST http://localhost:3000/api/v1/room-types/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Room",
    "description": "Comfortable standard room with city view",
    "base_rate_hourly": 25.00,
    "base_rate_daily": 150.00,
    "max_occupancy": 2,
    "amenities": ["WiFi", "TV", "AC", "Private Bathroom"]
  }'

curl -X POST http://localhost:3000/api/v1/room-types/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deluxe Suite",
    "description": "Spacious suite with premium amenities",
    "base_rate_hourly": 45.00,
    "base_rate_daily": 280.00,
    "max_occupancy": 4,
    "amenities": ["WiFi", "Smart TV", "AC", "Kitchenette", "Balcony"]
  }'
```

### 4. Bulk Create Rooms for Each Branch
```bash
# HQ Hotel (ID: 1) - Rooms 101-120
curl -X POST http://localhost:3000/api/v1/rooms/bulk-create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 1,
    "room_type_id": 1,
    "room_number_prefix": "1",
    "start_number": 101,
    "end_number": 120,
    "floor": "1"
  }'

# Downtown Branch (ID: 2) - Rooms 201-215
curl -X POST http://localhost:3000/api/v1/rooms/bulk-create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 2,
    "room_type_id": 1,
    "room_number_prefix": "2",
    "start_number": 201,
    "end_number": 215,
    "floor": "2"
  }'

# Airport Branch (ID: 3) - Rooms 301-310
curl -X POST http://localhost:3000/api/v1/rooms/bulk-create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 3,
    "room_type_id": 2,
    "room_number_prefix": "3",
    "start_number": 301,
    "end_number": 310,
    "floor": "3"
  }'
```

## Phase 3: Pricing Rules

### 5. Set Hourly Pricing Rules
```bash
# Peak hours (6 PM - 10 PM) - 50% markup
curl -X POST http://localhost:3000/api/v1/pricing/hourly-rules/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type_id": 1,
    "hotel_id": 1,
    "start_time": "18:00",
    "end_time": "22:00",
    "rate_multiplier": 1.5,
    "days_of_week": "1,2,3,4,5,6,7"
  }'

# Weekend premium (Fri-Sun) - 25% markup
curl -X POST http://localhost:3000/api/v1/pricing/hourly-rules/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type_id": 1,
    "hotel_id": 1,
    "start_time": "00:00",
    "end_time": "23:59",
    "rate_multiplier": 1.25,
    "days_of_week": "6,7,1"
  }'
```

### 6. Set Seasonal Rates
```bash
curl -X POST http://localhost:3000/api/v1/pricing/seasonal/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type_id": 1,
    "hotel_id": 1,
    "start_date": "2024-12-20",
    "end_date": "2024-01-05",
    "rate_multiplier": 2.0,
    "season_name": "Holiday Season"
  }'
```

## Phase 4: Guest Management & Bookings

### 7. Create Guest Profile
```bash
curl -X POST http://localhost:3000/api/v1/guests/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    "phone": "+1-555-1234",
    "id_type": "passport",
    "id_number": "P123456789",
    "date_of_birth": "1985-06-15",
    "nationality": "USA",
    "address": "123 Customer Street, City, State"
  }'
```

### 8. Check Availability Across Branches
```bash
curl -X POST http://localhost:3000/api/v1/bookings/check-availability \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "check_in": "2024-12-25T15:00:00Z",
    "check_out": "2024-12-26T11:00:00Z",
    "room_type_id": 1,
    "hotel_ids": [1, 2, 3],
    "booking_type": "daily"
  }'
```

### 9. Create Booking
```bash
curl -X POST http://localhost:3000/api/v1/bookings/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_id": 1,
    "hotel_id": 2,
    "room_id": 21,
    "check_in_date": "2024-12-25T15:00:00Z",
    "check_out_date": "2024-12-26T11:00:00Z",
    "total_amount": 300.00,
    "booking_type": "daily",
    "special_requests": "Late checkout requested",
    "booking_source": "walk_in"
  }'
```

### 10. Record Payment
```bash
curl -X POST http://localhost:3000/api/v1/bookings/payment/record \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "amount": 150.00,
    "payment_method": "card",
    "reference_number": "TXN123456"
  }'
```

## Phase 5: Check-In/Check-Out Operations

### 11. Complete Check-In
```bash
curl -X POST http://localhost:3000/api/v1/checkin/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "notes": "Guest checked in successfully. Room key provided."
  }'
```

### 12. Calculate Final Bill
```bash
curl -X POST http://localhost:3000/api/v1/checkout/calculate-bill \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "additional_charges": 25.00,
    "charge_description": "Minibar charges"
  }'
```

### 13. Complete Check-Out
```bash
curl -X POST http://localhost:3000/api/v1/checkout/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "final_amount": 325.00,
    "checkout_notes": "Guest checked out. Room needs cleaning."
  }'
```

## Phase 6: Multi-Branch Dashboard

### 14. Get Overall Overview
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 15. Get Branches Summary
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/branches-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 16. Get Rooms Grid (All Branches)
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/rooms-grid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 17. Branch Performance Comparison
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/branch-comparison?days=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 18. Guest History Across All Branches
```bash
curl -X GET http://localhost:3000/api/v1/guests/1/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Multi-Branch Features Demonstrated

✅ **Single Guest Profile** - Guest books at Branch A, data available at Branch B
✅ **Centralized Inventory** - View/manage all branch rooms from one dashboard  
✅ **Cross-Branch Analytics** - Compare branch performance side-by-side
✅ **Unified Pricing** - Set prices at HQ, sync to all branches with one click
✅ **Branch Hierarchy** - HQ controls settings, branches inherit but can customize
✅ **Auto Room Status** - booked→occupied→dirty→available transitions
✅ **Housekeeping Integration** - Auto-trigger cleaning tasks on checkout
✅ **Payment Tracking** - Centralized payment ledger across all branches