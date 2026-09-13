require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');

async function main() {
  const dbReport = await initDatabase();
  console.log(
    `[db] ready — created: [${dbReport.created.join(', ') || 'none'}], ` +
    `existing: [${dbReport.existing.join(', ') || 'none'}], cleared: [${dbReport.cleared.join(', ')}]`
  );

  const app = express();
  app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/payment', paymentRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Not found.' }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[server] running on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error('[server] failed to start:', err.message);
  process.exit(1);
});