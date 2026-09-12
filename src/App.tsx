import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_TRANSACTIONS } from './data/transactions';
import { Transaction, FilterStatus, TransactionStatus } from './types';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { TransactionTable } from './components/TransactionTable';
import { TransactionModal } from './components/TransactionModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { PortalGateway } from './components/PortalGateway';
import { ShieldCheck, CheckCircle, ArrowLeft, KeyRound, Radio } from 'lucide-react';

const STORAGE_KEY = 'nfg_portal_canara_d_cacus_v5';
const SECRET_ADMIN_UTR = 'UTR999900001111';
const NORMAL_ACCOUNT_UTR = 'UTR2026091038630430';

export default function App() {
  // App View State: 'GATEWAY' | 'ACCOUNT_VIEW'
  const [currentView, setCurrentView] = useState<'GATEWAY' | 'ACCOUNT_VIEW'>('GATEWAY');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_TRANSACTIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Secret Admin Control State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Sync state to local storage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Central fetcher to pull latest state from server backend
  const fetchFromServer = useCallback(async (): Promise<Transaction[]> => {
    try {
      const res = await fetch(`/api/transactions?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {
            // ignore
          }
          return data;
        }
      }
    } catch {
      // Offline fallback
    }
    return transactions;
  }, [transactions]);

  // Multi-Device Real-Time Sync: SSE Stream + 1.0s Polling + Window Focus
  useEffect(() => {
    fetchFromServer();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data) && data.length > 0) {
            setTransactions(data);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {
              // ignore
            }
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // SSE fallback
    }

    const pollInterval = setInterval(fetchFromServer, 1000);

    const handleFocus = () => {
      fetchFromServer();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [fetchFromServer]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Central UTR Verification handler (called from Gateway or Search)
  const handleVerifyUTR = async (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();

    // Check for Secret Admin Master UTR
    if (clean === SECRET_ADMIN_UTR) {
      setIsAdminOpen(true);
      setAdminNotice('Master Controller Mode Activated via Admin UTR Key.');
      setTimeout(() => setAdminNotice(null), 4000);
      return;
    }

    // Always pull freshest real-time data from central server before rendering slip
    const freshList = await fetchFromServer();

    // Check for Normal Customer UTR or any valid UTR
    if (clean === NORMAL_ACCOUNT_UTR || clean.startsWith('UTR')) {
      setCurrentView('ACCOUNT_VIEW');
      setSearchQuery('');
      // Automatically open the slip advice modal directly so user sees the status instantly!
      const targetTxn = freshList.find(t => t.utrId.toUpperCase() === clean) || freshList[0] || transactions[0];
      if (targetTxn) {
        setSelectedTransactionId(targetTxn.id);
      }
      showToast(`Account ledger opened for reference ${clean}`);
      return;
    }

    // Fallback: search within account
    setCurrentView('ACCOUNT_VIEW');
    setSearchQuery(inputCode);
  };

  const handleSearchChange = (query: string) => {
    const trimmed = query.trim().toUpperCase();
    if (trimmed === SECRET_ADMIN_UTR) {
      setIsAdminOpen(true);
      setAdminNotice('Master Controller Mode Activated via Admin UTR Key.');
      setTimeout(() => setAdminNotice(null), 4000);
      setSearchQuery('');
      return;
    }
    setSearchQuery(query);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFromServer();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live Gateway Synced with Central Server.');
    }, 500);
  };

  const handleExportStatement = () => {
    if (transactions.length === 0) {
      showToast('No transaction records available to export.');
      return;
    }
    showToast('Preparing Official Banking Statement...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleDeleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    try {
      await fetch('/api/transactions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: updated })
      });
    } catch {
      // fallback
    }
    showToast('Transaction record removed permanently.');
  };

  // Admin update callback with instant server broadcast
  const handleAdminUpdateStatus = async (
    utrId: string,
    newStatus: TransactionStatus,
    customNotice?: string,
    customStage?: string,
    adminNote?: string,
    updatedDetails?: Partial<Transaction>
  ) => {
    const cleanUtr = utrId.trim().toUpperCase();
    const updated = transactions.map((t) => {
      if (t.utrId.trim().toUpperCase() === cleanUtr || t.id.trim().toUpperCase() === cleanUtr) {
        return {
          ...t,
          status: newStatus,
          coolingPeriodNotice: customNotice !== undefined ? customNotice : t.coolingPeriodNotice,
          stage: customStage !== undefined ? customStage : t.stage,
          adminNote: adminNote !== undefined ? adminNote : t.adminNote,
          ...(updatedDetails || {})
        };
      }
      return t;
    });

    setTransactions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    try {
      const response = await fetch(`/api/transactions/${cleanUtr}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          status: newStatus,
          coolingPeriodNotice: customNotice,
          stage: customStage,
          adminNote: adminNote,
          ...(updatedDetails || {})
        })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData && Array.isArray(resData.transactions)) {
          setTransactions(resData.transactions);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.transactions));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.log('Server sync fallback:', err);
    }

    showToast(`Status permanently updated to ${newStatus} on all devices.`);
  };

  const activeModalTransaction = selectedTransactionId
    ? transactions.find((t) => t.id === selectedTransactionId || t.utrId === selectedTransactionId) || null
    : null;

  const filteredTransactions = transactions.filter((txn) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      txn.utrId.toLowerCase().includes(q) ||
      txn.receiverName.toLowerCase().includes(q) ||
      txn.amountFormatted.toLowerCase().includes(q) ||
      txn.receiverBank.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || txn.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Indicator */}
      {adminNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-red-500/50 flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-red-400">ADMIN AUTHENTICATED</p>
            <p className="text-xs text-slate-300">{adminNotice}</p>
          </div>
        </div>
      )}

      {/* VIEW 1: CENTRAL UTR VERIFICATION GATEWAY */}
      {currentView === 'GATEWAY' ? (
        <PortalGateway
          onVerifyUTR={handleVerifyUTR}
          defaultUtr={NORMAL_ACCOUNT_UTR}
        />
      ) : (
        /* VIEW 2: NORMAL ACCOUNT STATEMENT & HISTORY VIEW */
        <div className="flex-1 flex flex-col">
          
          {/* Corporate Header */}
          <Header
            onExport={handleExportStatement}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            senderName={transactions[0]?.senderName || 'GIRIAS INVESTMENT PVT LTD'}
            refDate={transactions[0]?.date || '10 SEP 2026'}
          />

          {/* Navigation Bar back to Gateway */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-2 text-xs flex items-center justify-between text-slate-300">
            <button
              onClick={() => setCurrentView('GATEWAY')}
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-all py-1 px-2 rounded-md hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to UTR Verification Gateway</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-400 hidden sm:inline flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Verified Beneficiary: <strong className="text-white">{transactions[0]?.receiverName || 'D CACUS FOUNDATION'}</strong>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                <span>Live Clearance Active</span>
              </span>
            </div>
          </div>

          {/* Main Dashboard Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Top Summary Metrics */}
            <SummaryCards transactions={transactions} />

            {/* Search & Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              totalCount={transactions.length}
            />

            {/* Transaction History Table */}
            <TransactionTable
              transactions={filteredTransactions}
              onSelectTransaction={(txn) => setSelectedTransactionId(txn.id)}
              onDeleteTransaction={handleDeleteTransaction}
            />

          </main>

          {/* Footer */}
          <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 text-xs mt-12 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>National Financial Gateway — Central Clearance System</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                <span>Ref Date: {transactions[0]?.date || '10 SEP 2026'}</span>
                <span>•</span>
                <span>RaizerMT401 Inter-Bank Protocol</span>
                <span>•</span>
                <span>256-Bit SSL Security</span>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* Transaction Details Modal (Live updating across devices) */}
      <TransactionModal
        transaction={activeModalTransaction}
        onClose={() => setSelectedTransactionId(null)}
        onDelete={handleDeleteTransaction}
      />

      {/* Hidden Master Admin Controller */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        transactions={transactions}
        onUpdateStatus={handleAdminUpdateStatus}
        onOpenAccountView={(utr) => {
          setIsAdminOpen(false);
          setCurrentView('ACCOUNT_VIEW');
        }}
      />

    </div>
  );
}
