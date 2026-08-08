function sanitizeString(v) {
  if (typeof v !== 'string') return v;
  return v.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').trim();
}
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    clean[k] = typeof v==='string' ? sanitizeString(v) : typeof v==='object' ? sanitizeObject(v) : v;
  }
  return clean;
}
function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') req.body = sanitizeObject(req.body);
  next();
}
module.exports = { sanitizeInput };
