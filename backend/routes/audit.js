const express = require('express');
const { db }  = require('../data/db');
const { authenticate, authorize } = require('../middleware/auth');
const router  = express.Router();

router.get('/', authenticate, authorize('audit:read'), (req, res) => {
  res.json({ logs:db.auditLogs.slice(0,100), total:db.auditLogs.length });
});
router.get('/stats', authenticate, authorize('audit:read'), (req, res) => {
  const byOutcome={}, byEvent={};
  db.auditLogs.forEach(l => { byOutcome[l.outcome]=(byOutcome[l.outcome]||0)+1; byEvent[l.event]=(byEvent[l.event]||0)+1; });
  res.json({ total:db.auditLogs.length, byOutcome, byEvent });
});
module.exports = router;
