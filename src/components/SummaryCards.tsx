import React from 'react';
import { Transaction } from '../types';
import { Clock, ShieldAlert, CheckCircle2, Lock, Layers, AlertTriangle, Unlock, Ban } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const currentTxn = transactions[0];
  const currentStatus = currentTxn?.status || 'CyberReport';

  const formatAmountCr = (val: number) => {
    const cr = val / 10000000;
    return `${cr.toFixed(2)} CR INR`;
  };

  const getStatusDisplay = () => {
    switch (currentStatus) {
      case 'CyberReport':
        return {
          title: 'Cyber Crime Flag',
          badge: 'I4C Reported',
          color: 'from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30 text-purple-400',
          icon: <ShieldAlert className="w-5 h-5 text-purple-400" />
        };
      case 'Freeze':
        return {
          title: 'Account Frozen',
          badge: 'Regulatory Freeze',
          color: 'from-blue-500/15 via-blue-500/5 to-transparent border-blue-500/30 text-blue-400',
          icon: <Lock className="w-5 h-5 text-blue-400" />
        };
      case 'BankReport':
        return {
          title: 'Bank Risk Report',
          badge: 'Vigilance Audit',
          color: 'from-rose-500/15 via-rose-500/5 to-transparent border-rose-500/30 text-rose-400',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />
        };
      case 'Credited':
        return {
          title: 'Settled Funds',
          badge: 'Account Credited',
          color: 'from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        };
      case 'Chargeback':
        return {
          title: 'Chargeback Dispute',
          badge: 'Disputed Claim',
          color: 'from-red-500/15 via-red-500/5 to-transparent border-red-500/30 text-red-400',
          icon: <Ban className="w-5 h-5 text-red-400" />
        };
      case 'HoldManager':
        return {
          title: 'Branch Hold',
          badge: 'Manager Authorization',
          color: 'from-orange-500/15 via-orange-500/5 to-transparent border-orange-500/30 text-orange-400',
          icon: <Clock className="w-5 h-5 text-orange-400" />
        };
      case 'Unfreeze':
        return {
          title: 'Unfrozen Active',
          badge: 'Operations Resumed',
          color: 'from-teal-500/15 via-teal-500/5 to-transparent border-teal-500/30 text-teal-400',
          icon: <Unlock className="w-5 h-5 text-teal-400" />
        };
      case 'Processing':
      default:
        return {
          title: 'Processing Fund',
          badge: 'Cooling Period Active',
          color: 'from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30 text-amber-400',
          icon: <Clock className="w-5 h-5 text-amber-400 animate-spin" />
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Dynamic Status Card */}
      <div className={`bg-gradient-to-br ${statusInfo.color} border rounded-xl p-4 shadow-sm relative overflow-hidden`}>
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-black/20">
          {statusInfo.icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-90">
          Primary Status
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          {statusInfo.title}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
          <span>{statusInfo.badge}</span>
        </div>
      </div>

      {/* Transaction Amount Card */}
      <div className="bg-gradient-to-br from-slate-900/5 dark:from-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Layers className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Target Settlement
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          ₹{currentTxn?.amountFormatted || '125.00 CR INR'}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Beneficiary: {currentTxn?.receiverName || 'D CACUS FOUNDATION'}</span>
        </div>
      </div>

      {/* Clearance Stage */}
      <div className="bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Clearance Level
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
          {currentTxn?.stage || 'Stage 4 of 4: Account Credited & Settled'}
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium font-mono text-[11px]">
          Ref No: {currentTxn?.refNo || '38630430'}
        </p>
      </div>

      {/* Account Balance Summary */}
      <div className="bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-300">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Timestamp Audit
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
          {currentTxn?.date || '10 SEP 2026'} {currentTxn?.time ? currentTxn.time.slice(0, 5) : '15:10'}
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
          Protocol: RaizerMT401
        </p>
      </div>

    </div>
  );
};
