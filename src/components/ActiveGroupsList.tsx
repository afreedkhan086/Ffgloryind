import React, { useState } from 'react';
import { ActiveGroup } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Play, 
  Square, 
  RotateCw, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Coins, 
  Terminal, 
  Activity, 
  Users, 
  User, 
  Trophy 
} from 'lucide-react';

interface ActiveGroupsListProps {
  groups: ActiveGroup[];
  onControl: (groupId: string, action: 'start' | 'stop' | 'restart' | 'delete' | 'refund') => void;
  liveTime: string;
}

export default function ActiveGroupsList({ groups, onControl, liveTime }: ActiveGroupsListProps) {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGroupId(prev => (prev === id ? null : id));
  };

  if (groups.length === 0) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-10 text-center text-neutral-400">
        <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-4 border border-neutral-700/50">
          <Activity className="text-neutral-500 w-5 h-5 pointer-events-none" />
        </div>
        <h4 className="text-sm font-semibold text-neutral-350">No Bot Groups Online</h4>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          You haven't launched any farming bots yet. Tap the <strong className="text-emerald-400">Launch New Group</strong> button above to start.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isRunning = group.status === 'running';
        const isPaused = group.status === 'paused';
        const isExpanded = expandedGroupId === group.id;
        const progressPercentage = Math.min(100, Math.floor((group.totalGlory / group.targetGlory) * 100));

        return (
          <div
            key={group.id}
            id={`group-card-${group.id}`}
            className="bg-neutral-900 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-xl transition-all hover:border-neutral-700/50"
          >
            {/* Top Header Row of active group */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-850 bg-neutral-950/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                  <Star className="text-amber-400 fill-amber-400 w-4 h-4 pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-200 font-mono tracking-tight">{group.clanId}</span>
                    <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-mono">
                      LV.7 Guild
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-semibold text-neutral-400">{group.clanName}</span>
                    <span className="text-xs text-neutral-600 font-bold">&bull;</span>
                    <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      <User size={11} /> {group.captainName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members/Captain/Glory Status metrics row */}
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Users size={11} /> Members
                  </p>
                  <p className="text-xs font-bold text-neutral-300 font-mono">{group.membersCount}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Trophy size={11} /> Total Glory
                  </p>
                  <p className="text-xs font-semibold font-mono text-amber-400 flex items-center gap-1 justify-end">
                    {group.totalGlory} / {group.targetGlory}
                  </p>
                </div>
              </div>
            </div>

            {/* Inner Sub-box detailing Bot Session Info */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID & Running badge */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-neutral-950 border border-neutral-850 rounded-xl text-xs font-mono text-neutral-400">
                    ID: <strong className="text-neutral-200">{group.id}</strong>
                  </div>
                  {isRunning ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Running
                    </span>
                  ) : isPaused ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Paused
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-neutral-850 text-neutral-500 border border-neutral-800 uppercase font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                      Stopped
                    </span>
                  )}
                </div>

                {/* Region details tag + bot thread count info */}
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <span className="text-xs font-semibold bg-neutral-950 px-3 py-1 rounded-xl text-neutral-300 border border-neutral-850 font-mono">
                     {group.region} Region
                  </span>
                  <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-xl border border-blue-500/15 font-mono">
                     {group.botsLaunched} Bots Enabled
                  </span>
                  <span className="text-xs font-semibold bg-purple-500/15 text-purple-400 px-3 py-1 rounded-xl border border-purple-500/15 font-mono">
                    {group.type} Line
                  </span>
                </div>
              </div>

              {/* Progress metrics bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono select-none">
                  <span>Glory Progress Goal</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-850 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                    Uptime: <strong className="text-neutral-300 font-semibold">{Math.floor(group.uptimeMinutes / 60)}h {group.uptimeMinutes % 60}m</strong>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Timer: {liveTime}
                  </span>
                </div>
              </div>

              {/* Action Buttons: matches "Restart", "Stop"/"Restart", "Details", "Delete", "Refund Credit" */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-850">
                {/* Restart */}
                <button
                  id={`restart-btn-${group.id}`}
                  onClick={() => onControl(group.id, 'restart')}
                  className="flex-1 min-w-[90px] bg-neutral-800 text-neutral-200 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-neutral-750 transition-all flex items-center justify-center gap-1.5 border border-neutral-750"
                >
                  <RotateCw size={13} className="animate-spin-slow pointer-events-none" />
                  Restart
                </button>

                {/* Toggle Play/Stop */}
                {isRunning ? (
                  <button
                    id={`stop-btn-${group.id}`}
                    onClick={() => onControl(group.id, 'stop')}
                    className="flex-1 min-w-[90px] bg-red-950/30 text-red-400 hover:text-red-300 px-3 py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-red-950/50 transition-all flex items-center justify-center gap-1.5 border border-red-900/30"
                  >
                    <Square size={13} className="pointer-events-none" />
                    Stop
                  </button>
                ) : (
                  <button
                    id={`start-btn-${group.id}`}
                    onClick={() => onControl(group.id, 'start')}
                    className="flex-1 min-w-[90px] bg-emerald-950/30 text-emerald-400 hover:text-emerald-300 px-3 py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-emerald-950/50 transition-all flex items-center justify-center gap-1.5 border border-emerald-900/30"
                  >
                    <Play size={13} className="pointer-events-none" />
                    Start
                  </button>
                )}

                {/* Details toggle */}
                <button
                  id={`details-btn-${group.id}`}
                  onClick={() => toggleExpand(group.id)}
                  className={`flex-1 min-w-[90px] px-3 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border ${
                    isExpanded 
                      ? 'bg-neutral-150 text-neutral-900 border-neutral-100' 
                      : 'bg-neutral-800 text-neutral-450 hover:text-white hover:bg-neutral-750 border-neutral-750'
                  }`}
                >
                  <Terminal size={13} className="pointer-events-none" />
                  Logs
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {/* Refund Credit */}
                <button
                  id={`refund-btn-${group.id}`}
                  onClick={() => onControl(group.id, 'refund')}
                  className="flex-1 min-w-[110px] bg-amber-500/10 text-amber-400 hover:text-amber-300 hover:bg-amber-500/15 px-3 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border border-amber-500/20"
                >
                  <Coins size={13} className="pointer-events-none" />
                  Refund
                </button>

                {/* Delete */}
                <button
                  id={`delete-btn-${group.id}`}
                  onClick={() => onControl(group.id, 'delete')}
                  className="bg-neutral-800 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition-all border border-neutral-750 hover:border-red-500/20"
                  title="Remove Bot"
                >
                  <Trash2 size={13} className="pointer-events-none" />
                </button>
              </div>
            </div>

            {/* Scrolling simulation log terminals window */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-neutral-850 overflow-hidden bg-neutral-950"
                >
                  <div className="p-4 font-mono text-[11px] text-neutral-400 space-y-2 max-h-48 overflow-y-auto">
                    <div className="text-emerald-500 flex items-center gap-2 select-none border-b border-neutral-850 pb-1.5 mb-2 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      LIVE BOT CONSOLE SESSIONS
                    </div>
                    {group.logs.map((log, index) => (
                      <div key={index} className="leading-relaxed whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                    {isRunning && (
                      <div className="text-neutral-500 text-[10px] animate-pulse flex items-center gap-1 select-none italic pt-1">
                        Watching matchmaking lobby IND-LOBBY-04... Listening for state logs...
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
