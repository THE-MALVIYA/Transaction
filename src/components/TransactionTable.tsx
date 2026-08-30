import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  FileText, Copy, Check, Clock, 
  ArrowDownRight, CheckCircle2, ShieldAlert, Lock, Unlock, AlertTriangle, Ban
} from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderStatusBadge = (txn: Transaction) => {
    switch (txn.status) {
      case 'Processing':
        return (
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Cooling Fund</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping ml-0.5"></span>
            </div>

            <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-xs">
              <div className="flex items-start gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-950 dark:text-amber-100">
                    Processing Fund
                  </span>
                  <p className="text-[10.5px] text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                    {txn.coolingPeriodNotice || 'Active Cooling Period Verification in Progress'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Credited':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Credit (Settled)</span>
            </div>
            <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono">
              Cleared & Credited to Beneficiary
            </p>
          </div>
        );

      case 'Freeze':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
              <Lock className="w-3.5 h-3.5 text-blue-500" />
              <span>Freeze</span>
            </div>
            <p className="text-[10.5px] text-blue-600 dark:text-blue-400 font-mono">
              Account & Fund Frozen
            </p>
          </div>
        );

      case 'Unfreeze':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Unlock className="w-3.5 h-3.5 text-teal-500" />
              <span>Unfreeze (Normal)</span>
            </div>
            <p className="text-[10.5px] text-teal-600 dark:text-teal-400 font-mono">
              Account Normal Operations Active
            </p>
          </div>
        );

      case 'CyberReport':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
              <span>Cyber Report</span>
            </div>
            <p className="text-[10.5px] text-purple-600 dark:text-purple-400 font-mono">
              Reported to Cyber Crime Cell (I4C)
            </p>
          </div>
        );

      case 'BankReport':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Bank Report</span>
            </div>
            <p className="text-[10.5px] text-rose-600 dark:text-rose-400 font-mono">
              Internal Bank Risk Flagged
            </p>
          </div>
        );

      case 'HoldManager':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Hold Manager</span>
            </div>
            <p className="text-[10.5px] text-orange-600 dark:text-orange-400 font-mono">
              Branch Manager Clearance Hold
            </p>
          </div>
        );

      case 'Chargeback':
        return (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30">
              <Ban className="w-3.5 h-3.5 text-red-500" />
              <span>Chargeback</span>
            </div>
            <p className="text-[10.5px] text-red-600 dark:text-red-400 font-mono">
              Disputed Reversal Claim
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Transaction Records Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No records matching the search query or status filter were found in the current settlement ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Table Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            Inter-Bank Settlement Records
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {transactions.length} Active Records
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click on any row to view and generate the official digitally verified RaizerMT401 Advice slip.
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          
          {/* Table Columns */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="px-6 py-3.5">UTR / Reference</th>
              <th className="px-6 py-3.5">Beneficiary / Receiver</th>
              <th className="px-6 py-3.5">Amount (INR)</th>
              <th className="px-6 py-3.5">Date & Time</th>
              <th className="px-6 py-3.5">Status & Safeguard</th>
              <th className="px-6 py-3.5 text-right">Advice Slip</th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => onSelectTransaction(txn)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                
                {/* UTR ID */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs tracking-tight">
                        {txn.utrId}
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, txn.utrId)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                        title="Copy UTR"
                      >
                        {copiedId === txn.utrId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                        {txn.transferType}
                      </span>
                      <span>•</span>
                      <span>Ref: {txn.id}</span>
                    </div>
                  </div>
                </td>

                {/* Beneficiary */}
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      {txn.receiverName}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                      {txn.receiverBank} (A/C: <span className="font-mono">{txn.receiverAccount}</span>)
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white text-sm block">
                      {txn.amountFormatted}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      ₹{txn.amount.toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  <div>{txn.date}</div>
                  <div className="text-slate-400 text-[10px]">{txn.time}</div>
                </td>

                {/* Status & Safeguard */}
                <td className="px-6 py-4">
                  {renderStatusBadge(txn)}
                </td>

                {/* Action View Advice */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTransaction(txn);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-700/50 transition-all shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Advice</span>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
