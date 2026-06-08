import { ActiveGroup, AppUser, SystemConfig, PaymentRequest } from '../types';

export const SQUAD_PACKAGES = [
  { squads: 1, price: 90, label: '1 Squad' },
  { squads: 2, price: 175, label: '2 Squads' },
  { squads: 3, price: 255, label: '3 Squads' },
  { squads: 4, price: 330, label: '4 Squads' },
  { squads: 5, price: 400, label: '5 Squads' },
  { squads: 10, price: 750, label: '10 Squads (Save ₹150)' },
  { squads: 15, price: 1050, label: '15 Squads (Save ₹300)' },
  { squads: 20, price: 1300, label: '20 Squads (Save ₹500)' },
];

export const REGIONS_LIST = [
  { id: 'india-basic', name: 'India 🇮🇳', type: 'Basic', flag: '🇮🇳' },
  { id: 'bangladesh-basic', name: 'Bangladesh 🇧🇩', type: 'Basic', flag: '🇧🇩' },
  { id: 'indonesia-basic', name: 'Indonesia 🇮🇩', type: 'Basic', flag: '🇮🇩' },
  { id: 'pakistan-basic', name: 'Pakistan 🇵🇰', type: 'Basic', flag: '🇵🇰' },
  { id: 'nepal-basic', name: 'Nepal 🇳🇵', type: 'Basic', flag: '🇳🇵' },
  { id: 'singapore-basic', name: 'Singapore 🇸🇬', type: 'Basic', flag: '🇸🇬' },
  { id: 'europe-basic', name: 'Europe 🇪🇺', type: 'Basic', flag: '🇪🇺' },
  { id: 'russia-basic', name: 'Russia 🇷🇺', type: 'Basic', flag: '🇷🇺' },
  { id: 'thailand-basic', name: 'Thailand 🇹🇭', type: 'Basic', flag: '🇹🇭' },
  { id: 'middle-east-premium', name: 'Middle East 🌟', type: 'Premium', flag: '🇸🇦' },
  { id: 'north-america-premium', name: 'North America 🌟', type: 'Premium', flag: '🇺🇸' },
];

export const INITIAL_USER: AppUser = {
  id: 'glory99',
  name: 'Guild Master',
  basicCredits: 5, // represents 5 active squads
  premiumCredits: 0,
  uid: '5561028471',
  registeredAt: new Date(2026, 4, 1).toISOString(),
};

export const INITIAL_CONFIG: SystemConfig = {
  siteName: 'FFGlory Pro',
  isLive: false,
  announcement: '🔥 SYSTEM SUSPENDED: Automatic registration and deployment pipelines are currently offline for maintenance. Payment services are suspended.',
  upiId: 'ffglory.pay@ybl',
  qrCodeUrl: '', // Will populate or generate beautifully
  qrCodeAvailable: false,
  pricePerCreditBasic: 90, // default base price for 1 squad
  pricePerCreditPremium: 150,
  liveActiveBotsOverlay: 312,
  adminTelegram: 'ffglory_admin_bot',
  adminPasscode: 'admin123',
  
  // ffglory.pro automatic integration defaults
  autoLaunchEnabled: false,
  ffGloryUsername: '',
  ffGloryPassword: '',
  ffGloryAdminPass: '',
  ffGloryRegion: 'India',
  ffGloryPlan: 'basic',
  
  // Default API configuration mapping
  masterOwnerId: 'glory_master',
  masterBasicCredits: 5000,
  masterPremiumCredits: 1000,
  isApiSyncActive: true,
  apiLogs: [
    {
      id: 'API_TXN_001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      clientUsername: 'glory99',
      clientUid: '5561028471',
      creditType: 'basic',
      creditsQuantity: 5,
      masterOriginalBalance: 5000,
      masterClearedBalance: 4995,
      status: 'SUCCESS'
    }
  ]
};

export const INITIAL_ACTIVE_GROUPS: ActiveGroup[] = [
  {
    id: '15962983368',
    userId: 'glory99',
    clanId: '5561028471',
    region: 'India 🇮🇳',
    clanName: 'ALPHA GUILD [SQUADS ACTIVE]',
    captainName: '★ SQUAD TEAM ★',
    membersCount: '48/50',
    totalGlory: 420,
    targetGlory: 1800,
    botsLaunched: 5, // 5 squads assigned
    status: 'running',
    type: 'Basic',
    uptimeMinutes: 84,
    createdAt: new Date().toISOString(),
    logs: [
      '[17:55:01] Garena slot 1 connected to server IND-GLORY-3',
      '[17:55:10] Squad member profiles authenticated with secure emulator handshake',
      '[17:56:45] Queued CS loop matches. Accumulated 48 Guild Glory points',
      '[18:02:12] Auto-Win registered. Glory points synchronized: +120',
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentRequest[] = [
  {
    id: 'TXN74712',
    userId: 'glory99',
    userUID: '5561028471',
    amount: 400,
    creditType: 'basic',
    creditsQuantity: 5, // 5 Squads package
    utr: '617258931245',
    status: 'approved',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    adminComment: 'Approved by admin. 5 Squads deployed successfully!'
  }
];

export const SIMULATE_LOG_TEMPLATES = [
  "connecting to game matchmaking region: IND...",
  "bypassing anti-cheat layer with secure android emulator handshake...",
  "successfully joined team code lobby...",
  "match starting in 3.. 2.. 1..",
  "playing competitive automated loop...",
  "match completed! Glory points extracted successfully.",
  "gained +9 Glory. Synchronizing with Garena guild dashboard...",
  "latency safe: 42ms. Rotating IP pool proxy...",
];
