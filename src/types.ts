export type TransactionStatus = 
  | 'Processing'    // Cooling Fund
  | 'Credited'      // Credit
  | 'Freeze'        // Freeze
  | 'Unfreeze'      // Unfreeze
  | 'CyberReport'   // Cyber Report
  | 'BankReport'    // Bank Report
  | 'HoldManager'   // Hold Manager
  | 'Chargeback';   // Chargeback

export interface Transaction {
  id: string;
  utrId: string;
  amount: number; // in Rupees
  amountFormatted: string; // e.g., "83.92 CR INR"
  amountInWords?: string;
  receiverName: string;
  receiverAccount: string;
  receiverBank: string;
  receiverIfsc: string;
  date: string; // e.g. "29/08/2026"
  time: string; // e.g. "21:37:05"
  status: TransactionStatus;
  transferType: 'RaizerMT401' | 'RTGS' | 'NEFT' | 'IMPS';
  coolingPeriodNotice?: string;
  estimatedReleaseTime?: string;
  stage: string;
  senderAccount: string;
  senderName: string;
  senderIfsc?: string;
  senderBranch?: string;
  refNo?: string;
  adminNote?: string;
  remarks?: string;
  charges: number;
}

export type FilterStatus = 'ALL' | TransactionStatus;
