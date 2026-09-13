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

  // khalti_temp only ever holds in-flight payment attempts, so every
  // fresh boot starts clean rather than carrying stale pidx rows.
  await pool.query('TRUNCATE TABLE khalti_temp RESTART IDENTITY');
  report.cleared.push('khalti_temp');

  return report;
}

module.exports = { pool, initDatabase };
