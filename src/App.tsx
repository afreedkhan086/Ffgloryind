/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  History, 
  Flame,
  QrCode,
  Database,
  Lock,
  LogOut,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppUser, PaymentRequest, SystemConfig } from './types';
import { 
  INITIAL_USER, 
  INITIAL_CONFIG, 
  INITIAL_PAYMENTS
} from './utils/mockData';
import UpiPaymentBox from './components/UpiPaymentBox';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // --- Core Persistent State Loaded from Local Storage ---
  const [user, setUser] = useState<AppUser>(() => {
    const saved = localStorage.getItem('ffglory_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [payments, setPayments] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('ffglory_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('ffglory_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  // --- Portal Authentication & User DB Management states ---
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(() => {
    return localStorage.getItem('ffglory_admin_verified') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ffglory_admin_verified', isAdminVerified ? 'true' : 'false');
  }, [isAdminVerified]);

  // --- UI Layout and Transient State ---
  const [activeTab, setActiveTab] = useState<'payment' | 'history' | 'admin'>('payment');
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'info' | 'error' }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [systemClock, setSystemClock] = useState('');

  // Synchronize state with localStorage
  useEffect(() => {
    localStorage.setItem('ffglory_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ffglory_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ffglory_config', JSON.stringify(config));
  }, [config]);

  // Clock Ticker Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setSystemClock(d.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Triggers elegant custom sounds for visual feedback
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      console.warn('AudioContext bypass');
    }
  };

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    
    // Play sound matching frequency
    if (type === 'success') playBeep(880, 'triangle', 0.12);
    else if (type === 'error') playBeep(220, 'sawtooth', 0.15);
    else playBeep(440, 'sine', 0.08);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // --- Deposit Payment Submissions ---
  const handlePaymentSubmit = (
    amount: number, 
    creditType: 'basic' | 'premium', 
    quantity: number, 
    utr: string, 
    base64Image: string,
    targetUid: string
  ) => {
    const newTxn: PaymentRequest = {
      id: 'TXN' + Math.floor(10000 + Math.random() * 90000).toString(),
      userId: user.id,
      userUID: targetUid,
      amount: amount,
      creditType: creditType,
      creditsQuantity: quantity,
      utr: utr,
      status: 'pending',
      timestamp: new Date().toISOString(),
      proofImage: base64Image
    };

    setPayments(prev => [newTxn, ...prev]);
    triggerToast(`📋 Order Submitted! Processing UTR: ${utr} for UID: ${targetUid}.`, 'success');
    setActiveTab('history');
  };

  // --- Admin Operations Handlers ---
  const handleApprovePayment = (paymentId: string) => {
    const targPay = payments.find(p => p.id === paymentId);
    if (!targPay) return;

    const quantity = targPay.creditsQuantity;

    // Approve status
    setPayments(prev => prev.map(p => p.id === paymentId ? { 
      ...p, 
      status: 'approved', 
      adminComment: `Verified via banking statement. Successfully deployed ${quantity} squads for target UID: ${targPay.userUID}!` 
    } : p));
    
    // Update active user credits (representing unused squad slots if any)
    setUser(prev => {
      if (targPay.userId.toLowerCase() === prev.id.toLowerCase()) {
        return {
          ...prev,
          basicCredits: prev.basicCredits + quantity
        };
      }
      return prev;
    });

    triggerToast(`✅ Payment approved & ${quantity} Squads deployed for UID: ${targPay.userUID}!`, 'success');
  };

  const handleRejectPayment = (paymentId: string, comment: string) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { 
      ...p, 
      status: 'rejected', 
      adminComment: comment || 'UTR verification failed. Please upload a valid payment proof.' 
    } : p));
    triggerToast(`❌ Payment request ${paymentId} rejected.`, 'error');
  };

  const handleManualUpdateUserCredits = (basic: number) => {
    setUser(prev => ({
      ...prev,
      basicCredits: basic
    }));
    triggerToast(`🔧 Synchronized account squad balances!`, 'success');
  };

  const handleLaunchMockPaymentAndUplink = () => {
    const mockUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const mockTxn: PaymentRequest = {
      id: 'TXN' + Math.floor(10000 + Math.random() * 90000).toString(),
      userId: 'guest_gamer99',
      userUID: '984120358',
      amount: 400,
      creditType: 'basic',
      creditsQuantity: 5,
      utr: mockUtr,
      status: 'pending',
      timestamp: new Date().toISOString(),
      proofImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop'
    };
    setPayments(prev => [mockTxn, ...prev]);
    triggerToast(`🔧 Populated test customer deposit request under UTR: ${mockUtr}`, 'info');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30 flex flex-col relative overflow-x-hidden animate-fade-in">
      
      {/* Background Gradients */}
      <div className="fixed top-0 right-[-100px] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-[-150px] w-[600px] h-[600px] bg-neutral-900/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* Global Live Bar Ticker/Announcement Header */}
      {config.isLive && (
        <div id="announcement-marquee-bar" className="w-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all text-neutral-950 py-2 px-6 flex items-center justify-between gap-3 relative z-40 select-none overflow-hidden font-display shadow-lg">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <Flame size={14} className="animate-bounce flex-shrink-0 text-black fill-black" />
            <div className="relative overflow-hidden h-5 w-full">
              <div className="absolute whitespace-nowrap animate-marquee font-extrabold text-xs tracking-wide">
                {config.announcement} &bull; TIME: {systemClock} &bull; COMPLIANT SECURE PORTAL
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSoundEnabled(prev => !prev)}
            className="flex-shrink-0 text-[10px] font-mono tracking-tight font-black uppercase bg-black hover:bg-neutral-950 border border-black rounded px-3 py-1.5 text-white transition-all flex items-center gap-1 cursor-pointer"
            title="Toggle alerts"
          >
            {soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
            {soundEnabled ? 'Beep On' : 'Beep Off'}
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 z-10 space-y-6 relative">
        
        {/* Simple & Normal Header without Larping components */}
        <header id="main-navigation-header" className="flex flex-wrap items-center justify-between gap-4 p-5 bg-neutral-900/40 border border-neutral-850 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center border border-amber-400/20 shadow-md">
              <Flame size={20} className="fill-black text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black font-display tracking-tighter text-white uppercase">{config.siteName}</h1>
                <span className="flex items-center gap-1 text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  Online
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono tracking-wide">Free Fire Indian Guild Glory Solution</p>
            </div>
          </div>

          {/* Quiet admin access key toggle */}
          <div className="flex items-center gap-2">
            <button
              id="header-admin-toggle-btn"
              onClick={() => setActiveTab(activeTab === 'admin' ? 'payment' : 'admin')}
              className={`p-3 px-4 rounded-2xl text-xs font-bold tracking-tight transition-all uppercase flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md' 
                  : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800 text-neutral-400'
              }`}
            >
              <Database size={13} />
              {isAdminVerified ? 'Admin Mode' : 'Staff Access'}
            </button>

            {isAdminVerified && (
              <button
                id="lock-admin-shortcut"
                onClick={() => {
                  setIsAdminVerified(false);
                  setActiveTab('payment');
                  triggerToast('Admin panel locked.', 'info');
                }}
                className="p-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900 text-red-400 rounded-2xl text-xs font-black uppercase transition-all cursor-pointer"
                title="Lock Admin Control Room"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </header>

        {/* Regular & Normal Tabs for user actions */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-950 border border-neutral-850 rounded-2xl max-w-md">
          {[
            { id: 'payment', label: 'Buy Glory Squad', icon: <QrCode size={14} /> },
            { id: 'history', label: 'Order Status', icon: <History size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id as 'payment' | 'history' | 'admin')}
              className={`flex-1 min-w-[130px] px-3 py-2 rounded-xl text-[11px] font-black tracking-tight transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 border border-amber-400 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC VIEWS SWITCHBOARD --- */}
        <div className="min-h-[450px]">
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <UpiPaymentBox 
                config={config} 
                defaultUid={user.uid}
                onPaymentSubmit={handlePaymentSubmit} 
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-2">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Your Squad Deployment Log</h3>
                  <p className="text-xs text-neutral-400">Status trackers for your submitted payment audits</p>
                </div>
                <Coins size={18} className="text-neutral-500" />
              </div>

              {payments.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-neutral-600 animate-pulse" />
                  <p className="text-xs font-bold">No squad farm history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div 
                      key={p.id}
                      className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-350 font-mono uppercase bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded">
                            {p.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase rounded-full px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/10">
                            {p.creditsQuantity} Squads Package
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Target UID: <strong className="text-amber-400 font-mono text-sm font-black">{p.userUID}</strong> &bull; Amount Paid: <strong className="text-neutral-200 font-mono">₹{p.amount}</strong>
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          UTR ID: <strong className="text-neutral-400 font-mono">{p.utr}</strong>
                        </p>
                        {p.adminComment && (
                          <p className="text-[11px] bg-neutral-900 p-2.5 rounded-xl text-neutral-400 max-w-md border border-neutral-800 leading-normal font-sans mt-2">
                            📝 <strong className="text-neutral-300">Update Note:</strong> {p.adminComment}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-neutral-450 font-mono">{new Date(p.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] text-neutral-600 font-mono">{new Date(p.timestamp).toLocaleTimeString()}</p>
                        </div>

                        {p.status === 'approved' ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase font-mono">
                            Deployed Active
                          </span>
                        ) : p.status === 'rejected' ? (
                          <span className="bg-red-500/10 text-red-505 border border-red-500/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase font-mono">
                            Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase font-mono animate-pulse">
                            Pending Audit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && (
            !isAdminVerified ? (
              <div className="max-w-md mx-auto p-8 bg-neutral-905 border border-neutral-850 rounded-3xl shadow-xl text-center space-y-6 my-12 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 mx-auto">
                  <Lock className="text-amber-400 w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">Admin Block</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Please authorize your administrator passcode key to review deployments:
                  </p>
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const inputPass = (document.getElementById('admin-key-pass') as HTMLInputElement)?.value;
                    if (inputPass === 'admin123') {
                      setIsAdminVerified(true);
                      triggerToast('Access granted!', 'success');
                    } else {
                      triggerToast('Access denied.', 'error');
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    id="admin-key-pass"
                    type="password"
                    placeholder="Enter Private key... (try admin123)"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs text-center font-mono text-white outline-none focus:border-amber-500/50 transition-all font-bold placeholder:text-neutral-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-widest font-display shadow-md transition-all cursor-pointer font-bold"
                  >
                    Unlock
                  </button>
                </form>
              </div>
            ) : (
              <AdminPanel
                config={config}
                onUpdateConfig={setConfig}
                payments={payments}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
                user={user}
                onManualUpdateUserCredits={handleManualUpdateUserCredits}
                onInjectGlory={() => triggerToast('Inject bypassed', 'info')}
                onLaunchMockPayment={handleLaunchMockPaymentAndUplink}
              />
            )
          )}
        </div>

      </div>

      {/* Auto dismissing notification toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md pointer-events-auto max-w-xs ${
                toast.type === 'success'
                  ? 'bg-neutral-900/95 border-emerald-500/20 text-neutral-200'
                  : toast.type === 'error'
                  ? 'bg-neutral-900/95 border-red-500/20 text-red-300'
                  : 'bg-neutral-900/95 border-blue-500/20 text-blue-200'
              }`}
            >
              <div className="mt-0.5 select-none font-bold">
                {toast.type === 'success' && <span className="text-emerald-400 font-extrabold text-sm">&#10003;</span>}
                {toast.type === 'error' && <span className="text-red-400 font-extrabold text-sm">&#10007;</span>}
                {toast.type === 'info' && <span className="text-blue-400 font-extrabold text-sm">&#9432;</span>}
              </div>
              <p className="text-xs leading-normal font-medium">{toast.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full bg-neutral-950/40 border-t border-neutral-900 py-8 px-6 text-center text-[10px] text-neutral-500 uppercase tracking-widest relative z-10 select-none">
        <div>
          {config.siteName} &bull; Security Node active IND-Handshake
        </div>
        <div className="text-[9px] text-neutral-600 mt-1.5 lowercase">
          Designed for Afreed Khan &bull; system recovery model compliant &bull; UTC {new Date().toISOString().slice(0, 10)}
        </div>
      </footer>

    </div>
  );
}
