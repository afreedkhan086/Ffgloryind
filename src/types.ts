export interface AppUser {
  id: string; // login username or ID, default: glory99
  name: string;
  basicCredits: number; // represents Unused/Refunded Squad Slots
  premiumCredits: number; // custom premium slots if any
  uid: string; // Default Free Fire Player/Guild ID (e.g. 5561028471)
  registeredAt: string;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  userId: string;
  userUID: string; // The Target Free Fire ID (UID) to receive the squads
  amount: number; // in INR (₹)
  creditType: 'basic' | 'premium'; // mapping to basic/premium line
  creditsQuantity: number; // Count of Squads purchased (e.g. 1, 2, 3, 4, 5, 10, 15, 20)
  utr: string; // 12-digit UTR/UPI Transaction ID
  status: PaymentStatus;
  timestamp: string;
  proofImage?: string; // Base64 uploaded screenshot
  adminComment?: string;
}

export type GroupStatus = 'running' | 'stopped' | 'paused';
export type CreditType = 'Basic' | 'Premium';

export interface ActiveGroup {
  id: string;
  userId: string;
  clanId: string; // Target Guild or Player UID
  region: string; // Accounts Region (e.g., India)
  clanName: string; // e.g. "ALPHA SQUAD LV.7"
  captainName: string; // Simulated Creator
  membersCount: string; // e.g., "48/50"
  totalGlory: number; // current glory points accumulated
  targetGlory: number; // usually 1800 for max rewards
  botsLaunched: number; // number of squads/bots assigned (from creditsQuantity!)
  status: GroupStatus;
  type: CreditType;
  uptimeMinutes: number;
  createdAt: string;
  logs: string[]; // live simulation logs
}

export interface SystemConfig {
  siteName: string;
  isLive: boolean;
  announcement: string;
  upiId: string; // UPI ID (VPA) for receiving payments
  qrCodeUrl: string; // Base64 or standard asset
  pricePerCreditBasic: number; // e.g. 80 INR
  pricePerCreditPremium: number; // e.g. 150 INR
  liveActiveBotsOverlay: number; // Simulated total active system-wide bots
  adminTelegram: string;
  
  // Custom Master Administrator API configuration
  masterOwnerId?: string;
  masterBasicCredits?: number;
  masterPremiumCredits?: number;
  isApiSyncActive?: boolean;
  apiLogs?: ApiLog[];
}

export interface ApiLog {
  id: string;
  timestamp: string;
  clientUsername: string;
  clientUid: string;
  creditType: 'basic' | 'premium';
  creditsQuantity: number;
  masterOriginalBalance: number;
  masterClearedBalance: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}
