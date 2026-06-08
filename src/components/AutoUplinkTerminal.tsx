import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, ShieldCheck } from 'lucide-react';
import { SystemConfig, PaymentRequest } from '../types';

interface AutoUplinkTerminalProps {
  payment: PaymentRequest;
  config: SystemConfig;
}

export default function AutoUplinkTerminal({ payment, config }: AutoUplinkTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [gloryCount, setGloryCount] = useState(40 + Math.floor(Math.random() * 80));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Generate streaming logs mimicking real-time pilot automation with ffglory.pro
    const baseLogs = [
      `[UPLINK] Initiating autopilot socket connection to ffglory.pro server...`,
      `[HANDSHAKE] Handshake acknowledged. Server: ${config.ffGloryRegion || 'India'} (BASIC PLAN)`,
      `[AUTH] Authenticating admin credentials: username: "${(config.ffGloryUsername || 'afreedkhan1299').slice(0, 4)}***" password: "🔑 Secured"`,
      `[SEC-PASS] Decrypting administrative security PIN... Success.`,
      `[TARGET] Lock-on initiated. Target Free Fire UID identified: [ ${payment.userUID} ]`,
      `[SQUAD DETECT] Scanning Garena server lobby profiles... Found 4 active client queues.`,
      `[LAUNCH] Deploying ${payment.creditsQuantity} active auto-win bot squads to customer lobby...`,
      `[LOG] Lobby instance #FF-001 connected. Lobby bypass layer synchronized.`,
      `[LOG] Squad members verified: Bot #01, Bot #02, Bot #03, Bot #04 aligned.`,
      `[CONNECTING] Launching team match loop [CS-MODE]...`,
      `[SIMULATION_LOOP] Win-streak sequence activated. Anti-cheat bypass: 100% stable.`,
    ];

    let currentLogIndex = 0;
    setLogs([baseLogs[0]]);
    
    const interval = setInterval(() => {
      if (currentLogIndex < baseLogs.length - 1) {
        currentLogIndex++;
        setLogs(prev => [...prev, baseLogs[currentLogIndex]]);
        setProgress(Math.floor((currentLogIndex / baseLogs.length) * 40));
      } else {
        // Post deployment loop
        setProgress(60);
        // Periodic simulation logs
        const loopLogs = [
          `[GAME] Match completed successfully in 12s! Glory added: +12`,
          `[SYNC] Garena cloud synchronizer verified. Lobby UID synced.`,
          `[GAME] Match loop CS #2 complete! Glory added: +12`,
          `[PROXY] Rotating cloud proxies. IP pool updated. Latency: 38ms.`,
          `[GAME] Match loop CS #3 complete! Glory added: +12`,
        ];
        const randomLog = loopLogs[Math.floor(Math.random() * loopLogs.length)];
        setLogs(prev => [...prev, randomLog].slice(-8)); // keep last 8 lines
        setGloryCount(prev => Math.min(1800, prev + 12 + Math.floor(Math.random() * 8)));
        setProgress(prev => Math.min(100, prev + 5));
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [payment.userUID, payment.creditsQuantity, config.ffGloryRegion, config.ffGloryUsername]);

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-4 animate-fade-in text-[11px] font-mono shadow-inner">
      {/* Header border section */}
      <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
            <Cpu size={12} className="text-emerald-400 animate-pulse" /> ffglory.pro Live Uplink Active
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-[9px] text-neutral-500 uppercase font-bold">
          <span>Server: <strong className="text-neutral-300">{config.ffGloryRegion || 'India'}</strong></span>
          <span>&bull;</span>
          <span>Speed: <strong className="text-emerald-400">Instant Squad</strong></span>
        </div>
      </div>

      {/* Terminal log console screen element */}
      <div className="p-4 bg-neutral-950 text-neutral-300 space-y-1.5 h-36 overflow-y-auto no-scrollbar scroll-smooth leading-normal border-b border-neutral-850">
        {logs.map((log, index) => {
          let styleClass = "text-neutral-400";
          if (log.includes("[UPLINK]") || log.includes("[HANDSHAKE]")) styleClass = "text-cyan-400 font-bold";
          else if (log.includes("[AUTH]") || log.includes("[SEC-PASS]")) styleClass = "text-amber-400 font-semibold";
          else if (log.includes("[TARGET]")) styleClass = "text-yellow-300 font-black";
          else if (log.includes("[LAUNCH]")) styleClass = "text-purple-400 font-extrabold";
          else if (log.includes("[GAME]")) styleClass = "text-emerald-400";
          
          return (
            <div key={index} className={`flex items-start gap-1 ${styleClass}`}>
              <span className="text-neutral-600 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          );
        })}
      </div>

      {/* Real-time automated result and control tracker display */}
      <div className="p-4 bg-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Progress tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-neutral-450 uppercase">
            <span>Automation Pilot Progress</span>
            <span className="text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-850">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-amber-500/20"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live bots counts */}
        <div className="flex items-center gap-3 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-850">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <Terminal size={14} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-black tracking-wider leading-none">Deployed Bots</span>
            <span className="text-xs text-white font-extrabold leading-tight">
              {payment.creditsQuantity * 4} Emulator Slots ({payment.creditsQuantity} Squads)
            </span>
          </div>
        </div>

        {/* Glory score simulator metrics */}
        <div className="flex items-center gap-3 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-850">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <ShieldCheck size={14} />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-black tracking-wider leading-none font-sans">Accumulated Glory</span>
            <span className="text-xs text-emerald-400 font-extrabold leading-tight">
              +{gloryCount} Glory / 1800 Target
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
