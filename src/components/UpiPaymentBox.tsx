import React, { useState, useRef, useEffect } from 'react';
import { SystemConfig } from '../types';
import { SQUAD_PACKAGES } from '../utils/mockData';
import { 
  Copy, 
  Check, 
  Upload, 
  Coins, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Award,
  Globe
} from 'lucide-react';

interface UpiPaymentBoxProps {
  config: SystemConfig;
  defaultUid: string;
  onPaymentSubmit: (amount: number, creditType: 'basic' | 'premium', quantity: number, utr: string, base64Image: string, targetUid: string) => void;
}

export default function UpiPaymentBox({ config, defaultUid, onPaymentSubmit }: UpiPaymentBoxProps) {
  // Select package index. Default to 5 squads pack (idx 4)
  const [selectedPackIdx, setSelectedPackIdx] = useState(4);
  const [targetUid, setTargetUid] = useState(defaultUid || '');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync defaultUid if it changes
  useEffect(() => {
    if (defaultUid && !targetUid) {
      setTargetUid(defaultUid);
    }
  }, [defaultUid]);

  const currentPack = SQUAD_PACKAGES[selectedPackIdx] || SQUAD_PACKAGES[0];
  const squadCount = currentPack.squads;
  const totalInr = currentPack.price;

  // Real UPI deep-link structure for scanning
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.siteName)}&am=${totalInr}&cu=INR&tn=Squad%20Glory%20Topup`;
  const qrCodeUrl = config.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=23-23-23&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMsg({ type: 'error', text: 'Please upload an image file (PNG, JPG, or JPEG)!' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotBase64(reader.result);
        setStatusMsg({ type: 'success', text: 'Screenshot loaded successfully!' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (config.isLive === false) {
      setStatusMsg({ type: 'error', text: 'Booking queue is offline. Submissions are temporarily blocked.' });
      return;
    }

    if (!targetUid.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter the Free Fire UID!' });
      return;
    }

    if (!/^\d{5,12}$/.test(targetUid.trim())) {
      setStatusMsg({ type: 'error', text: 'UID must be a valid 5 to 12 digit number!' });
      return;
    }

    if (!/^\d{12}$/.test(utrNumber.trim())) {
      setStatusMsg({ type: 'error', text: 'UTR must be a 12-digit number found in Your UPI app receipt!' });
      return;
    }

    if (!screenshotBase64) {
      setStatusMsg({ type: 'error', text: 'Please upload a screenshot of your payment proof!' });
      return;
    }

    onPaymentSubmit(totalInr, 'basic', squadCount, utrNumber.trim(), screenshotBase64, targetUid.trim());
    
    // Reset inputs
    setUtrNumber('');
    setScreenshotBase64('');
    setStatusMsg({ 
      type: 'success', 
      text: `📋 Squad Order Submitted! Admin will verify UTR: ${utrNumber} and deploy ${squadCount} squads to UID: ${targetUid} within 1 minute.` 
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-500/15 rounded-2xl flex items-center justify-center border border-amber-500/20">
          <Coins className="text-amber-400 w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-display">Buy Squad Farming Slots (UPI)</h3>
          <p className="text-xs text-neutral-450">Select your squad package, enter target UID and payment UTR to deploy instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Packages list and UTR inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select Squad Package */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 label-pkg">
              <Award size={13} className="text-amber-400" /> Step 1: Select Squad Package
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {SQUAD_PACKAGES.map((pkg, idx) => {
                const isSelected = selectedPackIdx === idx;
                const perSquadPrice = Math.round(pkg.price / pkg.squads);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPackIdx(idx);
                      setStatusMsg({ type: '', text: '' });
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5' 
                        : 'bg-neutral-950/60 border-neutral-850 hover:bg-neutral-950 hover:border-neutral-750'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-bl">
                        Selected
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black text-white">{pkg.label}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">₹{perSquadPrice}/Squad</p>
                    </div>
                    <p className="text-sm font-black font-mono text-amber-400 mt-2">₹{pkg.price}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator Output summary card */}
          <div className="flex justify-between items-center bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
            <div className="space-y-0.5">
              <span className="text-xs text-neutral-400">Total Deployment Configuration:</span>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">
                {squadCount} Squad Slots &bull; Automatic High-Speed Glory
              </p>
            </div>
            <span className="text-lg font-black text-amber-400 font-mono">
              ₹{totalInr} <span className="text-xs text-neutral-500 font-bold">INR</span>
            </span>
          </div>

          <div className="border-t border-neutral-850 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileCheck size={13} className="text-amber-400" /> Step 2: Deployment Credentials & Payment
            </h4>

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {config.isLive === false && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex flex-col gap-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-red-300">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Garena Sync Offline
                  </div>
                  <p className="text-neutral-405 leading-relaxed font-sans text-[11px]">
                    Automatic pilot deployment queue is offline. Garena lobby simulation pipelines are currently undergoing scheduled upgrades. Payment submissions are temporarily disabled.
                  </p>
                </div>
              )}

              {/* UID Field */}
              <div className={`space-y-1 ${config.isLive === false ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="text-[10px] uppercase font-semibold text-neutral-450 tracking-wider flex items-center gap-1">
                  <Globe size={11} className="text-neutral-500" /> FREE FIRE GUILD / PLAYER UID (Target for Squads)
                </label>
                <input
                  id="target-squad-uid"
                  type="text"
                  required
                  disabled={config.isLive === false}
                  value={targetUid}
                  onChange={(e) => setTargetUid(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5561028471"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs font-mono text-neutral-100 outline-none focus:border-amber-500/50 transition-all placeholder:text-neutral-700 font-bold"
                />
              </div>

              {/* UPI Merchant VPA */}
              <div className={`space-y-1 ${config.isLive === false ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="text-[10px] uppercase font-semibold text-neutral-450 tracking-wider">Target UPI VPA</label>
                <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-850 rounded-2xl font-mono text-xs text-neutral-300 relative group">
                  <span id="target-upi-vpa-val">{config.upiId}</span>
                  <button
                    id="copy-upi-btn"
                    type="button"
                    disabled={config.isLive === false}
                    onClick={handleCopyUpi}
                    className="p-1 px-3 bg-neutral-850 hover:bg-neutral-800 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 text-neutral-300"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* UTR Input */}
              <div className={`space-y-1 ${config.isLive === false ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="text-[10px] uppercase font-semibold text-neutral-450 tracking-wider">12-Digit UTR Transaction ID</label>
                <input
                  id="utr-number-input"
                  type="text"
                  required
                  maxLength={12}
                  disabled={config.isLive === false}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Paste the 12-digit UTR/UPI Ref No here..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs font-mono text-neutral-100 outline-none focus:border-amber-500/50 transition-all placeholder:text-neutral-700 font-bold"
                />
              </div>

              {/* Screenshot Upload dragging area */}
              <div className={`space-y-1 ${config.isLive === false ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="text-[10px] uppercase font-semibold text-neutral-450 tracking-wider">Screenshot/Payment Receipt Photo</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (config.isLive !== false) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden ${
                    dragOver 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : 'border-neutral-800 bg-neutral-950/50 hover:bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={config.isLive === false}
                    className="hidden"
                  />
                  {screenshotBase64 ? (
                    <div className="w-full h-full absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-2">
                      <img 
                        src={screenshotBase64} 
                        alt="Screenshot proof" 
                        referrerPolicy="no-referrer"
                        className="max-h-[100px] rounded border border-neutral-850 object-contain shadow-md mb-2"
                      />
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 leading-none select-none">
                        <Check size={12} /> Image Loaded. Click to change.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 p-2 select-none">
                      <Upload className="text-neutral-600 w-7 h-7 mx-auto pointer-events-none" />
                      <p className="text-xs font-bold text-neutral-400 leading-none">Drag & Drop payment proof</p>
                      <p className="text-[10px] text-neutral-500">or click to browse from device gallery</p>
                    </div>
                  )}
                </div>
              </div>

              {statusMsg.text && (
                <div id="payment-box-error" className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 border ${
                  statusMsg.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <Info size={14} className="flex-shrink-0" />
                  <span className="leading-normal">{statusMsg.text}</span>
                </div>
              )}

              {/* Submit button */}
              {config.isLive === false ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-neutral-600 text-xs font-black uppercase tracking-widest font-display flex items-center justify-center gap-2 cursor-not-allowed select-none hover:scale-100"
                >
                  🚫 Booking Pipeline Offline
                </button>
              ) : (
                <button
                  id="submit-payment-btn"
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-widest font-display shadow-md shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Submit Squad Purchase & UTR
                  <ArrowRight size={13} />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right: QR Code Visual Board */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center bg-neutral-950 p-6 rounded-3xl border border-neutral-850 relative min-h-[300px]">
          <div className="absolute top-0 right-0 p-3 flex gap-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 font-bold"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 font-bold"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 font-bold"></span>
          </div>

          {config.qrCodeAvailable !== false ? (
            <div className="text-center space-y-4 w-full animate-fade-in">
              <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure UPI QR Generator
              </div>

              <div className="bg-white p-3.5 rounded-2xl shadow-inner max-w-[200px] mx-auto border-2 border-amber-500/20">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI Deposit QR Code" 
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square object-contain mx-auto select-none rounded-lg"
                />
              </div>

              <div className="space-y-1 bg-neutral-900 border border-neutral-850 p-3.5 rounded-2xl text-center">
                <p className="text-[11px] text-neutral-450 leading-relaxed">
                  Scan with <strong className="text-neutral-300">GPay, PhonePe, Paytm or BHIM</strong> to pay exactly
                </p>
                <p className="text-base font-black text-white font-mono select-none">
                  ₹{totalInr} <span className="text-xs text-neutral-500 font-bold">INR</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 py-1 select-none">
                <ShieldCheck className="text-emerald-400 w-4 h-4" />
                <span className="text-[9px] font-bold text-neutral-550 uppercase tracking-widest leading-none">Afreed Glory Server Network Gateway</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5 w-full py-6 animate-fade-in">
              <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest select-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                QR Scanner Offline
              </div>

              <div className="w-24 h-24 bg-neutral-900 border border-neutral-850 rounded-3xl flex items-center justify-center mx-auto text-neutral-600 shadow-inner">
                <ShieldCheck size={36} className="text-neutral-650 strike-[1] animate-pulse" />
              </div>

              <div className="space-y-2 bg-neutral-900 border border-neutral-850 p-4 rounded-2xl text-center">
                <p className="text-[11px] text-neutral-200 leading-relaxed font-sans font-bold">
                  UPI QR Scanner is <span className="text-red-400">Not Available</span>
                </p>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Please copy the UPI VPA ID on the left and dispatch payments directly from your UPI App (GPay, PhonePe, Paytm).
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 py-1 select-none">
                <ShieldCheck className="text-red-500/55 w-4 h-4" />
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest leading-none">Manual Account Transfer Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
