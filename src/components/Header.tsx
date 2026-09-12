import React from 'react';
import { Building2, ShieldCheck, Download, RefreshCw, Lock, Clock } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  senderName?: string;
  refDate?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onExport, 
  onRefresh, 
  isRefreshing,
  senderName = 'GIRIAS INVESTMENT PVT LTD',
  refDate = '10 SEP 2025'
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit Encrypted Corporate Portal
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">RaizerMT401 Clearance Portal</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-300">RaizerMT401 Settlement Active</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline font-mono">Ref Date: {refDate}</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">NATIONAL FINANCIAL GATEWAY</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  RaizerMT401 Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-200 font-bold">{senderName}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>Transaction History</span>
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5 sm:self-auto self-end">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Transaction Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 border border-blue-400/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
