import React, { useState } from 'react';
import { SystemConfig, PaymentRequest, AppUser } from '../types';
import { 
  Sliders, 
  Send, 
  CheckCircle, 
  XCircle, 
  Coins, 
  UserCog, 
  ShieldAlert, 
  Eye, 
  X, 
  FileImage, 
  Sparkles, 
  Database,
  UserPlus,
  QrCode,
  Upload,
  Cpu,
  Globe,
  Key,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  payments: PaymentRequest[];
  onApprovePayment: (paymentId: string) => void;
  onRejectPayment: (paymentId: string, comment: string) => void;
  user: AppUser;
  onManualUpdateUserCredits: (basic: number, premium: number) => void;
  onInjectGlory: () => void;
  onLaunchMockPayment: () => void;
}

export default function AdminPanel({
  config,
  onUpdateConfig,
  payments,
  onApprovePayment,
  onRejectPayment,
  user,
  onManualUpdateUserCredits,
  onInjectGlory,
  onLaunchMockPayment
}: AdminPanelProps) {
  // Configuration states
  const [siteName, setSiteName] = useState(config.siteName);
  const [upiId, setUpiId] = useState(config.upiId);
  const [isLive, setIsLive] = useState(config.isLive !== false);
  const [qrCodeAvailable, setQrCodeAvailable] = useState(config.qrCodeAvailable !== false);
  const [announcement, setAnnouncement] = useState(config.announcement);
  const [botsOverlay, setBotsOverlay] = useState(config.liveActiveBotsOverlay);
  const [telegram, setTelegram] = useState(config.adminTelegram);
  const [qrCodeUrl, setQrCodeUrl] = useState(config.qrCodeUrl || '');
  const [adminPasscode, setAdminPasscode] = useState(config.adminPasscode || 'admin123');

  // ffglory.pro automation states
  const [autoLaunchEnabled, setAutoLaunchEnabled] = useState(config.autoLaunchEnabled || false);
  const [ffGloryUsername, setFfGloryUsername] = useState(config.ffGloryUsername || '');
  const [ffGloryPassword, setFfGloryPassword] = useState(config.ffGloryPassword || '');
  const [ffGloryAdminPass, setFfGloryAdminPass] = useState(config.ffGloryAdminPass || '');
  const [ffGloryRegion, setFfGloryRegion] = useState(config.ffGloryRegion || 'India');
  const [ffGloryPlan, setFfGloryPlan] = useState(config.ffGloryPlan || 'basic');

  // User credit custom overrides (Squad slots)
  const [customBasic, setCustomBasic] = useState(user.basicCredits);

  // Rejection comment states
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});

  // Screenshot viewer states
  const [activeReceiptBase64, setActiveReceiptBase64] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      siteName,
      upiId,
      announcement,
      liveActiveBotsOverlay: botsOverlay,
      adminTelegram: telegram,
      qrCodeUrl,
      adminPasscode,
      isLive,
      qrCodeAvailable,
      autoLaunchEnabled,
      ffGloryUsername,
      ffGloryPassword,
      ffGloryAdminPass,
      ffGloryRegion,
      ffGloryPlan,
    });
  };

  const handleUpdateUserCredits = () => {
    onManualUpdateUserCredits(customBasic, 0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Disclaimer banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-start gap-4">
        <ShieldAlert className="text-amber-400 w-10 h-10 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-300">Admin Control Panel</h4>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Verify payment requests, match UTR codes with your bank, and approve deployments. When you approve, the system automatically launches the specified number of squads for the target Free Fire UID!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Config Panel Controls */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-5 shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} className="text-amber-400" /> Platform General Controls
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              {/* Site Name and Telegram */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase">Site Name</label>
                  <input
                    id="admin-site-name"
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase">Telegram Support</label>
                  <input
                    id="admin-telegram-handle"
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-mono text-white outline-none focus:border-amber-500/30"
                  />
                </div>
              </div>

              {/* UPI VPA ID */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Target UPI VPA (ID for user payments)</label>
                <input
                  id="admin-merchant-vpa"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-mono text-white outline-none focus:border-amber-500/30 font-mono"
                />
              </div>

              {/* Custom QR Code Image Upload */}
              <div className="space-y-2 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                  <QrCode size={13} className="text-amber-400 animate-pulse" /> Admin Merchant UPI QR Code
                </label>
                <p className="text-[9px] text-neutral-500 leading-normal">
                  Upload GPay, Paytm, PhonePe, or any custom QR Code Image. If left empty, a dynamic QR Code will be auto-generated based on the VPA above.
                </p>
                
                 {qrCodeUrl ? (
                  <div className="border border-neutral-800 bg-neutral-900 rounded-xl p-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={qrCodeUrl}
                        alt="Uploaded Merchant Scan QR"
                        className="w-11 h-11 rounded-lg object-contain bg-white border border-neutral-800 p-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold block leading-none">CUSTOM QR ACTIVE</span>
                        <span className="text-[8px] text-neutral-500 font-mono">Saved to App Memory</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQrCodeUrl('');
                        onUpdateConfig({
                          ...config,
                          qrCodeUrl: ''
                        });
                      }}
                      className="p-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <label className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-neutral-900 hover:bg-neutral-850 hover:border-neutral-750 border border-neutral-800 rounded-xl text-[10px] font-black tracking-widest text-neutral-300 uppercase cursor-pointer transition-all">
                      <Upload size={12} className="text-amber-400" /> Upload QR Screenshot
                      <input
                        id="admin-qr-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setQrCodeUrl(reader.result);
                                onUpdateConfig({
                                  ...config,
                                  qrCodeUrl: reader.result
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest leading-none bg-neutral-900 border border-neutral-850 p-2.5 rounded-lg select-none">
                      Dynamic Active
                    </span>
                  </div>
                )}
              </div>

              {/* Private Admin Passcode */}
              <div className="space-y-1 bg-red-500/5 p-3 rounded-2xl border border-red-500/10">
                <label className="text-[10px] font-bold text-red-450 uppercase tracking-wider block flex items-center gap-1">
                  <span>🔒 Change Admin Passcode</span>
                </label>
                <input
                  id="admin-private-passcode"
                  type="text"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter custom passcode"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-red-500/30 font-bold"
                />
                <p className="text-[9px] text-neutral-500 leading-normal mt-0.5">
                  Change this password to lock the Staff Access section with a brand-new secret key. Keep it secure!
                </p>
              </div>

              {/* Live bots overlay indicator */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Simulated Online Squads/Bots Indicator</label>
                <input
                  id="admin-bots-overlay"
                  type="number"
                  value={botsOverlay}
                  onChange={(e) => setBotsOverlay(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-mono text-white outline-none focus:border-amber-500/30 font-mono font-bold"
                />
              </div>

              {/* Toggles: System Mode & QR Code Status */}
              <div className="grid grid-cols-2 gap-3.5 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    System Hub Mode
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsLive(!isLive)}
                    className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                      isLive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {isLive ? '🟢 ONLINE' : '🔴 OFFLINE'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    UPI QR Code Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setQrCodeAvailable(!qrCodeAvailable)}
                    className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                      qrCodeAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}
                  >
                    {qrCodeAvailable ? '✅ Available' : '🚫 Not Available'}
                  </button>
                </div>
              </div>

              {/* Announcement marquee banner */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Global Site Announcement Ticker</label>
                <textarea
                  id="admin-announcement-area"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-amber-500/30 resize-none leading-relaxed"
                />
              </div>

              {/* Apply settings */}
              <button
                id="admin-save-config-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 text-neutral-950 cursor-pointer"
              >
                <Send size={12} /> Save Global Config
              </button>
            </form>
          </div>

          {/* ffglory.pro Automation Config Card */}
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu size={16} className="text-amber-500 animate-pulse" /> ffglory.pro Autopilot
              </h3>
              <button
                type="button"
                onClick={() => setAutoLaunchEnabled(!autoLaunchEnabled)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  autoLaunchEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm'
                    : 'bg-neutral-950 text-neutral-550 border-neutral-800'
                }`}
              >
                {autoLaunchEnabled ? '● Active' : '○ Standby'}
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Enter your <code className="text-amber-400 font-bold bg-neutral-950 px-1 py-0.5 rounded text-[10px]">ffglory.pro</code> operator dashboard credentials to trigger automatic real-time squad deployment on payment approval.
            </p>

            <div className="space-y-3.5 bg-neutral-950 p-4 rounded-2xl border border-neutral-850/50">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <UserPlus size={10} className="text-amber-500/60" /> Account Username / Phone
                </label>
                <input
                  type="text"
                  value={ffGloryUsername}
                  onChange={(e) => setFfGloryUsername(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Key size={10} className="text-amber-500/60" /> Account Password
                </label>
                <input
                  type="password"
                  value={ffGloryPassword}
                  onChange={(e) => setFfGloryPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Key size={10} className="text-amber-500/60" /> ffglory.pro Sec-Pass (Admin PIN)
                </label>
                <input
                  type="password"
                  value={ffGloryAdminPass}
                  onChange={(e) => setFfGloryAdminPass(e.target.value)}
                  placeholder="e.g. 8832"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500/30 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-550 uppercase flex items-center gap-1">
                    <Globe size={10} className="text-amber-500/65" /> Server
                  </label>
                  <select
                    value={ffGloryRegion}
                    onChange={(e) => setFfGloryRegion(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 outline-none focus:border-amber-500/30 font-bold"
                  >
                    <option value="India">India 🇮🇳</option>
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="Nepal">Nepal 🇳🇵</option>
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="Europe">Europe 🇪🇺</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-555 uppercase flex items-center gap-1">
                    Plan
                  </label>
                  <select
                    value={ffGloryPlan}
                    onChange={(e) => setFfGloryPlan(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 outline-none focus:border-amber-500/30 font-bold"
                  >
                    <option value="basic">Basic Plan (₹90)</option>
                    <option value="premium">Premium Plan (₹150)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                onUpdateConfig({
                  ...config,
                  autoLaunchEnabled,
                  ffGloryUsername,
                  ffGloryPassword,
                  ffGloryAdminPass,
                  ffGloryRegion,
                  ffGloryPlan,
                });
              }}
              className="w-full py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
            >
              <RefreshCw size={11} /> Save Uplink Handshake
            </button>
          </div>

          {/* Sandbox Helper Deck */}
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database size={16} className="text-amber-400" /> Client Squad Injectors
            </h3>

            <div className="space-y-3">
              <p className="text-[11px] text-neutral-500 leading-normal">
                Directly override the default client account balance (<strong className="text-neutral-300">glory99</strong>) to credit or test squad farming slots instantly:
              </p>

              <div className="space-y-1 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Active Squad Credit Balance</label>
                <input
                  id="sandbox-basic-credits"
                  type="number"
                  value={customBasic}
                  onChange={(e) => setCustomBasic(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-none text-xs font-mono font-black text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  id="sandbox-sync-btn"
                  onClick={handleUpdateUserCredits}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-[10px] font-bold font-mono text-neutral-200 transition-all uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserCog size={11} /> Sync Balance
                </button>
                <button
                  id="sandbox-inject-glory-btn"
                  onClick={onInjectGlory}
                  className="py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono transition-all uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles size={11} /> Inject Glory (+200pt)
                </button>
              </div>

              <button
                id="sandbox-mock-payment-btn"
                onClick={onLaunchMockPayment}
                className="w-full py-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[10px] font-bold font-mono transition-all uppercase flex items-center justify-center gap-1 select-none cursor-pointer"
              >
                <UserPlus size={11} /> Populate Test Order (5 Squads)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Payments Verification Queue */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins size={16} className="text-amber-400" /> Pending UTR Verification Queue
              </span>
              <span className="text-[10px] bg-neutral-950 font-mono text-neutral-400 px-3 py-1 rounded-full border border-neutral-850">
                {payments.filter(p => p.status === 'pending').length} Action Needed
              </span>
            </h3>

            {payments.filter(p => p.status === 'pending').length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-800 rounded-2xl select-none">
                <CheckCircle className="text-neutral-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-bold text-neutral-400">All reviews cleared!</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">No outstanding client squad orders in the queue.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                {payments.filter(p => p.status === 'pending').map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3 animate-fade-in"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black text-neutral-400 font-mono uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                            {pay.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase rounded-full px-2 py-0.5 bg-amber-500/10 text-amber-400">
                            {pay.creditsQuantity} Squads Deployed Group
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-1">
                          <span>Sender ID: <strong className="text-neutral-350">{pay.userId}</strong></span>
                          <span>&bull;</span>
                          <span>FF UID target: <strong className="text-amber-400 font-mono text-xs">{pay.userUID}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-amber-400 font-mono">₹{pay.amount}</p>
                        <p className="text-[9px] text-neutral-500 font-mono">{new Date(pay.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: UTR and input comment */}
                      <div className="space-y-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Client UTR Code (12-Digits):</span>
                          <span className="text-xs font-bold text-white font-mono bg-neutral-900 border border-neutral-850 px-2.5 py-1.5 rounded-lg block text-center border-amber-500/20 select-all font-bold">
                            {pay.utr}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase block">Admin Comment (Optional text details)</span>
                          <input
                            type="text"
                            placeholder="e.g. Squads deployed successfully!"
                            value={commentInput[pay.id] || ''}
                            onChange={(e) => setCommentInput({ ...commentInput, [pay.id]: e.target.value })}
                            className="w-full bg-neutral-905 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-500/30"
                          />
                        </div>
                      </div>

                      {/* Right: Screenshot preview thumbnail */}
                      <div className="flex flex-col justify-between p-2 bg-neutral-905 rounded-xl border border-neutral-850/50">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Receipt Screenshot:</span>
                        {pay.proofImage ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={pay.proofImage}
                              alt="deposit copy screenshot"
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded object-cover border border-neutral-800"
                            />
                            <button
                              id={`view-proof-btn-${pay.id}`}
                              onClick={() => setActiveReceiptBase64(pay.proofImage || null)}
                              className="p-1.5 px-3 bg-neutral-850 hover:bg-neutral-800 text-[10px] text-neutral-300 font-mono border border-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View Proof
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-neutral-600 text-xs">
                            <FileImage size={15} /> No screenshot provided
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decisions button */}
                    <div className="flex gap-2.5 pt-1">
                      <button
                        id={`approve-btn-${pay.id}`}
                        onClick={() => onApprovePayment(pay.id)}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md shadow-amber-500/5 cursor-pointer"
                      >
                        <CheckCircle size={13} /> Approve Payment & Deploy Squad
                      </button>
                      <button
                        id={`reject-btn-${pay.id}`}
                        onClick={() => onRejectPayment(pay.id, commentInput[pay.id] || '')}
                        className="p-3 bg-red-950/25 hover:bg-red-950/40 text-red-400 font-bold border border-red-900/40 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Overlay Modal */}
      {activeReceiptBase64 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-neutral-900 p-4 rounded-3xl border border-neutral-800 relative">
            <button
              onClick={() => setActiveReceiptBase64(null)}
              className="absolute top-4 right-4 bg-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-colors z-20 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="text-center p-4">
              <h4 className="text-sm font-bold text-neutral-300 mb-4 select-none">Uploaded payment screenshot</h4>
              <div className="max-h-[70vh] overflow-y-auto bg-black p-2 rounded-2xl border border-neutral-950">
                <img
                  src={activeReceiptBase64}
                  alt="Full deposit size screenshot"
                  referrerPolicy="no-referrer"
                  className="max-w-full h-auto mx-auto border rounded border-neutral-850"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
