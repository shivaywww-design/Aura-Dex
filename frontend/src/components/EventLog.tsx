import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import {
  History, ExternalLink, ArrowRightLeft, Droplets,
  Loader2, X, Hash, Layers, Clock, TrendingUp, Zap
} from "lucide-react";
import { CONFIG } from "../config";
import type { ContractEvent } from "../types";
import { cn } from "../lib/utils";

const TxDetailModal: React.FC<{ event: ContractEvent; onClose: () => void }> = ({ event, onClose }) => {
  const explorerUrl = `${CONFIG.STELLAR_EXPERT_BASE}/tx/${event.txHash}`;
  const formattedTime = event.timestamp instanceof Date
    ? event.timestamp.toLocaleTimeString()
    : "Unknown";

  const dataRows = [
    { icon: Hash, label: "Transaction Hash", value: `${event.txHash.slice(0, 12)}...${event.txHash.slice(-10)}`, full: event.txHash },
    { icon: Layers, label: "Network Ledger", value: String(event.ledger) },
    { icon: Clock, label: "Execution Time", value: formattedTime },
    { icon: TrendingUp, label: "Event Type", value: event.type.replace("_", " ").toUpperCase() },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm crystal rounded-[2.5rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-10 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl",
            event.type === "swap" ? "bg-primary/20 text-primary shadow-primary/20" : "bg-success/20 text-success shadow-success/20"
          )}>
            {event.type === "swap" ? <ArrowRightLeft className="w-8 h-8" /> : <Droplets className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase">{event.type.replace("_", " ")}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-black tracking-widest uppercase">Confirmed</span>
          </div>
        </div>

        <div className="space-y-4">
          {dataRows.map(({ icon: Icon, label, value, full }) => (
            <div key={label} className="group cursor-default">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Icon className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono font-bold text-slate-200">{value}</span>
                {full && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(full);
                      alert("Copied!");
                    }}
                    className="text-[9px] font-black text-primary hover:text-accent transition-all uppercase tracking-tighter opacity-0 group-hover:opacity-100"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          {event.data && typeof event.data === "object" && (
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-slate-500 mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Metadata</span>
              </div>
              <div className="bg-black/30 rounded-2xl p-4 font-mono text-[10px] text-slate-400 overflow-auto max-h-32 custom-scrollbar">
                {JSON.stringify(event.data, null, 2)}
              </div>
            </div>
          )}
        </div>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-aura mt-8 !py-3 w-full text-xs"
        >
          <ExternalLink className="w-4 h-4" />
          STELLAR EXPERT
        </a>
      </div>
    </div>
  );
};

export const EventLog: React.FC = () => {
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<ContractEvent | null>(null);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Live Activity</h2>
          </div>
          {events.length > 0 && (
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">{events.length} logs</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[350px]">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 py-20">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 animate-pulse" />
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 animate-spin" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Listening for Ledger Events</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEvent(event)}
                className="w-full flex items-center justify-between group bg-white/[0.02] hover:bg-white/[0.05] rounded-[1.5rem] p-3 border border-white/5 transition-all animate-in slide-in-from-right-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                    event.type === "swap" ? "bg-primary/10 text-primary shadow-primary/5" : "bg-success/10 text-success shadow-success/5"
                  )}>
                    {event.type === "swap"
                      ? <ArrowRightLeft className="w-5 h-5" />
                      : <Droplets className="w-5 h-5" />
                    }
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-white uppercase tracking-tighter">{event.type.replace("_", " ")}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">LGR: {event.ledger}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pr-2 group-hover:translate-x-1 transition-transform">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Receipt</span>
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedEvent && (
        <TxDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
};
