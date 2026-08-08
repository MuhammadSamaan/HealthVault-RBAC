const { verifyToken, extractToken } = require('./jwt');
const { hasPermission }             = require('../data/db');
const { log }                       = require('./logger');

function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error:'Authentication required.', code:'NO_TOKEN' });
  try { req.user = verifyToken(token); req.token = token; next(); }
  catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({ error:expired?'Session expired. Please sign in again.':'Invalid or tampered token.', code:expired?'EXPIRED':'INVALID' });
  }
}

function authorize(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error:'Not authenticated.' });
    if (!hasPermission(req.user.role, permission)) {
      log({ event:'ACCESS_DENIED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Role "${req.user.role}" attempted "${permission}"`, outcome:'DENIED' });
      return res.status(403).json({ error:`Access denied. Your role (${req.user.role}) cannot perform this action.`, code:'FORBIDDEN', role:req.user.role });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
