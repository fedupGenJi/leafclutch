const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const useSsl = process.env.DATABASE_SSL === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

const TABLES = ['users', 'khalti_temp', 'registrations'];
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function tableExists(name) {
  const { rows } = await pool.query('SELECT to_regclass($1) AS reg', [`public.${name}`]);
  return rows[0].reg !== null;
}

async function initDatabase() {
  const report = { created: [], existing: [], cleared: [] };

  const existedBefore = {};
  for (const table of TABLES) {
    existedBefore[table] = await tableExists(table);
  }

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await pool.query(schema);

  for (const table of TABLES) {
    if (existedBefore[table]) report.existing.push(table);
    else report.created.push(table);
  }

  // DISABLED: this used to TRUNCATE khalti_temp on every boot. That meant
  // any restart (crash, deploy, or free-tier spin-down) happening between
  // a user starting a Khalti payment and returning from it would wipe the
  // in-flight pidx row, causing verification to fail even for real,
  // completed payments. Turned off for now — investigate before re-enabling.
  //
  // Safer version, once we do want cleanup: only remove attempts old
  // enough to be genuinely abandoned, not everything on every boot.
  //
  // await pool.query(
  //   "DELETE FROM khalti_temp WHERE created_at < now() - interval '24 hours'"
  // );
  // report.cleared.push('khalti_temp (rows older than 24h)');

  return report;
}

module.exports = { pool, initDatabase };