# Multi-Branch Hotel Management MVP - Updated API Testing Guide

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

### 2. List All Hotels
```bash
curl -X POST http://localhost:3000/api/v1/hotels/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Get Hotel Branches
```bash
curl -X POST http://localhost:3000/api/v1/hotels/branches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": 1}'
```

### 4. Update Hotel
```bash
curl -X POST http://localhost:3000/api/v1/hotels/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 1,
    "name": "Grand Hotel Headquarters Updated",
    "phone": "+1-555-0001-NEW"
  }'
```

## Phase 2: Room Types & Rooms Setup

### 5. Create Room Type
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
```

### 6. List Room Types
```bash
curl -X POST http://localhost:3000/api/v1/room-types/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 7. Bulk Create Rooms
```bash
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
```

### 8. List Rooms
```bash
curl -X POST http://localhost:3000/api/v1/rooms/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": 1, "status": "available"}'
```

### 9. Update Room Status
```bash
curl -X POST http://localhost:3000/api/v1/rooms/update-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"room_id": 1, "status": "maintenance"}'
```

## Phase 3: Pricing Rules

### 10. Create Hourly Pricing Rule
```bash
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
```

### 11. Create Seasonal Rate
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

### 12. Calculate Price
```bash
curl -X POST http://localhost:3000/api/v1/pricing/calculate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_type_id": 1,
    "hotel_id": 1,
    "check_in": "2024-12-25T15:00:00Z",
    "check_out": "2024-12-26T11:00:00Z",
    "booking_type": "daily"
  }'
```

## Phase 4: Guest Management & Bookings

### 13. Create Guest
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

### 14. Search Guest by Email
```bash
curl -X POST http://localhost:3000/api/v1/guests/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@email.com"}'
```

### 15. Get Guest History
```bash
curl -X POST http://localhost:3000/api/v1/guests/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"guest_id": 1}'
```

### 16. Check Availability
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

### 17. Create Booking
```bash
curl -X POST http://localhost:3000/api/v1/bookings/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_id": 1,
    "hotel_id": 1,
    "room_id": 1,
    "check_in_date": "2024-12-25T15:00:00Z",
    "check_out_date": "2024-12-26T11:00:00Z",
    "total_amount": 300.00,
    "booking_type": "daily",
    "special_requests": "Late checkout requested",
    "booking_source": "walk_in"
  }'
```

### 18. List Bookings
```bash
curl -X POST http://localhost:3000/api/v1/bookings/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": 1, "status": "confirmed"}'
```

### 19. Record Payment
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

### 20. Complete Check-In
```bash
curl -X POST http://localhost:3000/api/v1/checkin/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "notes": "Guest checked in successfully. Room key provided."
  }'
```

### 21. Calculate Final Bill
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

### 22. Complete Check-Out
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

### 23. Get Overview
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": 1}'
```

### 24. Get Branches Summary
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/branches-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 25. Get Rooms Grid
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/rooms-grid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id": 1}'
```

### 26. Branch Performance Comparison
```bash
curl -X POST http://localhost:3000/api/v1/dashboard/branch-comparison \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

## ✅ All Endpoints Now Use POST Method
- No breaking changes to existing authentication
- All methods consistently use POST with request body
- Maintains existing JWT guard structure
- Compatible with existing middleware and interceptors