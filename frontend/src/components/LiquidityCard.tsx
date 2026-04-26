import React, { useState } from "react";
import { TOKENS } from "../config";
import { Plus, Loader2, CheckCircle2, Droplets, PieChart } from "lucide-react";
import { usePool } from "../hooks/usePool";
import { useWallet } from "../hooks/useWallet";
import { cn } from "../lib/utils";

export const LiquidityCard: React.FC = () => {
  const [tab, setTab] = useState<"add" | "remove">("add");
  const { isConnected, connectWallet } = useWallet();
  const {
    poolStats,
    myPosition,
    txStatus,
    addLiquidity,
    removeLiquidity,
    clearStatus,
  } = usePool();

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lpToRemove, setLpToRemove] = useState("");

  const handleAdd = async () => {
    if (!amountA || !amountB) return;
    await addLiquidity(amountA, amountB);
    setAmountA("");
    setAmountB("");
  };

  const handleRemove = async () => {
    if (!lpToRemove) return;
    await removeLiquidity(lpToRemove);
    setLpToRemove("");
  };


  return (
    <div className="crystal rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pool Management</span>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setTab("add")}
            className={cn(
              "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              tab === "add" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Add
          </button>
          <button
            onClick={() => setTab("remove")}
            className={cn(
              "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              tab === "remove" ? "bg-danger text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Remove
          </button>
        </div>
      </div>

      {tab === "add" ? (
        <div className="space-y-6">
          <div className="space-y-2">
            {/* Input A */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Deposit {TOKENS.TOKEN_A.symbol}</p>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  className="bg-transparent text-2xl font-black text-white focus:outline-none w-full"
                />
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TOKENS.TOKEN_A.color }} />
                  <span className="font-black text-xs">{TOKENS.TOKEN_A.symbol}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-6 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-[#020617] border border-white/5 flex items-center justify-center">
                <Plus className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Input B */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Deposit {TOKENS.TOKEN_B.symbol}</p>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  className="bg-transparent text-2xl font-black text-white focus:outline-none w-full"
                />
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TOKENS.TOKEN_B.color }} />
                  <span className="font-black text-xs">{TOKENS.TOKEN_B.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 space-y-4">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Predicted Share</span>
              <span className="text-primary font-black">
                {poolStats ? "0.01%" : "0.00%"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Current Rate</span>
              <span className="text-slate-300 font-mono">1 {TOKENS.TOKEN_A.symbol} = {poolStats?.priceAtoB} {TOKENS.TOKEN_B.symbol}</span>
            </div>
          </div>

          <button
            onClick={isConnected ? handleAdd : connectWallet}
            disabled={isConnected && (!amountA || !amountB || txStatus.status === "pending")}
            className="btn-aura w-full"
          >
            {txStatus.status === "pending" && <Loader2 className="w-5 h-5 animate-spin" />}
            <span className="tracking-widest">
              {!isConnected ? "CONNECT WALLET" : txStatus.status === "pending" ? "PROCESSING..." : "PROVIDE LIQUIDITY"}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Withdraw LP Assets</p>
              <span className="text-[10px] font-bold text-slate-500">Available: {myPosition?.lpBalance || "0.00"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                placeholder="0.00"
                value={lpToRemove}
                onChange={(e) => setLpToRemove(e.target.value)}
                className="bg-transparent text-2xl font-black text-white focus:outline-none w-full"
              />
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TOKENS.LP.color }} />
                <span className="font-black text-xs">LP TOKENS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="crystal p-4 rounded-2xl bg-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Claim {TOKENS.TOKEN_A.symbol}</p>
              <p className="text-lg font-black text-white">0.00</p>
            </div>
            <div className="crystal p-4 rounded-2xl bg-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Claim {TOKENS.TOKEN_B.symbol}</p>
              <p className="text-lg font-black text-white">0.00</p>
            </div>
          </div>

          <button
            onClick={isConnected ? handleRemove : connectWallet}
            disabled={isConnected && (!lpToRemove || txStatus.status === "pending")}
            className="w-full py-4 rounded-[2rem] bg-danger/10 text-danger border border-danger/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-danger/20"
          >
            {txStatus.status === "pending" && <Loader2 className="w-5 h-5 animate-spin" />}
            {!isConnected ? "CONNECT WALLET" : "BURN LP ASSETS"}
          </button>
        </div>
      )}

      {/* Stats Divider */}
      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-4 h-4 text-slate-500" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Details</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Total Reserves</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{TOKENS.TOKEN_A.symbol}</span>
                <span className="text-white font-bold">{poolStats?.reserveA || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{TOKENS.TOKEN_B.symbol}</span>
                <span className="text-white font-bold">{poolStats?.reserveB || "0.00"}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Your Inventory</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Share</span>
                <span className="text-primary font-bold">{myPosition?.poolShare || "0.00%"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">LP Tokens</span>
                <span className="text-white font-bold">{myPosition?.lpBalance || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Fail Overlays */}
      {txStatus.status === "success" && (
        <div className="absolute inset-0 crystal z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
           <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/30">
              <CheckCircle2 className="w-8 h-8 text-success" />
           </div>
           <p className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Inventory Updated</p>
           <p className="text-xs text-slate-400 font-medium mb-8">Pool positions successfully adjusted.</p>
           <button onClick={() => window.location.reload()} className="btn-aura !py-3 !px-8 text-xs !shadow-success/20">CONTINUE</button>
        </div>
      )}

      {txStatus.status === "fail" && (
        <div className="mt-8 p-5 bg-danger/5 border border-danger/20 rounded-[2rem] text-center">
          <p className="text-[10px] font-black text-danger uppercase tracking-[0.2em] mb-2">Transaction Refused</p>
          <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">{txStatus.error?.message || "Unknown execution error."}</p>
          <button 
            onClick={clearStatus}
            className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            DISMISS & RETRY
          </button>
        </div>
      )}
    </div>
  );
};
