import React, { useState } from "react";
import { ArrowDown, Info, Loader2, Droplets, ExternalLink, CheckCircle2, AlertTriangle, Zap, Coins } from "lucide-react";
import { useSwap } from "../hooks/useSwap";
import { useWallet } from "../hooks/useWallet";
import { cn } from "../lib/utils";
import { mintTestTokens, establishTrustline } from "../utils/faucet";

export const SwapCard: React.FC = () => {
  const { isConnected, connectWallet, publicKey, signTransaction } = useWallet();
  const {
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    balanceIn,
    balanceOut,
    quote,
    isQuoteLoading,
    txStatus,
    setAmountIn,
    switchTokens,
    executeSwap,
    fetchBalances
  } = useSwap();

  const [faucetLoading, setFaucetLoading] = useState(false);

  const onFaucet = async () => {
    if (!publicKey) return;
    setFaucetLoading(true);
    try {
      const { needsTrustline } = await mintTestTokens(publicKey, signTransaction);
      if (needsTrustline) {
        if (confirm("You need to establish a trustline for SDKE. Proceed?")) {
          await establishTrustline(publicKey, signTransaction);
          await mintTestTokens(publicKey, signTransaction);
        }
      }
      fetchBalances();
    } catch (e) {
      console.error(e);
      alert("Faucet failed. Make sure your account is funded with XLM.");
    } finally {
      setFaucetLoading(false);
    }
  };



  return (
    <div className="crystal rounded-[2.5rem] p-8 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exchange Assets</span>
          </div>
          <button 
            onClick={switchTokens}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:rotate-180 duration-500"
          >
            <Zap className="w-3.5 h-3.5 text-accent" />
          </button>
        </div>

        {/* Input Sections */}
        <div className="space-y-2">
          {/* FROM */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 transition-all focus-within:border-primary/30 group/input">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">You Pay</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500">Balance: <span className="text-slate-300">{balanceIn}</span></span>
                {isConnected && (
                  <button
                    onClick={onFaucet}
                    disabled={faucetLoading}
                    className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-accent transition-colors disabled:opacity-30 uppercase tracking-tighter"
                  >
                    {faucetLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Droplets className="w-2.5 h-2.5" />}
                    Faucet
                  </button>
                )}

              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                placeholder="0.00"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="bg-transparent text-3xl font-black text-white focus:outline-none w-full placeholder:text-slate-700"
              />
              <div className="flex items-center gap-2.5 bg-white/5 pl-2.5 pr-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                <div className="w-6 h-6 rounded-lg shadow-lg flex items-center justify-center font-black text-[10px] text-white" style={{ backgroundColor: tokenIn.color }}>
                  {tokenIn.symbol[0]}
                </div>
                <span className="font-black text-xs tracking-tight">{tokenIn.symbol}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center -my-6 relative z-20">
            <div className="w-10 h-10 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center shadow-2xl">
              <ArrowDown className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* TO */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">You Receive (Est)</span>
              <span className="text-[10px] font-bold text-slate-500">Balance: <span className="text-slate-300">{balanceOut}</span></span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountOut}
                  readOnly
                  className="bg-transparent text-3xl font-black text-white focus:outline-none w-full cursor-default placeholder:text-slate-700"
                />
                {isQuoteLoading && (
                  <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                )}
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 pl-2.5 pr-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                <div className="w-6 h-6 rounded-lg shadow-lg flex items-center justify-center font-black text-[10px] text-white" style={{ backgroundColor: tokenOut.color }}>
                  {tokenOut.symbol[0]}
                </div>
                <span className="font-black text-xs tracking-tight">{tokenOut.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Intelligence */}
        {quote && (
          <div className="bg-black/20 rounded-3xl p-5 space-y-3 border border-white/5">
            {[
              ["Execution Rate", parseFloat(quote.executionPrice) > 0 
                ? `1 ${tokenIn.symbol} = ${quote.executionPrice} ${tokenOut.symbol}`
                : "Empty Pool"],
              ["Price Impact", quote.priceImpactPercent, quote.isHighImpact],
              ["Liquidity Fee", `${quote.feePaid} ${tokenIn.symbol}`],
              ["Min. Received", `${quote.minimumReceived} ${tokenOut.symbol}`],
            ].map(([label, value, isWarning]) => (
              <div key={String(label)} className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
                  {label} {label === "Price Impact" && <Info className="w-3 h-3 opacity-50" />}
                </span>
                <span className={cn(
                  "font-mono", 
                  isWarning || (label === "Rate" && parseFloat(quote.executionPrice) === 0) ? "text-amber-400" : "text-slate-200"
                )}>
                  {String(value)}
                </span>
              </div>
            ))}
            {parseFloat(quote.executionPrice) === 0 && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[9px] text-amber-500 text-center font-black uppercase tracking-wider leading-relaxed">
                ⚠️ Empty Pool! Add liquidity in the pool tab first.
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={isConnected ? executeSwap : connectWallet}
          disabled={isConnected && (!amountIn || isQuoteLoading || txStatus.status === "pending" || !quote)}
          className="btn-aura w-full group/btn"
        >

          {txStatus.status === "pending" && <Loader2 className="w-5 h-5 animate-spin" />}
          <span className="tracking-widest">
            {!isConnected ? "CONNECT WALLET" : txStatus.status === "pending" ? txStatus.step.toUpperCase() : "EXECUTE SWAP"}
          </span>
        </button>
      </div>

      {/* ── Transaction Intelligence Overlay ── */}
      {txStatus.status !== "idle" && (
        <div className="absolute inset-0 crystal z-50 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
          
          <div className="relative z-10 w-full flex flex-col items-center">
            {txStatus.status === "pending" && (
              <>
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full border-[3px] border-primary/20" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2 text-white uppercase">{txStatus.step}</h3>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest animate-pulse">TRANSMITTING TO AURA NETWORK...</p>
                {txStatus.hash && (
                  <p className="mt-6 text-[10px] text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    TX: {txStatus.hash.slice(0, 8)}...{txStatus.hash.slice(-8)}
                  </p>
                )}
              </>
            )}

            {txStatus.status === "success" && (
              <>
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-8 border border-success/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-2 text-white">SWAP COMPLETE</h3>
                <p className="text-sm text-slate-400 font-medium max-w-[280px] leading-relaxed mb-10">
                  Your assets have been successfully exchanged. Wallet balances are reflecting the update.
                </p>
                
                <div className="flex flex-col w-full gap-3">
                  {txStatus.explorerUrl && (
                    <a
                      href={txStatus.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> View on Explorer
                    </a>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-aura !shadow-success/20 !bg-success/80 hover:!bg-success"
                  >
                    RETURN TO DASHBOARD
                  </button>
                </div>
              </>
            )}

            {txStatus.status === "fail" && (
              <>
                <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mb-8 border border-danger/30">
                  <AlertTriangle className="w-10 h-10 text-danger" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2 text-white">SWAP FAILED</h3>
                <div className="bg-black/40 p-4 rounded-2xl border border-danger/20 mb-10 w-full">
                  <p className="text-[10px] text-danger font-mono uppercase tracking-widest mb-1">Reason</p>
                  <p className="text-xs text-slate-300 font-medium">{txStatus.error?.message || "Contract simulation failed. Check slippage or balance."}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all"
                >
                  DISMISS & RETRY
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
