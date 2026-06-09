import React, { useState } from 'react';
import { REGIONS_LIST } from '../utils/mockData';
import { AppUser } from '../types';
import { X, Shield, Info, AlertTriangle } from 'lucide-react';

interface LaunchGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser;
  onLaunch: (clanId: string, regionName: string, regionType: string, botsCount: number) => void;
}

export default function LaunchGroupModal({ isOpen, onClose, user, onLaunch }: LaunchGroupModalProps) {
  const [selectedRegionId, setSelectedRegionId] = useState('india-basic');
  const [clanId, setClanId] = useState('');
  const [botsCount, setBotsCount] = useState(4);
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const selectedRegion = REGIONS_LIST.find(r => r.id === selectedRegionId) || REGIONS_LIST[0];
  const cost = 1; // Always costing 1 credit as per screenshots
  const creditTypeNeeded = selectedRegion.type;
  const currentCreditBalance = creditTypeNeeded === 'Premium' ? user.premiumCredits : user.basicCredits;
  const isBalanceSufficient = currentCreditBalance >= cost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!clanId.trim()) {
      setErrorText('Please enter your Clan ID or UID!');
      return;
    }

    if (!/^\d{5,12}$/.test(clanId.trim())) {
      setErrorText('Invalid ID. Must be 5 to 12 digits (e.g., 3046378316).');
      return;
    }

    if (!isBalanceSufficient) {
      setErrorText(`Insufficient ${creditTypeNeeded} Credits! You need ${cost} credit, but have ${currentCreditBalance}.`);
      return;
    }

    onLaunch(clanId, selectedRegion.name, selectedRegion.type, botsCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        id="launch-modal-container"
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Shield className="text-emerald-400 w-5 h-5 pointer-events-none" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Launch Glory Farming Bot</h3>
              <p className="text-xs text-neutral-400">Push automatic glory instantly to your guild dashboard</p>
            </div>
          </div>
          <button 
            id="close-modal-btn"
            onClick={onClose} 
            className="text-neutral-500 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 p-2 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Region Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Accounts Region</label>
            <div className="relative">
              <select
                id="region-select"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3.5 text-sm text-neutral-100 outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
              >
                {REGIONS_LIST.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.flag} {reg.name} ({reg.type === 'Premium' ? '⭐ Premium' : '🔵 Basic'})
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                ▼
              </div>
            </div>
          </div>

          {/* Clan ID / UID */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">ENTER YOUR GUILD UID</label>
              <span className="text-[10px] text-neutral-500 font-mono">Example: 3046378316</span>
            </div>
            <input
              id="clan-id-input"
              type="text"
              value={clanId}
              onChange={(e) => setClanId(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 123456789"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-neutral-100 outline-none focus:border-emerald-500/50 font-mono transition-all placeholder:text-neutral-700"
            />
          </div>

          {/* Bot Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Bots Thread count</label>
              <span className="text-xs text-yellow-400 font-semibold">{botsCount} Client BOTs</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  id={`bot-count-${num}`}
                  type="button"
                  onClick={() => setBotsCount(num)}
                  className={`py-3.5 rounded-2xl text-xs font-bold font-mono border transition-all ${
                    botsCount === num
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                  }`}
                >
                  {num} BOT
                </button>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 leading-normal">
              Increasing the bot thread count will inject glory exponentially faster but requires stable region lines. Default: 4 bots.
            </p>
          </div>

          {/* Cost breakdown alert */}
          <div className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 flex items-start gap-3">
            <Info className="text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-200">Execution Cost:</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                  {cost} {creditTypeNeeded} Credit
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                Your Balance: <strong className="text-white">{currentCreditBalance} Credits</strong>. 
                {creditTypeNeeded === 'Premium' 
                  ? ' Perfect for high-speed server lines.' 
                  : ' Normal cost tier with 1 hour uptime cycles.'}
              </p>
            </div>
          </div>

          {/* Error text if any */}
          {errorText && (
            <div id="modal-error-notif" className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-xs text-red-400">
              <AlertTriangle size={15} />
              <span>{errorText}</span>
            </div>
          )}

          {/* Submit action */}
          <button
            id="launch-submit-btn"
            type="submit"
            className={`w-full py-4 rounded-2xl font-bold font-display tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
              isBalanceSufficient
                ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/10'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
            }`}
          >
            {isBalanceSufficient 
              ? `LAUNCH GLORY BOT VIA ${creditTypeNeeded.toUpperCase()}` 
              : `INSUFFICIENT ${creditTypeNeeded.toUpperCase()} CREDITS (NEED ${cost})`}
          </button>
        </form>
      </div>
    </div>
  );
}
