const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const PERMISSIONS = {
  cmo: [
    'dashboard:read',
    'users:read','users:create','users:delete',
    'roles:assign',
    'patients:read','patients:manage',
    'medical_records:read','medical_records:manage',
    'reports:read','reports:manage',
    'finance:read',
    'wards:read','wards:manage',
    'appointments:read','appointments:manage',
    'audit:read','account:unlock',
    'announcements:read','announcements:manage'
  ],
  admin: [
    'dashboard:read',
    'users:read','users:create',
    'patients:read','patients:manage',
    'reports:read','finance:read',
    'appointments:read','appointments:manage',
    'announcements:read','announcements:manage'
  ],
  doctor: [
    'dashboard:read',
    'patients:read','patients:manage',
    'medical_records:read','medical_records:manage',
    'reports:read','reports:create',
    'appointments:read','appointments:manage',
    'wards:read',
    'announcements:read',
    'profile:read','profile:update'
  ],
  nurse: [
    'dashboard:read',
    'patients:read','medical_records:read',
    'wards:read','wards:update',
    'appointments:read',
    'announcements:read',
    'profile:read','profile:update'
  ],
  receptionist: [
    'dashboard:read',
    'patients:read','patients:register',
    'appointments:read','appointments:manage',
    'announcements:read',
    'profile:read','profile:update'
  ]
};

function hasPermission(role, permission) {
  return (PERMISSIONS[role] || []).includes(permission);
}

const db = {
  users: [],
  auditLogs: [],
  nextId: 6,
  appointments: [
    { id:'apt_001', patientName:'Ibrahim Hassan', patientAge:'45', doctor:'Dr. Zainab Raza', department:'Cardiology', date:'2026-06-10', time:'09:00', type:'Consultation', notes:'Follow-up after ECG', status:'Confirmed', createdBy:'Usman Malik', createdByRole:'receptionist', createdAt:'2026-06-05T08:00:00.000Z' },
    { id:'apt_002', patientName:'Khadija Bibi',   patientAge:'32', doctor:'Dr. Zainab Raza', department:'General',    date:'2026-06-10', time:'10:30', type:'Follow-up',    notes:'Post surgery checkup', status:'Confirmed', createdBy:'Usman Malik', createdByRole:'receptionist', createdAt:'2026-06-05T08:10:00.000Z' },
    { id:'apt_003', patientName:'Omar Farooq',    patientAge:'58', doctor:'Dr. Zainab Raza', department:'ICU',        date:'2026-06-10', time:'11:45', type:'ECG',           notes:'Chest pain reported', status:'Pending', createdBy:'Ahmed Karimi', createdByRole:'admin', createdAt:'2026-06-05T08:20:00.000Z' },
    { id:'apt_004', patientName:'Aisha Siddiqui', patientAge:'27', doctor:'Dr. Zainab Raza', department:'Maternity',  date:'2026-06-11', time:'14:00', type:'Consultation', notes:'Regular prenatal checkup', status:'Confirmed', createdBy:'Usman Malik', createdByRole:'receptionist', createdAt:'2026-06-05T08:30:00.000Z' },
    { id:'apt_005', patientName:'Tariq Mehmood',  patientAge:'62', doctor:'Dr. Maryam Sheikh', department:'Cardiology', date:'2026-06-12', time:'09:30', type:'Surgery', notes:'Bypass surgery scheduled', status:'Pending', createdBy:'Ahmed Karimi', createdByRole:'admin', createdAt:'2026-06-05T09:00:00.000Z' },
  ],
  announcements: [
    { id:'ann_001', title:'New ICU Equipment Installed', body:'We are pleased to announce the installation of state-of-the-art ICU ventilators and monitoring equipment in Ward 3. All ICU staff are requested to attend the orientation session on June 8, 2026 at 2:00 PM.', tag:'Facility', priority:'high', author:'Dr. Maryam Sheikh', authorRole:'cmo', createdAt:'2026-05-28T10:00:00.000Z' },
    { id:'ann_002', title:'Monthly Staff Meeting — June 5', body:'The monthly all-staff meeting will be held on June 5 at 3:00 PM in the Main Conference Hall. Attendance is mandatory for all departments. Agenda includes Q2 performance review and patient safety protocols update.', tag:'Meeting', priority:'normal', author:'Ahmed Karimi', authorRole:'admin', createdAt:'2026-05-25T09:00:00.000Z' },
    { id:'ann_003', title:'Updated Patient Intake Protocol', body:'Effective immediately, all patient registrations must include a verified CNIC copy and emergency contact number. The new intake forms are available at the reception desk. Please ensure compliance within 48 hours.', tag:'Protocol', priority:'urgent', author:'Dr. Maryam Sheikh', authorRole:'cmo', createdAt:'2026-05-20T08:00:00.000Z' },
  ]
};

function seed() {
  const h = pw => bcrypt.hashSync(pw, SALT_ROUNDS);
  db.users = [
    { id:'1', username:'maryam.sheikh', email:'maryam.sheikh@crescentmed.com.pk', passwordHash:h('Maryam@2026!'), role:'cmo', fullName:'Dr. Maryam Sheikh', designation:'Chief Medical Officer', department:'Executive', phone:'+92-300-1111111', locked:false, failedAttempts:0, lockUntil:null, createdAt:'2024-01-01', lastLogin:null },
    { id:'2', username:'ahmed.karimi',  email:'ahmed.karimi@crescentmed.com.pk',  passwordHash:h('Ahmed#Hosp26'), role:'admin', fullName:'Ahmed Karimi', designation:'Hospital Administrator', department:'Administration', phone:'+92-300-2222222', locked:false, failedAttempts:0, lockUntil:null, createdAt:'2024-01-05', lastLogin:null },
    { id:'3', username:'zainab.raza',   email:'zainab.raza@crescentmed.com.pk',   passwordHash:h('Zainab$Doc26'), role:'doctor', fullName:'Dr. Zainab Raza', designation:'Senior Cardiologist', department:'Cardiology', phone:'+92-300-3333333', locked:false, failedAttempts:0, lockUntil:null, createdAt:'2024-01-10', lastLogin:null },
    { id:'4', username:'fatima.noor',   email:'fatima.noor@crescentmed.com.pk',   passwordHash:h('Fatima*Nur26'), role:'nurse', fullName:'Fatima Noor', designation:'Head Nurse', department:'ICU', phone:'+92-300-4444444', locked:false, failedAttempts:0, lockUntil:null, createdAt:'2024-02-01', lastLogin:null },
    { id:'5', username:'usman.malik',   email:'usman.malik@crescentmed.com.pk',   passwordHash:h('Usman@Rec26'), role:'receptionist', fullName:'Usman Malik', designation:'Senior Receptionist', department:'Front Desk', phone:'+92-300-5555555', locked:false, failedAttempts:0, lockUntil:null, createdAt:'2024-02-05', lastLogin:null },
  ];
  console.log('✅  5 staff accounts seeded');
  console.log('   maryam.sheikh  → Maryam@2026!  (CMO)');
  console.log('   ahmed.karimi   → Ahmed#Hosp26  (Admin)');
  console.log('   zainab.raza    → Zainab$Doc26  (Doctor)');
  console.log('   fatima.noor    → Fatima*Nur26  (Nurse)');
  console.log('   usman.malik    → Usman@Rec26   (Receptionist)\n');
}

seed();
module.exports = { db, PERMISSIONS, hasPermission, SALT_ROUNDS };
