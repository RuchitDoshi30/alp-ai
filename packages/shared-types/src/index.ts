// ─── User & Auth ───────────────────────────────────────
export type UserRole = 'attendee' | 'staff' | 'vendor' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// ─── Venue ─────────────────────────────────────────────
export interface Venue {
  id: string;
  name: string;
  city?: string;
  capacity: number;
  lat?: number;
  lng?: number;
  mapSvgUrl?: string;
  sportType?: string;
}

export interface CrowdZone {
  id: string;
  venueId: string;
  zoneName: string;
  density: number;
  riskLevel: 'normal' | 'elevated' | 'critical';
  updatedAt: string;
}

export interface Gate {
  id: string;
  venueId: string;
  name: string;
  direction: string;
  congestion: number;
}

// ─── Event ─────────────────────────────────────────────
export type EventStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface SportEvent {
  id: string;
  venueId: string;
  venue?: Venue;
  title: string;
  sport: string;
  homeTeam: { name: string; shortName: string; logo: string };
  awayTeam: { name: string; shortName: string; logo: string };
  scores?: { home: number; away: number };
  period?: string;
  status: EventStatus;
  startTime: string;
  endTime?: string;
}

// ─── Ticket ────────────────────────────────────────────
export type TicketStatus = 'valid' | 'scanned' | 'revoked' | 'expired';

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  event?: SportEvent;
  bookingRef: string;
  section: string;
  row?: string;
  seat?: string;
  gate?: string;
  qrCode?: string;
  status: TicketStatus;
  scannedAt?: string;
}

// ─── Food ──────────────────────────────────────────────
export interface FoodVendor {
  id: string;
  venueId: string;
  name: string;
  location?: string;
  cuisineType?: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

// ─── Order ─────────────────────────────────────────────
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  vendorId: string;
  vendor?: FoodVendor;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  deliverySeat?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
}

// ─── Queue & Alert ─────────────────────────────────────
export interface QueueStatus {
  id: string;
  vendorId: string;
  eventId: string;
  waitMinutes: number;
  queueLength: number;
  updatedAt: string;
}

export type AlertPriority = 'low' | 'normal' | 'high' | 'critical';
export type AlertType = 'emergency' | 'crowd' | 'weather' | 'info';

export interface Alert {
  id: string;
  eventId: string;
  type: AlertType;
  message: string;
  priority: AlertPriority;
  isActive: boolean;
  createdAt: string;
}

// ─── API Response Wrappers ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
