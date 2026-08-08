import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const ROLE_STYLE = {
  cmo:         { c:'#c084fc', bg:'rgba(168,85,247,.15)', label:'Chief Medical Officer', icon:'👑' },
  admin:       { c:'#60a5fa', bg:'rgba(96,165,250,.15)',  label:'Administrator',         icon:'📋' },
  doctor:      { c:'#22d3ee', bg:'rgba(34,211,238,.12)',  label:'Doctor',                icon:'🩺' },
  nurse:       { c:'#4ade80', bg:'rgba(74,222,128,.12)',  label:'Nurse',                 icon:'💊' },
  receptionist:{ c:'#fb923c', bg:'rgba(251,146,60,.12)',  label:'Receptionist',          icon:'📞' },
};

const NAV = [
  { to:'/dashboard',     icon:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',                                                                                  label:'Dashboard',       roles:['cmo','admin','doctor','nurse','receptionist'] },
  { to:'/appointments',  icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',                                    label:'Appointments',    roles:['cmo','admin','doctor','nurse','receptionist'] },
  { to:'/announcements', icon:'M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 0 8 17h.5l1.5 3',          label:'Announcements',   roles:['cmo','admin','doctor','nurse','receptionist'] },
  { to:'/reports',       icon:'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z', label:'Reports',         roles:['cmo','admin','doctor'] },
  { to:'/staff',         icon:'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0', label:'Staff Mgmt',      roles:['cmo','admin'] },
  { to:'/audit',         icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',   label:'Audit Log',       roles:['cmo'] },
];

function Icon({ d, size=15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d}/>
    </svg>
  );
}

export default function Layout() {
  const { user, logout, fmtTimer, seconds } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy]             = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const rs = ROLE_STYLE[user?.role] || ROLE_STYLE.receptionist;
  const timerColor = seconds<300?'var(--red)':seconds<600?'var(--amber)':'var(--green)';

  const handleLogout = async () => { setBusy(true); await logout(); navigate('/login'); };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg0)' }}>

      {/* Mobile overlay */}
      <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)}
        style={{ display:'none', position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:199 }} />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen?' open':''}`}
        style={{ width:'var(--sidebar-w)', background:'var(--bg1)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0 }}>

        {/* Brand */}
        <div style={{ padding:'16px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,var(--teal),var(--teal-mid))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, flexShrink:0, boxShadow:'0 4px 10px rgba(14,116,144,.3)' }}>🏥</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text1)', letterSpacing:'-.01em' }}>Crescent Medical</div>
            <div style={{ fontSize:9, color:'var(--teal-lite)', letterSpacing:'.08em', textTransform:'uppercase' }}>Staff Portal</div>
          </div>
        </div>

        {/* User card */}
        <div style={{ padding:'12px 12px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:rs.bg, border:`1.5px solid ${rs.c}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:rs.c, flexShrink:0 }}>
                {user?.fullName?.[0]}
              </div>
              <div style={{ overflow:'hidden', minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.fullName}</div>
                <div style={{ fontSize:10, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.designation}</div>
              </div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:rs.bg, borderRadius:20, padding:'3px 10px', border:`1px solid ${rs.c}20` }}>
              <span style={{ fontSize:11 }}>{rs.icon}</span>
              <span style={{ fontSize:10, fontWeight:600, color:rs.c }}>{rs.label}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          <p style={{ fontSize:9, fontWeight:600, color:'var(--text3)', letterSpacing:'.1em', textTransform:'uppercase', padding:'4px 8px 8px' }}>Main Menu</p>
          {NAV.filter(n=>n.roles.includes(user?.role)).map(item => (
            <NavLink key={item.to} to={item.to} onClick={()=>setSidebarOpen(false)}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:9, padding:'9px 10px',
                borderRadius:'var(--r-sm)', marginBottom:2, textDecoration:'none',
                color:isActive?'var(--teal-lite)':'var(--text2)',
                background:isActive?'var(--teal-glow)':'transparent',
                border:isActive?'1px solid rgba(34,211,238,.18)':'1px solid transparent',
                fontWeight:isActive?600:400, fontSize:13, transition:'all .15s',
              })}>
              <Icon d={item.icon}/> {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Session timer + logout */}
        <div style={{ padding:'10px 12px', borderTop:'1px solid var(--border)' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', padding:'9px 12px', marginBottom:8 }}>
            <div style={{ fontSize:9, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Session Expires</div>
            <div style={{ fontFamily:'var(--mono)', fontSize:18, fontWeight:500, color:timerColor }}>{fmtTimer()}</div>
          </div>
          <button onClick={handleLogout} disabled={busy}
            style={{ width:'100%', padding:'8px', background:'transparent', border:'1px solid var(--border2)', borderRadius:'var(--r-sm)', color:'var(--text2)', fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .2s', fontFamily:'var(--font)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
            onMouseOver={e=>{ e.currentTarget.style.background='var(--red-bg)'; e.currentTarget.style.color='var(--red)'; e.currentTarget.style.borderColor='rgba(239,68,68,.3)'; }}
            onMouseOut={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.borderColor='var(--border2)'; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            {busy?'Signing out...':'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-content" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Mobile topbar */}
        <div className="mobile-topbar" style={{ display:'none', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--bg1)', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <button onClick={()=>setSidebarOpen(s=>!s)}
            style={{ background:'none', border:'none', color:'var(--text2)', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ width:28, height:28, borderRadius:7, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🏥</div>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Crescent Medical</div>
          <div style={{ marginLeft:'auto', fontFamily:'var(--mono)', fontSize:13, color:timerColor }}>{fmtTimer()}</div>
        </div>

        <main style={{ flex:1, overflowY:'auto', background:'var(--bg0)' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
