import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type DriverPresence = 'online' | 'offline';
export type DocumentStatus = 'pending' | 'under_review' | 'verified' | 'rejected';
export type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired';
export type JobType = 'ride' | 'delivery' | 'rental' | 'tour' | 'ambulance' | 'shuttle' | 'shared';
export type JobStatus = 'pending' | 'offered' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
export type TripStatus =
  | 'requested'
  | 'assigned'
  | 'driver_en_route'
  | 'arrived'
  | 'rider_verified'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  phone?: string;
  roles: string[];
  driverId: string;
}

export interface DriverProfileRecord {
  driverId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  onboardingStatus: 'incomplete' | 'complete';
  preferences: {
    areaIds: string[];
    serviceIds: string[];
    requirementIds: string[];
  };
  checkpoints: Record<string, boolean>;
}

export interface DriverLocationRecord {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface DriverDocumentRecord {
  id: string;
  driverId: string;
  documentType: string;
  fileUrl: string;
  expiryDate: string;
  status: DocumentStatus;
  rejectionReason?: string;
  updatedAt: number;
}

export interface VehicleRecord {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  accessories: Record<string, 'Available' | 'Missing' | 'Required'>;
}

export interface VehicleDocumentRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  documentType: string;
  fileUrl: string;
  expiryDate: string;
  status: DocumentStatus;
  updatedAt: number;
}

export interface JobRecord {
  id: string;
  driverId: string;
  type: JobType;
  status: JobStatus;
  pickup: string;
  dropoff: string;
  requestedAt: number;
}

export interface TripRecord {
  id: string;
  driverId: string;
  jobId: string;
  type: JobType;
  status: TripStatus;
  otpCode?: string;
  requestedAt: number;
  updatedAt: number;
}

export interface DeliveryOrderRecord {
  id: string;
  driverId: string;
  status: 'pending' | 'accepted' | 'in_route' | 'completed';
  routeId: string;
  pickupAddress: string;
  dropoffAddress: string;
}

export interface DeliveryRouteStopRecord {
  id: string;
  routeId: string;
  status: 'pending' | 'completed';
  address: string;
}

export interface DeliveryRouteRecord {
  id: string;
  driverId: string;
  orderId: string;
  status: 'pending' | 'pickup_confirmed' | 'qr_verified' | 'in_progress' | 'completed';
  stops: DeliveryRouteStopRecord[];
}

