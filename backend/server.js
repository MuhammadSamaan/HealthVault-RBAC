const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const { sanitizeInput } = require('./middleware/sanitize');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(sanitizeInput);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/audit',    require('./routes/audit'));
app.use('/api/hospital', require('./routes/hospital'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'online', system: 'Crescent Medical Center RBAC', time: new Date().toISOString() })
);

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Crescent Medical Center — RBAC Backend     ║');
  console.log('║   Made by Muhammad Samaan                    ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`✅  Server  : http://localhost:${PORT}`);
  console.log('🔐  JWT     : HMAC-SHA256, 2h TTL');
  console.log('🛡️   Sanitize: active on all inputs');
  console.log('📋  Audit   : persistent to file\n');
});
