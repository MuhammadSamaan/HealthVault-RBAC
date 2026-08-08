const express   = require('express');
const bcrypt    = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { db, SALT_ROUNDS } = require('../data/db');
const { signToken, revokeToken } = require('../middleware/jwt');
const { authenticate }           = require('../middleware/auth');
const { log }                    = require('../middleware/logger');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs:15*60*1000, max:30, message:{ error:'Too many attempts. Try again in 15 minutes.' } });
const LOCK_AFTER = 5, LOCK_MS = 15*60*1000;

function isLocked(u) {
  if (!u.locked) return false;
  if (u.lockUntil && new Date(u.lockUntil) < new Date()) { u.locked=false; u.failedAttempts=0; u.lockUntil=null; return false; }
  return true;
}

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error:'Username and password required.' });
  const user = db.users.find(u => u.username === username);
  if (!user) {
    await bcrypt.compare(password, '$2a$10$dummyhashtopreventtimingattacks000000000000000');
    log({ event:'LOGIN_FAILED', userId:'unknown', username, ip:req.ip, details:'Unknown username', outcome:'FAILED' });
    return res.status(401).json({ error:'Invalid username or password.' });
  }
  if (isLocked(user)) {
    log({ event:'LOGIN_BLOCKED', userId:user.id, username:user.username, ip:req.ip, details:'Account locked', outcome:'BLOCKED' });
    return res.status(423).json({ error:'Account locked. Contact the CMO or Administrator.', code:'LOCKED' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    user.failedAttempts++;
    if (user.failedAttempts >= LOCK_AFTER) {
      user.locked=true; user.lockUntil=new Date(Date.now()+LOCK_MS).toISOString();
      log({ event:'ACCOUNT_LOCKED', userId:user.id, username:user.username, ip:req.ip, details:`Locked after ${LOCK_AFTER} failed attempts`, outcome:'BLOCKED' });
      return res.status(423).json({ error:`Account locked after ${LOCK_AFTER} failed attempts.`, code:'LOCKED' });
    }
    log({ event:'LOGIN_FAILED', userId:user.id, username:user.username, ip:req.ip, details:`Wrong password attempt ${user.failedAttempts}/${LOCK_AFTER}`, outcome:'FAILED' });
    return res.status(401).json({ error:'Invalid username or password.', attemptsRemaining:LOCK_AFTER-user.failedAttempts });
  }
  user.failedAttempts=0; user.lastLogin=new Date().toISOString();
  const token = signToken(user);
  log({ event:'LOGIN_SUCCESS', userId:user.id, username:user.username, ip:req.ip, details:`Logged in as ${user.role} — JWT issued`, outcome:'SUCCESS' });
  res.json({ token, user:{ id:user.id, username:user.username, email:user.email, role:user.role, fullName:user.fullName, designation:user.designation, department:user.department, lastLogin:user.lastLogin } });
});

router.post('/logout', authenticate, (req, res) => {
  revokeToken(req.token);
  log({ event:'LOGOUT', userId:req.user.sub, username:req.user.username, ip:req.ip, details:'Signed out — token revoked', outcome:'SUCCESS' });
  res.json({ message:'Signed out successfully.' });
});

router.get('/me', authenticate, (req, res) => {
  const u = db.users.find(u => u.id === req.user.sub);
  if (!u) return res.status(404).json({ error:'User not found.' });
  res.json({ id:u.id, username:u.username, email:u.email, role:u.role, fullName:u.fullName, designation:u.designation, department:u.department, lastLogin:u.lastLogin });
});

router.post('/register', authenticate, async (req, res) => {
  if (!['cmo','admin'].includes(req.user.role)) return res.status(403).json({ error:'Only CMO or Admin can register staff.' });
  const { username, email, password, role, fullName, designation, department } = req.body;
  if (!username||!email||!password||!role||!fullName) return res.status(400).json({ error:'All fields required.' });
  if (!['cmo','admin','doctor','nurse','receptionist'].includes(role)) return res.status(400).json({ error:'Invalid role.' });
  if (req.user.role==='admin' && role==='cmo') return res.status(403).json({ error:'Administrators cannot create CMO accounts.' });
  if (db.users.find(u => u.username===username||u.email===email)) return res.status(409).json({ error:'Username or email already exists.' });
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = { id:String(db.nextId++), username, email, passwordHash, role, fullName, designation:designation||'Staff', department:department||'General', locked:false, failedAttempts:0, lockUntil:null, createdAt:new Date().toISOString(), lastLogin:null };
  db.users.push(newUser);
  log({ event:'USER_REGISTERED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Registered "${username}" as ${role}`, outcome:'SUCCESS' });
  res.status(201).json({ message:'Staff registered.', user:{ id:newUser.id, username:newUser.username, role:newUser.role, fullName:newUser.fullName } });
});

module.exports = router;
