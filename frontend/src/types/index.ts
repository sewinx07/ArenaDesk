export type CafeStatus = 'active' | 'inactive' | 'suspended';
export type PCStatus = 'available' | 'in_use' | 'maintenance' | 'offline';
export type SessionStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
export type TournamentStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'disputed';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionType = 'session' | 'reservation' | 'pos' | 'membership' | 'topup' | 'refund';
export type PaymentMethod = 'cash' | 'card' | 'mobile_payment' | 'wallet' | 'online';
export type UserRole = 'admin' | 'manager' | 'staff' | 'owner';
export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type ResourceType = 'pc' | 'console' | 'vip_room' | 'event_space';

export interface Cafe {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: CafeStatus;
  openingTime: string;
  closingTime: string;
  timezone: string;
  pcCount: number;
  staffCount: number;
  monthlyRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  cafeId: string;
  cafe?: Cafe;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  cafeId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  membershipTier: MembershipTier;
  loyaltyPoints: number;
  totalSpent: number;
  walletBalance: number;
  totalSessions: number;
  totalHours: number;
  joinDate: string;
  lastVisit?: string;
  isActive: boolean;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PC {
  id: string;
  cafeId: string;
  name: string;
  identifier: string;
  status: PCStatus;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    os: string;
  };
  hourlyRate: number;
  currentSession?: Session;
  lastSessionEnd?: string;
  totalHoursUsed: number;
  totalRevenue: number;
  isLocked: boolean;
  position?: { row: number; col: number };
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  pcId: string;
  pc?: PC;
  memberId?: string;
  member?: Member;
  cafeId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: SessionStatus;
  cost: number;
  hourlyRate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  cafeId: string;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  memberId?: string;
  member?: Member;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: ReservationStatus;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  cafeId: string;
  name: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  maxParticipants: number;
  minParticipants: number;
  registrationFee: number;
  prizePool: number;
  prizeDistribution: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  description: string;
  rules: string;
  image?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  memberId?: string;
  member?: Member;
  playerName: string;
  playerEmail: string;
  seed: number;
  status: 'registered' | 'confirmed' | 'checked_in' | 'eliminated' | 'winner';
  paid: boolean;
  registeredAt: string;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  player1Id?: string;
  player1?: TournamentParticipant;
  player2Id?: string;
  player2?: TournamentParticipant;
  winnerId?: string;
  score1?: number;
  score2?: number;
  status: MatchStatus;
  scheduledTime?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  cafeId: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  referenceId?: string;
  referenceType?: string;
  memberId?: string;
  member?: Member;
  description: string;
  staffId: string;
  staffName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  cafeId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'cancelled';
  memberId?: string;
  member?: Member;
  customerName?: string;
  staffId: string;
  staffName: string;
  createdAt: string;
}

/** @deprecated Use Cafe instead */
export type BranchStatus = CafeStatus;
/** @deprecated Use Cafe instead */
export interface Branch extends Cafe {}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardStats {
  activeSessions: number;
  activeSessionsChange: number;
  todayRevenue: number;
  todayRevenueChange: number;
  activeMembers: number;
  activeMembersChange: number;
  pcUtilization: number;
  pcUtilizationChange: number;
  totalPCs: number;
  availablePCs: number;
  inUsePCs: number;
  maintenancePCs: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  sessions: number;
  pos: number;
  memberships: number;
}

export interface PeakHour {
  hour: number;
  utilization: number;
  dayOfWeek: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  createdAt: string;
}

export interface PaymentMethodInfo {
  id: string;
  type: 'card' | 'mobile_payment';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  provider?: string;
  phoneNumber?: string;
}

export interface Subscription {
  id: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}
