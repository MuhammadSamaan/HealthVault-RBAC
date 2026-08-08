const { db } = require('../data/db');
const fs   = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '../data/audit_logs.json');

function loadLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
      db.auditLogs = Array.isArray(data) ? data : [];
      console.log(`📋  Loaded ${db.auditLogs.length} audit entries`);
    }
  } catch { db.auditLogs = []; }
}

function saveLogs() {
  try { fs.writeFileSync(LOG_FILE, JSON.stringify(db.auditLogs, null, 2), 'utf8'); }
  catch (e) { console.error('Audit save error:', e.message); }
}

function log(entry) {
  const e = { id:`log_${Date.now()}_${Math.random().toString(36).substr(2,5)}`, timestamp:new Date().toISOString(), ...entry };
  db.auditLogs.unshift(e);
  if (db.auditLogs.length > 500) db.auditLogs.pop();
  saveLogs();
  const icons = { SUCCESS:'✅', FAILED:'❌', BLOCKED:'🛑', DENIED:'🚫', INFO:'ℹ️' };
  console.log(`${icons[e.outcome]||'📝'} ${e.event} | ${e.username} | ${e.details}`);
  return e;
}

loadLogs();
module.exports = { log };
