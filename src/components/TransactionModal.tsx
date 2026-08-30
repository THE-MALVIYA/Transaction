import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  X, Copy, Check, Printer, ShieldCheck, Clock, Building2, 
  AlertTriangle, ArrowRight, Download, CheckCircle, FileText, 
  Trash2, Lock, Unlock, ShieldAlert, Ban, AlertCircle 
} from 'lucide-react';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for status banner rendering
  const renderStatusBanner = () => {
    switch (transaction.status) {
      case 'Processing':
        return (
          <div className="p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    COOLING PERIOD PROTOCOL ACTIVE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 tracking-wider">
                    PROCESSING FUND
                  </span>
                </div>
                <p className="text-sm font-semibold text-amber-950 dark:text-amber-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Processing Fund - Active Cooling Period Verification in Progress'}
                </p>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 font-mono pt-1">
                  Status: PROCESSING FUND. Active verification in progress for receiver account ({transaction.receiverName}).
                </p>
              </div>
            </div>
          </div>
        );

      case 'Credited':
        return (
          <div className="p-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    SETTLEMENT PROTOCOL COMPLETE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40 tracking-wider">
                    CREDITED / SETTLED
                  </span>
                </div>
                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Payment Settlement Complete - Funds Successfully Credited'}
                </p>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 font-mono pt-1">
                  Beneficiary account ({transaction.receiverName}) has successfully cleared and received all funds.
                </p>
              </div>
            </div>
          </div>
        );

      case 'Freeze':
        return (
          <div className="p-4 rounded-xl bg-blue-500/15 border-2 border-blue-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    REGULATORY HOLD ORDER
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-800 dark:text-blue-200 border border-blue-500/40 tracking-wider">
                    ACCOUNT & FUND FROZEN
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-950 dark:text-blue-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Account & Transaction Frozen under Central Regulatory Compliance Orders'}
                </p>
                <p className="text-xs text-blue-800/90 dark:text-blue-300/90 font-mono pt-1">
                  Disbursement stopped. Account operations held pending statutory authority clearance.
                </p>
              </div>
            </div>
          </div>
        );

      case 'Unfreeze':
        return (
          <div className="p-4 rounded-xl bg-teal-500/15 border-2 border-teal-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <Unlock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    FREEZE REVOCATION COMPLETE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/20 text-teal-800 dark:text-teal-200 border border-teal-500/40 tracking-wider">
                    UNFREEZE / ACTIVE
                  </span>
                </div>
                <p className="text-sm font-semibold text-teal-950 dark:text-teal-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Account Freeze Revoked - Regular Banking Operations Resumed'}
                </p>
                <p className="text-xs text-teal-800/90 dark:text-teal-300/90 font-mono pt-1">
                  Account status restored to Normal Active clearance.
                </p>
              </div>
            </div>
          </div>
        );

      case 'CyberReport':
        return (
          <div className="p-4 rounded-xl bg-purple-500/15 border-2 border-purple-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    SECURITY ALERT
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-800 dark:text-purple-200 border border-purple-500/40 tracking-wider">
                    CYBER CRIME CELL REPORTED
                  </span>
                </div>
                <p className="text-sm font-semibold text-purple-950 dark:text-purple-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Alert: Transaction Flagged & Reported to Cyber Crime Coordination Centre (I4C)'}
                </p>
                <p className="text-xs text-purple-800/90 dark:text-purple-300/90 font-mono pt-1">
                  Transaction placed under cyber security vigilance tracking.
                </p>
              </div>
            </div>
          </div>
        );

      case 'BankReport':
        return (
          <div className="p-4 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    VIGILANCE AUDIT FLAG
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-500/40 tracking-wider">
                    INTERNAL BANK REPORT
                  </span>
                </div>
                <p className="text-sm font-semibold text-rose-950 dark:text-rose-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Internal Banking Report: High-Risk Settlement Review under PMLA & RBI Guidelines'}
                </p>
                <p className="text-xs text-rose-800/90 dark:text-rose-300/90 font-mono pt-1">
                  Compliance and risk management audit review in progress.
                </p>
              </div>
            </div>
          </div>
        );

      case 'HoldManager':
        return (
          <div className="p-4 rounded-xl bg-orange-500/15 border-2 border-orange-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                    MANAGEMENT HOLD
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500/20 text-orange-800 dark:text-orange-200 border border-orange-500/40 tracking-wider">
                    HOLD BY MANAGER
                  </span>
                </div>
                <p className="text-sm font-semibold text-orange-950 dark:text-orange-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Temporary Administrative Hold Imposed by Branch / Regional Clearing Manager'}
                </p>
                <p className="text-xs text-orange-800/90 dark:text-orange-300/90 font-mono pt-1">
                  Settlement pending manual physical sign-off from Branch / Regional Manager.
                </p>
              </div>
            </div>
          </div>
        );

      case 'Chargeback':
        return (
          <div className="p-4 rounded-xl bg-red-500/15 border-2 border-red-500/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                <Ban className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
                    DISPUTE REVERSAL
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-800 dark:text-red-200 border border-red-500/40 tracking-wider">
                    CHARGEBACK INITIATED
                  </span>
                </div>
                <p className="text-sm font-semibold text-red-950 dark:text-red-100 leading-normal">
                  {transaction.coolingPeriodNotice || 'Chargeback Raised: Settlement Reversal and Inter-Bank Dispute Claim Initiated'}
                </p>
                <p className="text-xs text-red-800/90 dark:text-red-300/90 font-mono pt-1">
                  Disputed transaction under inter-bank arbitration protocol.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Card Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative print:shadow-none print:border-none print:max-w-none print:w-full">
        
        {/* Top Decorative Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-3 z-10">
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Official Payment Advice / RaizerMT401 Slip
              </span>
              <h3 className="text-xl font-bold text-white mt-1">NATIONAL FINANCIAL GATEWAY</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Ref No: {transaction.id} | Date: {transaction.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all print:hidden z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* UTR & Amount Banner */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                UTR Number (Unique Transaction Reference)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                  {transaction.utrId}
                </span>
                <button
                  onClick={() => handleCopy(transaction.utrId)}
                  className="p-1.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all print:hidden"
                  title="Copy UTR ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                Transaction Amount
              </p>
              <p className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                {transaction.amountFormatted}
              </p>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                ₹{transaction.amount.toLocaleString('en-IN')}.00
              </p>
            </div>
          </div>

          {/* DYNAMIC STATUS BANNER */}
          {renderStatusBanner()}

          {/* Full Transaction Details Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            
            <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Beneficiary / Receiver Name</span>
              <span className="col-span-2 font-extrabold text-slate-900 dark:text-white text-sm">
                {transaction.receiverName}
              </span>
            </div>

            <div className="grid grid-cols-3 p-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Receiver Bank & Branch</span>
              <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                {transaction.receiverBank} (IFSC: <span className="font-mono">{transaction.receiverIfsc}</span>)
              </span>
            </div>

            <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Receiver Account No</span>
              <span className="col-span-2 font-mono font-bold text-slate-900 dark:text-white">
                {transaction.receiverAccount}
              </span>
            </div>

            <div className="grid grid-cols-3 p-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Amount in Words</span>
              <span className="col-span-2 font-medium italic text-slate-700 dark:text-slate-300">
                {transaction.amountInWords || `${transaction.amountFormatted} Only`}
              </span>
            </div>

            <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction Date & Time</span>
              <span className="col-span-2 font-mono font-medium text-slate-900 dark:text-white">
                {transaction.date} at {transaction.time}
              </span>
            </div>

            <div className="grid grid-cols-3 p-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Remitter Account (Sender)</span>
              <div className="col-span-2 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {transaction.senderName}
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300 block">
                  A/C: {transaction.senderAccount} {transaction.senderIfsc ? `| IFSC: ${transaction.senderIfsc}` : ''}
                </span>
                {transaction.senderBranch && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                    Branch: {transaction.senderBranch}
                  </span>
                )}
                {transaction.refNo && (
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block">
                    Sender Ref: {transaction.refNo}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Transfer Mode & Charges</span>
              <span className="col-span-2 font-medium text-slate-800 dark:text-slate-200">
                {transaction.transferType} High-Value Transfer (Charges: ₹0.00 / Waived)
              </span>
            </div>

            <div className="grid grid-cols-3 p-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Current Clearance Stage</span>
              <span className="col-span-2 font-mono font-semibold text-blue-600 dark:text-blue-400">
                {transaction.stage}
              </span>
            </div>

          </div>

          {/* Verification Footer Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Digitally Authenticated RaizerMT401 Advice</span>
            </span>
            <span className="font-mono">System Ref: NFG-MT401-2026-X889</span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
            >
              Close
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete transaction ${transaction.utrId}?`)) {
                    onDelete(transaction.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-1.5"
                title="Delete this transaction record"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(`UTR ID: ${transaction.utrId}\nAmount: ${transaction.amountFormatted}\nReceiver: ${transaction.receiverName}\nStatus: ${transaction.status}`)}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Details</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
