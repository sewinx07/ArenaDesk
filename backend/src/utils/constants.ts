export const UserRole = { OWNER: 'owner', STAFF: 'staff', CUSTOMER: 'customer' } as const;
export const PcStatus = { AVAILABLE: 'available', IN_USE: 'in_use', RESERVED: 'reserved', OFFLINE: 'offline' } as const;
export const SessionStatus = { ACTIVE: 'active', COMPLETED: 'completed', CANCELLED: 'cancelled' } as const;
export const ReservationStatus = { PENDING: 'pending', CONFIRMED: 'confirmed', CANCELLED: 'cancelled', COMPLETED: 'completed' } as const;
export const TournamentStatus = { REGISTRATION: 'registration', IN_PROGRESS: 'in_progress', COMPLETED: 'completed' } as const;
export const PaymentMethod = { CASH: 'cash', CARD: 'card', MOBILE: 'mobile' } as const;

export const HTTP_CODES = {
  OK: 200, CREATED: 201, ACCEPTED: 202, NO_CONTENT: 204,
  BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404, CONFLICT: 409, UNPROCESSABLE: 422, TOO_MANY: 429,
  INTERNAL: 500, SERVICE_UNAVAILABLE: 503,
} as const;
