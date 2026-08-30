import React from 'react';
import { Transaction } from '../types';
import { Clock, ShieldAlert, CheckCircle2, Lock, Layers } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const processingTxns = transactions.filter(t => t.status === 'Processing');
  const creditedTxns = transactions.filter(t => t.status === 'Credited');

  const totalProcessingVal = processingTxns.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCreditedVal = creditedTxns.reduce((acc, curr) => acc + curr.amount, 0);

  const formatAmountCr = (val: number) => {
    const cr = val / 10000000;
    return `${cr.toFixed(2)} CR INR`;
  };

  const currentStatus = transactions[0]?.status || 'Processing';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Processing Value */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
          Processing Fund
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          ₹{formatAmountCr(totalProcessingVal > 0 ? totalProcessingVal : 839257841)}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>{processingTxns.length || 1} High-VALUE RaizerMT401 Processing</span>
        </div>
      </div>

      {/* Settled / Credited Value */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
          Settled Funds
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          ₹{formatAmountCr(totalCreditedVal)}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span>{creditedTxns.length} Settled to Receiver Account</span>
        </div>
      </div>

      {/* Active Safeguard Status Card */}
      <div className="bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Safeguard Protocol
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
          {currentStatus === 'Processing' ? 'Cooling Active' : currentStatus}
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
          National Clearance Verification in Effect
        </p>
      </div>

      {/* Account Balance Summary */}
      <div className="bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-300">
          <Layers className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Settlement Ledger
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          {transactions.length} Records
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
          Ref Date: 29/08/2026
        </p>
      </div>

    </div>
  );
};
