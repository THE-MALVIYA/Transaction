import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, ArrowRight, Lock, 
  Search, CheckCircle2, AlertCircle, Landmark
} from 'lucide-react';

interface PortalGatewayProps {
  onVerifyUTR: (utr: string) => void;
  defaultUtr?: string;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({ onVerifyUTR, defaultUtr = 'UTR2026082940952544' }) => {
  const [inputUtr, setInputUtr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = inputUtr.trim();
    if (!cleanUtr) {
      setErrorMsg('Please enter a valid Transaction Reference or UTR Number.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onVerifyUTR(cleanUtr);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Top Corporate Nav */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              NATIONAL FINANCIAL GATEWAY
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OFFICIAL
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Inter-Bank Settlement & Clearance System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-slate-300">RaizerMT401 Protocol</span>
        </div>
      </nav>

      {/* Main Search Container */}
      <main className="max-w-3xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 animate-pulse">
          <Landmark className="w-3.5 h-3.5" />
          <span>Central Real-Time Gross Settlement & RaizerMT401 Gateway</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Verify Transaction & Account Statement
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl">
          Enter your 16-character UTR (Unique Transaction Reference) or Clearance Reference ID to access verified transaction records, advice slips, and clearance status.
        </p>

        {/* Search Card */}
        <div className="w-full mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="utr-input" className="block text-left text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter UTR / Reference ID
              </label>
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  id="utr-input"
                  type="text"
                  value={inputUtr}
                  onChange={(e) => {
                    setInputUtr(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="ENTER UTR"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base tracking-wider placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-400 text-left bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Central Gateway Ledger...</span>
                </>
              ) : (
                <>
                  <span>Verify & Access Transaction Record</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full text-left text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">RBI Gateway Protocol</p>
              <p className="text-slate-400 mt-0.5 text-[11px]">Real-time inter-bank RTGS & RaizerMT401 settlement engine.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Tamper-Proof Audit</p>
              <p className="text-slate-400 mt-0.5 text-[11px]">End-to-end cryptographic hash verification on all slips.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Live Status Tracking</p>
              <p className="text-slate-400 mt-0.5 text-[11px]">Direct sync with clearing houses and beneficiary branches.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <p>© 2026 National Financial Gateway | All Rights Reserved | 256-Bit SSL Certified Corporate Clearance System</p>
      </footer>
    </div>
  );
};
