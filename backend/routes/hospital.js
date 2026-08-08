const express = require('express');
const { db }  = require('../data/db');
const { authenticate, authorize } = require('../middleware/auth');
const { log } = require('../middleware/logger');
const router  = express.Router();

// ── Appointments ───────────────────────────────────────────────
router.get('/appointments', authenticate, authorize('appointments:read'), (req, res) => {
  res.json({ appointments: db.appointments });
});

router.post('/appointments', authenticate, authorize('appointments:manage'), (req, res) => {
  const { patientName, patientAge, doctor, department, date, time, type, notes } = req.body;
  if (!patientName || !doctor || !date || !time || !type)
    return res.status(400).json({ error:'Patient name, doctor, date, time and type are required.' });
  const appt = {
    id:`apt_${Date.now()}`, patientName, patientAge:patientAge||'',
    doctor, department:department||'General', date, time, type,
    notes:notes||'', status:'Confirmed',
    createdBy:req.user.fullName, createdByRole:req.user.role,
    createdAt:new Date().toISOString()
  };
  db.appointments.unshift(appt);
  log({ event:'APPOINTMENT_CREATED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Booked for "${patientName}" with ${doctor} on ${date} at ${time}`, outcome:'SUCCESS' });
  res.status(201).json({ message:'Appointment booked.', appointment:appt });
});

router.patch('/appointments/:id/status', authenticate, authorize('appointments:manage'), (req, res) => {
  const appt = db.appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error:'Appointment not found.' });
  appt.status = req.body.status;
  log({ event:'APPOINTMENT_UPDATED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`"${appt.patientName}" → ${req.body.status}`, outcome:'SUCCESS' });
  res.json({ message:'Appointment updated.', appointment:appt });
});

router.delete('/appointments/:id', authenticate, authorize('appointments:manage'), (req, res) => {
  const idx = db.appointments.findIndex(a => a.id === req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Appointment not found.' });
  const [del] = db.appointments.splice(idx,1);
  log({ event:'APPOINTMENT_CANCELLED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Cancelled for "${del.patientName}"`, outcome:'SUCCESS' });
  res.json({ message:'Appointment cancelled.' });
});

// ── Announcements ──────────────────────────────────────────────
router.get('/announcements', authenticate, authorize('announcements:read'), (req, res) => {
  res.json({ announcements: db.announcements });
});

router.post('/announcements', authenticate, authorize('announcements:manage'), (req, res) => {
  const { title, body, tag, priority } = req.body;
  if (!title || !body) return res.status(400).json({ error:'Title and body are required.' });
  const ann = {
    id:`ann_${Date.now()}`, title, body,
    tag:tag||'General', priority:priority||'normal',
    author:req.user.fullName, authorRole:req.user.role,
    createdAt:new Date().toISOString()
  };
  db.announcements.unshift(ann);
  log({ event:'ANNOUNCEMENT_CREATED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Posted: "${title}"`, outcome:'SUCCESS' });
  res.status(201).json({ message:'Announcement posted.', announcement:ann });
});

router.delete('/announcements/:id', authenticate, authorize('announcements:manage'), (req, res) => {
  const idx = db.announcements.findIndex(a => a.id === req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Announcement not found.' });
  const [del] = db.announcements.splice(idx,1);
  log({ event:'ANNOUNCEMENT_DELETED', userId:req.user.sub, username:req.user.username, ip:req.ip, details:`Deleted: "${del.title}"`, outcome:'SUCCESS' });
  res.json({ message:'Announcement deleted.' });
});

module.exports = router;