export interface EmergencyContactRecord {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface SafetyEventRecord {
  id: string;
  driverId: string;
  tripId: string;
  type: 'temporary_stop' | 'safety_check' | 'sos';
  payload: Record<string, unknown>;
  createdAt: number;
}

export interface EarningsEventRecord {
  id: string;
  driverId: string;
  tripId?: string;
  amount: number;
  type: string;
  createdAt: number;
}

export interface WalletRecord {
  driverId: string;
  currency: string;
  availableBalance: number;
}

export interface CashoutRequestRecord {
  id: string;
  driverId: string;
  methodId: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  createdAt: number;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  driverId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface RiderProfileRecord {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  provider: 'email' | 'evzone' | 'google' | 'apple';
  role: 'rider';
  initials: string;
}

export interface RiderNotificationRecord {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: 'status' | 'payment' | 'security' | 'promo';
  read: boolean;
  createdAt: number;
}

export interface RiderTripRecord {
  id: string;
  userId: string;
  status:
    | 'requested'
    | 'assigned'
    | 'driver_en_route'
    | 'arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  pickupLabel: string;
  pickupAddress: string;
  dropoffLabel: string;
  dropoffAddress: string;
  etaMinutes: number;
  fareEstimate: string;
  distance: string;
  routeSummary: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  otpCode: string;
  startedAt?: number;
  completedAt?: number;
  updatedAt: number;
}

@Injectable()
export class InMemoryStoreService {
  users: UserRecord[] = [];
  refreshTokens = new Map<string, string>();
  otpCodes = new Map<string, string>();
  driverProfiles: DriverProfileRecord[] = [];
  driverPresence = new Map<string, DriverPresence>();
  driverLocations = new Map<string, DriverLocationRecord>();
  driverDocuments: DriverDocumentRecord[] = [];
  vehicles: VehicleRecord[] = [];
  vehicleDocuments: VehicleDocumentRecord[] = [];
  jobs: JobRecord[] = [];
  trips: TripRecord[] = [];
  deliveryOrders: DeliveryOrderRecord[] = [];
  deliveryRoutes: DeliveryRouteRecord[] = [];
  emergencyContacts: EmergencyContactRecord[] = [];
  safetyEvents: SafetyEventRecord[] = [];
  earnings: EarningsEventRecord[] = [];
  wallets: WalletRecord[] = [];
  cashoutRequests: CashoutRequestRecord[] = [];
  notifications: NotificationRecord[] = [];
  riderProfiles: RiderProfileRecord[] = [];
  riderNotifications: RiderNotificationRecord[] = [];
  riderTrips: RiderTripRecord[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const userId = this.id();
    const driverId = 'driver-demo-001';
    this.users.push({
      id: userId,
      email: 'driver@example.com',
      password: 'password123',
      phone: '+256700000001',
      roles: ['driver'],
      driverId,
    });

    this.driverProfiles.push({
      driverId,
      fullName: 'Joshua Tihabwangye',
      email: 'driver@example.com',
      phone: '+256700000001',
      city: 'Kampala',
      country: 'Uganda',
      onboardingStatus: 'incomplete',
      preferences: {
        areaIds: ['kampala-central'],
        serviceIds: ['ride', 'delivery'],
        requirementIds: [],
      },
      checkpoints: {
        roleSelected: true,
        documentsVerified: false,
        identityVerified: false,
        vehicleReady: true,
        emergencyContactReady: false,
        trainingCompleted: false,
      },
    });

    this.driverPresence.set(driverId, 'offline');

    const rideJobId = 'job-ride-001';
    this.jobs.push({
      id: rideJobId,
      driverId,
      type: 'ride',
      status: 'offered',
      pickup: 'Kololo',
      dropoff: 'Ntinda',
      requestedAt: Date.now() - 1000 * 60 * 10,
    });

    const deliveryOrderId = 'order-delivery-001';
    const routeId = 'route-delivery-001';
    this.deliveryOrders.push({
      id: deliveryOrderId,
      driverId,
      status: 'pending',
      routeId,
      pickupAddress: 'Nakasero',
      dropoffAddress: 'Bugolobi',
    });

    this.deliveryRoutes.push({
      id: routeId,
      driverId,
      orderId: deliveryOrderId,
      status: 'pending',
      stops: [
        { id: 'stop-1', routeId, status: 'pending', address: 'Nakasero Plaza' },
        { id: 'stop-2', routeId, status: 'pending', address: 'Bugolobi Village Mall' },
      ],
    });

    this.wallets.push({
      driverId,
      currency: 'UGX',
      availableBalance: 25750,
    });

    this.earnings.push({
      id: this.id(),
      driverId,
      tripId: 'trip-legacy-1',
      amount: 18000,
      type: 'base_trip',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    });

    this.notifications.push({
      id: this.id(),
      userId,
      driverId,
      title: 'Welcome',
      message: 'Complete onboarding to go online.',
      read: false,
      createdAt: Date.now(),
    });

    const riderUserId = this.id();
    this.users.push({
      id: riderUserId,
      email: 'rider@example.com',
      password: 'password123',
      phone: '+256700000011',
      roles: ['rider'],
      driverId: `rider-shadow-${this.id().slice(0, 8)}`,
    });

    this.riderProfiles.push({
      userId: riderUserId,
      fullName: 'Rachel Zoe',
      email: 'rider@example.com',
      phone: '+256700000011',
      avatarUrl: null,
      provider: 'email',
      role: 'rider',
      initials: 'RZ',
    });

    this.riderNotifications.push({
      id: this.id(),
      userId: riderUserId,
      title: 'Ride Reminder',
      body: 'Your saved pickup location is still available.',
      category: 'status',
      read: false,
      createdAt: Date.now() - 1000 * 60 * 40,
    });

    this.riderTrips.push({
      id: 'rider-trip-001',
      userId: riderUserId,
      status: 'completed',
      pickupLabel: 'Acacia Mall',
      pickupAddress: 'Acacia Avenue, Kampala',
      dropoffLabel: 'Ntinda',
      dropoffAddress: 'Ntinda Trading Center, Kampala',
      etaMinutes: 0,
      fareEstimate: 'UGX 18,000',
      distance: '8 km',
      routeSummary: 'Acacia Ave -> Jinja Rd -> Ntinda',
      driverName: 'Tim Smith',
      driverPhone: '+256700000123',
      driverRating: 4.8,
      vehicleModel: 'Tesla Model Y',
      vehicleColor: 'White',
      vehiclePlate: 'UAX 256A',
      otpCode: '4821',
      startedAt: Date.now() - 1000 * 60 * 62,
      completedAt: Date.now() - 1000 * 60 * 30,
      updatedAt: Date.now() - 1000 * 60 * 30,
    });
  }

  id(): string {
    return randomUUID();
  }
}
