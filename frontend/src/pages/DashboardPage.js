import { useEffect, useState } from 'react';
import { useAuth, api } from '../context/AuthContext';

const RC = {
  cmo:         { c:'#c084fc', bg:'rgba(168,85,247,.15)', icon:'👑', title:'CMO Dashboard',           desc:'Full oversight — staff, patients, finance, security, and all hospital systems.' },
  admin:       { c:'#60a5fa', bg:'rgba(96,165,250,.15)',  icon:'📋', title:'Administration Dashboard', desc:'Manage hospital operations, staff records, appointments, and finance.' },
  doctor:      { c:'#22d3ee', bg:'rgba(34,211,238,.12)',  icon:'🩺', title:'Doctor Dashboard',         desc:'Access patient records, manage appointments, and submit medical reports.' },
  nurse:       { c:'#4ade80', bg:'rgba(74,222,128,.12)',  icon:'💊', title:'Nursing Dashboard',        desc:'Monitor ward status, patient conditions, and daily care assignments.' },
  receptionist:{ c:'#fb923c', bg:'rgba(251,146,60,.12)',  icon:'📞', title:'Reception Dashboard',      desc:'Manage patient registrations, appointments, and front-desk operations.' },
};

const PERMS = {
  cmo:         { 'Full Dashboard':true, 'Staff Management':true, 'Patient Records':true, 'Medical Reports':true, 'Announcements':true, 'Appointments':true, 'Audit Log':true, 'Finance':true },
  admin:       { 'Full Dashboard':true, 'Staff Management':true, 'Patient Records':true, 'Medical Reports':true, 'Announcements':true, 'Appointments':true, 'Audit Log':false, 'Finance':true },
  doctor:      { 'Full Dashboard':true, 'Staff Management':false, 'Patient Records':true, 'Medical Reports':true, 'Announcements':'Read only', 'Appointments':true, 'Audit Log':false, 'Finance':false },
  nurse:       { 'Full Dashboard':true, 'Staff Management':false, 'Patient Records':'View only', 'Medical Reports':false, 'Announcements':'Read only', 'Appointments':'View only', 'Audit Log':false, 'Finance':false },
  receptionist:{ 'Full Dashboard':true, 'Staff Management':false, 'Patient Records':'Register only', 'Medical Reports':false, 'Announcements':'Read only', 'Appointments':true, 'Audit Log':false, 'Finance':false },
};

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'16px 18px', display:'flex', alignItems:'center', gap:13 }}>
      <div style={{ width:42, height:42, borderRadius:11, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:700, color, fontFamily:'var(--mono)' }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [appts, setAppts]   = useState([]);
  const [anns,  setAnns]    = useState([]);
  const rc = RC[user?.role] || RC.receptionist;

  useEffect(() => {
    if (user?.role==='cmo') api.get('/audit/stats').then(r=>setStats(r.data)).catch(()=>{});
    api.get('/hospital/appointments').then(r=>setAppts(r.data.appointments?.slice(0,3)||[])).catch(()=>{});
    api.get('/hospital/announcements').then(r=>setAnns(r.data.announcements?.slice(0,3)||[])).catch(()=>{});
  }, [user]);

  const priorityColor = { urgent:'var(--red)', high:'var(--amber)', normal:'var(--teal-lite)' };
  const priorityBg    = { urgent:'var(--red-bg)', high:'var(--amber-bg)', normal:'rgba(34,211,238,.1)' };
  const tagColor      = ['var(--teal-lite)','var(--purple)','var(--amber)','var(--green)','var(--pink)'];

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Header banner */}
      <div style={{ background:'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(16px,2.5vw,24px)', marginBottom:'clamp(14px,2vw,20px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:`${rc.c}08`, border:`1px solid ${rc.c}15`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:40, bottom:-30, width:80, height:80, borderRadius:'50%', background:`${rc.c}05`, pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, flexWrap:'wrap' }}>
            <div style={{ width:46, height:46, borderRadius:12, background:rc.bg, border:`1px solid ${rc.c}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{rc.icon}</div>
            <div>
              <p style={{ fontSize:10, fontWeight:500, color:'var(--text2)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:3 }}>Dashboard</p>
              <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>{rc.title}</h1>
            </div>
          </div>
          <p style={{ fontSize:13, color:'var(--text2)', maxWidth:500, lineHeight:1.7, marginBottom:12 }}>{rc.desc}</p>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:rc.bg, border:`1px solid ${rc.c}30`, borderRadius:20, padding:'3px 11px' }}>
              <span style={{ fontSize:11 }}>{rc.icon}</span>
              <span style={{ fontSize:11, fontWeight:600, color:rc.c }}>{user?.fullName}</span>
            </div>
            <span style={{ fontSize:11, color:'var(--text3)' }}>·</span>
            <span style={{ fontSize:11, color:'var(--text3)' }}>{user?.designation}</span>
            <span style={{ fontSize:11, color:'var(--text3)' }}>·</span>
            <span style={{ fontSize:11, color:'var(--text3)' }}>{user?.department}</span>
          </div>
        </div>
      </div>

      {/* CMO stats */}
      {user?.role==='cmo' && stats && (
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'clamp(14px,2vw,20px)' }}>
          <StatCard label="Auth Events" value={stats.total||0} color="var(--teal-lite)" icon="📊" />
          <StatCard label="Logins"      value={stats.byOutcome?.SUCCESS||0} color="var(--green)" icon="✅" />
          <StatCard label="Failed"      value={(stats.byOutcome?.FAILED||0)+(stats.byOutcome?.BLOCKED||0)} color="var(--red)" icon="❌" />
          <StatCard label="Denied"      value={stats.byOutcome?.DENIED||0} color="var(--amber)" icon="🚫" />
        </div>
      )}

      <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(12px,2vw,18px)' }}>

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(12px,2vw,16px)' }}>

          {/* Permissions */}
          <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,18px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13 }}>
              <span style={{ fontSize:16 }}>🔐</span>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Access Permissions</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {Object.entries(PERMS[user?.role]||{}).map(([p,v])=>(
                <div key={p} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 9px', borderRadius:'var(--r-sm)', background:v?'rgba(34,211,238,.03)':'transparent', border:`1px solid ${v?'rgba(34,211,238,.07)':'var(--border)'}` }}>
                  <span style={{ fontSize:12, color:v?'var(--text1)':'var(--text3)' }}>{p}</span>
                  <span style={{ fontSize:10, fontWeight:600, fontFamily:'var(--mono)', color:v===true?'var(--green)':v?'var(--teal-lite)':'var(--red)', background:v===true?'var(--green-bg)':v?'rgba(34,211,238,.1)':'var(--red-bg)', padding:'2px 7px', borderRadius:20 }}>
                    {v===true?'ALLOW':v?v.toUpperCase():'DENY'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,18px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13 }}>
              <span style={{ fontSize:16 }}>👤</span>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Account Details</h3>
            </div>
            {[['Email',user?.email],['Username',user?.username],['Department',user?.department],['Last Login',user?.lastLogin?new Date(user.lastLogin).toLocaleString():'First session']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:12, gap:8 }}>
                <span style={{ color:'var(--text3)', flexShrink:0 }}>{k}</span>
                <span style={{ color:'var(--text2)', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(12px,2vw,16px)' }}>

          {/* Recent appointments */}
          <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,18px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>🗓️</span>
                <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Upcoming Appointments</h3>
              </div>
              <a href="/appointments" style={{ fontSize:11, color:'var(--teal-lite)', textDecoration:'none', fontWeight:500 }}>View all →</a>
            </div>
            {appts.length===0
              ? <p style={{ fontSize:12, color:'var(--text3)', textAlign:'center', padding:12 }}>No appointments yet</p>
              : appts.map(a=>(
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:'var(--r-sm)', border:'1px solid var(--border)', marginBottom:6, background:'var(--bg2)' }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:'var(--teal-glow)', border:'1px solid rgba(34,211,238,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🩺</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patientName}</div>
                    <div style={{ fontSize:11, color:'var(--text2)' }}>{a.doctor} · {a.date} {a.time}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:600, color:a.status==='Confirmed'?'var(--green)':'var(--amber)', background:a.status==='Confirmed'?'var(--green-bg)':'var(--amber-bg)', padding:'2px 7px', borderRadius:20, flexShrink:0 }}>{a.status}</span>
                </div>
              ))
            }
          </div>

          {/* Recent announcements */}
          <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,18px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>📢</span>
                <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Latest Announcements</h3>
              </div>
              <a href="/announcements" style={{ fontSize:11, color:'var(--teal-lite)', textDecoration:'none', fontWeight:500 }}>View all →</a>
            </div>
            {anns.length===0
              ? <p style={{ fontSize:12, color:'var(--text3)', textAlign:'center', padding:12 }}>No announcements yet</p>
              : anns.map((a,i)=>(
                <div key={a.id} style={{ padding:'10px 11px', borderRadius:'var(--r-sm)', border:'1px solid var(--border)', borderLeft:`3px solid ${tagColor[i%tagColor.length]}`, marginBottom:7, background:'var(--bg2)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4, flexWrap:'wrap', gap:4 }}>
                    <span style={{ fontSize:10, fontWeight:600, color:tagColor[i%tagColor.length], background:`${tagColor[i%tagColor.length]}18`, padding:'2px 7px', borderRadius:20 }}>{a.tag}</span>
                    <span style={{ fontSize:10, fontWeight:600, color:priorityColor[a.priority], background:priorityBg[a.priority], padding:'2px 7px', borderRadius:20 }}>{a.priority?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--text1)', marginBottom:2 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>By {a.author} · {new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
