import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
}));
app.use(express.json());

// Persistent database path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db-transactions.json');

const DEFAULT_TRANSACTIONS = [
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
    date: '10 SEP 2025',
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

// Helper to ensure data directory and file exist
function getStoredTransactions() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_TRANSACTIONS, null, 2), 'utf-8');
      return DEFAULT_TRANSACTIONS;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TRANSACTIONS;
  } catch (err) {
    console.error('Error reading transactions store:', err);
    return DEFAULT_TRANSACTIONS;
  }
}

// In-memory list of connected SSE clients (all devices)
let sseClients: express.Response[] = [];

function broadcastUpdate(transactions: any[]) {
  const payload = `data: ${JSON.stringify(transactions)}\n\n`;
  sseClients = sseClients.filter((client) => {
    try {
      client.write(payload);
      return true;
    } catch {
      return false;
    }
  });
}

function saveStoredTransactions(txns: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(txns, null, 2), 'utf-8');
    // Instantly broadcast to all connected devices in real time
    broadcastUpdate(txns);
    return true;
  } catch (err) {
    console.error('Error saving transactions store:', err);
    return false;
  }
}

// Global API cache prevention middleware
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Real-Time Server-Sent Events (SSE) stream for live instant cross-device updates
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  // Send initial data immediately
  const current = getStoredTransactions();
  res.write(`data: ${JSON.stringify(current)}\n\n`);

  sseClients.push(res);

  // Heartbeat ping every 10 seconds to keep connection alive through any firewall/proxy
  const keepAliveInterval = setInterval(() => {
    try {
      res.write(':ping\n\n');
    } catch {
      clearInterval(keepAliveInterval);
    }
  }, 10000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// GET all transactions
app.get('/api/transactions', (req, res) => {
  const transactions = getStoredTransactions();
  res.json(transactions);
});

// GET single transaction by UTR
app.get('/api/transactions/:utrId', (req, res) => {
  const { utrId } = req.params;
  const transactions = getStoredTransactions();
  const cleanParam = (utrId || '').trim().toUpperCase();
  const found = transactions.find((t: any) => 
    (t.utrId || '').trim().toUpperCase() === cleanParam || 
    (t.id || '').trim().toUpperCase() === cleanParam ||
    (t.refNo && t.refNo.trim().toUpperCase() === cleanParam)
  );
  if (found) {
    res.json(found);
  } else if (transactions.length > 0) {
    res.json(transactions[0]);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// UPDATE transaction status or details
app.put('/api/transactions/:utrId', (req, res) => {
  const { utrId } = req.params;
  const updates = req.body;
  const transactions = getStoredTransactions();
  const cleanParam = (utrId || '').trim().toUpperCase();

  let matched = false;
  const updatedList = transactions.map((t: any) => {
    if (
      (t.utrId || '').trim().toUpperCase() === cleanParam ||
      (t.id || '').trim().toUpperCase() === cleanParam ||
      (t.refNo && t.refNo.trim().toUpperCase() === cleanParam)
    ) {
      matched = true;
      return {
        ...t,
        ...updates
      };
    }
    return t;
  });

  // If exact UTR did not match, update the primary transaction
  if (!matched && updatedList.length > 0) {
    matched = true;
    updatedList[0] = {
      ...updatedList[0],
      ...updates
    };
  } else if (!matched) {
    updatedList.push({
      id: `TXN_${Date.now()}`,
      utrId: cleanParam || 'UTR2026091038630430',
      ...updates
    });
  }

  saveStoredTransactions(updatedList);
  res.json({ success: true, transactions: updatedList });
});

// SYNC entire transaction list
app.post('/api/transactions/sync', (req, res) => {
  const { transactions } = req.body;
  if (Array.isArray(transactions) && transactions.length > 0) {
    saveStoredTransactions(transactions);
    res.json({ success: true, count: transactions.length, transactions });
  } else {
    res.status(400).json({ error: 'Invalid transactions array' });
  }
});

// Start Server with Vite or Static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`National Financial Gateway server live at http://0.0.0.0:${PORT}`);
  });
}

startServer();
