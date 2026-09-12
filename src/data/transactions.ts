import { Transaction } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-38630430',
    utrId: 'UTR2026091038630430',
    amount: 1250000000,
    amountFormatted: '125.00 CR INR',
    amountInWords: 'One Hundred Twenty Five Crore Rupees Only',
    receiverName: 'D CACUS FOUNDATION',
    receiverAccount: '0794201003255',
    receiverBank: 'CANARA BANK',
    receiverIfsc: 'CNRB0003955',
    date: '10 SEP 2026',
    time: '15:10:50',
    status: 'Credited',
    transferType: 'RaizerMT401',
    coolingPeriodNotice: 'Payment Settlement Complete - Funds Successfully Credited to Receiver Account',
    estimatedReleaseTime: 'Settled & Completed',
    stage: 'Stage 4 of 4: Account Credited & Settled',
    senderAccount: '05230120000032',
    senderName: 'GIRIAS INVESTMENT PVT LTD',
    senderIfsc: 'HDFC0000509',
    senderBranch: 'BANGALORE BWSSB EXTN COUNTER',
    refNo: '38630430',
    remarks: 'RaizerMT401 High-Value Inter-Bank Settlement Clearance',
    charges: 0
  }
];
