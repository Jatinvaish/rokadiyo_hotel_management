import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';

@Injectable()
export class DashboardService {
  constructor(private sql: SqlServerService) {}

  async getOverview(tenantId: number, hotelId?: number) {
    let hotelFilter = '';
    const params: any = { tenantId: tenantId };
    
    if (hotelId) {
      hotelFilter = 'AND h.id = @hotelId';
      params.hotelId = hotelId;
    }

    const stats = await this.sql.query(`
      SELECT 
        COUNT(DISTINCT r.id) as total_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'occupied' THEN r.id END) as occupied_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'available' THEN r.id END) as available_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'dirty' THEN r.id END) as dirty_rooms,
        COUNT(DISTINCT CASE WHEN b.status = 'checked_in' AND CAST(b.check_in_date AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.id END) as todays_checkins,
        COUNT(DISTINCT CASE WHEN b.status = 'checked_out' AND CAST(b.actual_check_out AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.id END) as todays_checkouts,
        COALESCE(SUM(CASE WHEN b.status = 'checked_out' AND CAST(b.actual_check_out AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.final_amount END), 0) as todays_revenue
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      LEFT JOIN bookings b ON r.id = b.room_id
      WHERE h.tenant_id = @tenantId ${hotelFilter}
    `, params);

    return stats[0];
  }

  async getRoomsGrid(tenantId: number, hotelId?: number) {
    let hotelFilter = '';
    const params: any = { tenantId: tenantId };
    
    if (hotelId) {
      hotelFilter = 'AND r.hotel_id = @hotelId';
      params.hotelId = hotelId;
    }

    return this.sql.query(`
      SELECT r.id, r.room_number, r.floor, r.status, 
             rt.name as room_type_name, h.name as hotel_name,
             b.id as booking_id, b.status as booking_status,
             g.first_name, g.last_name, b.check_out_date
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN bookings b ON r.id = b.room_id AND b.status IN ('confirmed', 'checked_in')
      LEFT JOIN guests g ON b.guest_id = g.id
      WHERE r.tenant_id = @tenantId ${hotelFilter}
      ORDER BY h.name, r.room_number
    `, params);
  }

  async getBranchesSummary(tenantId: number) {
    return this.sql.query(`
      SELECT h.id, h.name, h.is_headquarters,
        COUNT(DISTINCT r.id) as total_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'occupied' THEN r.id END) as occupied_rooms,
        ROUND(
          CASE 
            WHEN COUNT(DISTINCT r.id) > 0 
            THEN (COUNT(DISTINCT CASE WHEN r.status = 'occupied' THEN r.id END) * 100.0) / COUNT(DISTINCT r.id)
            ELSE 0 
          END, 2
        ) as occupancy_percentage,
        COALESCE(SUM(CASE WHEN b.status = 'checked_out' AND CAST(b.actual_check_out AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.final_amount END), 0) as todays_revenue,
        COUNT(DISTINCT CASE WHEN b.status = 'checked_in' AND CAST(b.check_in_date AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.id END) as todays_checkins,
        COUNT(DISTINCT CASE WHEN b.status = 'checked_out' AND CAST(b.actual_check_out AS DATE) = CAST(GETUTCDATE() AS DATE) THEN b.id END) as todays_checkouts
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      LEFT JOIN bookings b ON r.id = b.room_id
      WHERE h.tenant_id = @tenantId
      GROUP BY h.id, h.name, h.is_headquarters
      ORDER BY h.is_headquarters DESC, h.name
    `, { tenantId: tenantId });
  }

  async getBranchComparison(tenantId: number, days: number = 30) {
    return this.sql.query(`
      SELECT h.id, h.name,
        COUNT(DISTINCT b.id) as total_bookings,
        COALESCE(SUM(b.final_amount), 0) as total_revenue,
        ROUND(AVG(
          CASE 
            WHEN COUNT(DISTINCT r.id) > 0 
            THEN (COUNT(DISTINCT CASE WHEN r.status = 'occupied' THEN r.id END) * 100.0) / COUNT(DISTINCT r.id)
            ELSE 0 
          END
        ), 2) as avg_occupancy
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      LEFT JOIN bookings b ON r.id = b.room_id 
        AND b.created_at >= DATEADD(day, -@days, GETUTCDATE())
        AND b.status = 'checked_out'
      WHERE h.tenant_id = @tenant_id
      GROUP BY h.id, h.name
      ORDER BY total_revenue DESC
    `, { tenant_id: tenantId, days });
  }
}