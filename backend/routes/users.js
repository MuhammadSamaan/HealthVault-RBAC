const express = require('express');
const { db }  = require('../data/db');
const { authenticate, authorize } = require('../middleware/auth');
const { log } = require('../middleware/logger');
const router  = express.Router();

router.get('/', authenticate, authorize('users:read'), (req, res) => {
  res.json({ users: db.users.map(u => ({ id:u.id, username:u.username, email:u.email, role:u.role, fullName:u.fullName, designation:u.designation, department:u.department, locked:u.locked, failedAttempts:u.failedAttempts, createdAt:u.createdAt, lastLogin:u.lastLogin })) });
});

router.patch('/:id/role', authenticate, authorize('roles:assign'), (req, res) => {
  const u = db.users.find(u => u.id === req.params.id);
  if (!u) return res.status(404).json({ error:'User not found.' });
  const old = u.role; u.role = req.body.role;
  log({ event:'ROLE_CHANGED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`${u.username}: ${old} → ${req.body.role}`, outcome:'SUCCESS' });
  res.json({ message:'Role updated.', user:{ id:u.id, username:u.username, role:u.role } });
});

router.patch('/:id/unlock', authenticate, authorize('account:unlock'), (req, res) => {
  const u = db.users.find(u => u.id === req.params.id);
  if (!u) return res.status(404).json({ error:'User not found.' });
  u.locked=false; u.failedAttempts=0; u.lockUntil=null;
  log({ event:'ACCOUNT_UNLOCKED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Unlocked "${u.username}"`, outcome:'SUCCESS' });
  res.json({ message:`${u.fullName}'s account unlocked.` });
});

router.delete('/:id', authenticate, authorize('users:delete'), (req, res) => {
  if (req.params.id === req.user.sub) return res.status(400).json({ error:'Cannot delete your own account.' });
  const i = db.users.findIndex(u => u.id === req.params.id);
  if (i===-1) return res.status(404).json({ error:'User not found.' });
  const [del] = db.users.splice(i,1);
  log({ event:'USER_DELETED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Deleted "${del.username}"`, outcome:'SUCCESS' });
  res.json({ message:`${del.fullName} removed.` });
});

module.exports = router;
