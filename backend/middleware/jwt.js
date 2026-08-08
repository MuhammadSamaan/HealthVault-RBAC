const jwt = require('jsonwebtoken');
const SECRET    = process.env.JWT_SECRET || 'crescentmed-rbac-2026-secret-key';
const blacklist = new Set();
function signToken(user) {
  return jwt.sign({ sub:user.id, username:user.username, role:user.role, fullName:user.fullName, department:user.department, designation:user.designation }, SECRET, { expiresIn:'2h' });
}
function verifyToken(token) {
  if (blacklist.has(token)) throw Object.assign(new Error('Revoked'), { code:'REVOKED' });
  return jwt.verify(token, SECRET);
}
function revokeToken(token) { blacklist.add(token); }
function extractToken(req) {
  const h = req.headers['authorization'];
  return h && h.startsWith('Bearer ') ? h.split(' ')[1] : null;
}
module.exports = { signToken, verifyToken, revokeToken, extractToken };
