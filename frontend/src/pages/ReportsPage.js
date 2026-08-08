import { useEffect, useState } from 'react';
import { useAuth, api } from '../context/AuthContext';

const DEPT = [
  { dept:'Cardiology',   patients:48, surgeries:12, recovered:38, fill:82, c:'var(--red)' },
  { dept:'ICU',          patients:15, surgeries:6,  recovered:10, fill:68, c:'var(--amber)' },
  { dept:'General Ward', patients:92, surgeries:8,  recovered:80, fill:88, c:'var(--teal-mid)' },
  { dept:'Maternity',    patients:34, surgeries:14, recovered:32, fill:94, c:'var(--pink)' },
  { dept:'Orthopedics',  patients:27, surgeries:18, recovered:22, fill:81, c:'var(--purple)' },
];

const MONTHLY = [
  { month:'Jan', admitted:120, discharged:112, critical:18 },
  { month:'Feb', admitted:134, discharged:128, critical:21 },
  { month:'Mar', admitted:145, discharged:138, critical:24 },
  { month:'Apr', admitted:138, discharged:132, critical:19 },
  { month:'May', admitted:156, discharged:144, critical:28 },
  { month:'Jun', admitted:142, discharged:130, critical:22 },
];

const SECURITY = [
  { label:'Authentication Accuracy',         value:98,  c:'var(--green)' },
  { label:'Privilege Escalation Prevention', value:100, c:'var(--teal-lite)' },
  { label:'Token Integrity Rate',            value:100, c:'var(--teal-lite)' },
  { label:'Lockout Effectiveness',           value:100, c:'var(--green)' },
  { label:'Audit Log Completeness',          value:100, c:'var(--teal-lite)' },
  { label:'Session Expiry Compliance',       value:100, c:'var(--green)' },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'cmo')
      api.get('/audit/stats').then(r => setStats(r.data)).catch(() => {});
  }, [user]);

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:20 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'var(--blue-bg)', border:'1px solid rgba(96,165,250,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📊</div>
        <div>
          <p style={{ fontSize:10, fontWeight:500, color:'var(--blue)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>CMO / Admin / Doctor</p>
          <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>Medical Reports & Analytics</h1>
        </div>
      </div>

      {/* CMO auth stats */}
      {user?.role === 'cmo' && stats && (
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[['Auth Events',stats.total||0,'📊','var(--teal-lite)'],['Logins',stats.byOutcome?.SUCCESS||0,'✅','var(--green)'],['Failed',(stats.byOutcome?.FAILED||0)+(stats.byOutcome?.BLOCKED||0),'❌','var(--red)'],['Denied',stats.byOutcome?.DENIED||0,'🚫','var(--amber)']].map(([l,v,ic,c])=>(
            <div key={l} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'14px 16px', display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{ic}</div>
              <div>
                <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:22, fontWeight:700, color:c, fontFamily:'var(--mono)' }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* Department load */}
        <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,20px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>🏥</span>
            <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Department Patient Load</h3>
          </div>
          {DEPT.map(d => (
            <div key={d.dept} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:500, color:'var(--text1)' }}>{d.dept}</span>
                <span style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)' }}>{d.fill}%</span>
              </div>
              <div style={{ height:7, background:'var(--bg3)', borderRadius:4, overflow:'hidden', marginBottom:5 }}>
                <div style={{ height:'100%', width:`${d.fill}%`, borderRadius:4, transition:'width .8s ease', background:d.c, boxShadow:`0 0 8px ${d.c}40` }} />
              </div>
              <div style={{ display:'flex', gap:12 }}>
                {[['🛏️',d.patients,'Patients'],['🔬',d.surgeries,'Surgeries'],['✅',d.recovered,'Recovered']].map(([ic,v,l])=>(
                  <span key={l} style={{ fontSize:11, color:'var(--text3)' }}>{ic} <strong style={{ color:'var(--text2)' }}>{v}</strong> {l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Monthly stats */}
        <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,20px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>📅</span>
            <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Monthly Admissions 2026</h3>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:260 }}>
              <thead>
                <tr>
                  {['Month','Admitted','Discharged','Critical'].map(h => (
                    <th key={h} style={{ padding:'7px 10px', textAlign:'left', fontSize:10, fontWeight:500, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHLY.map(m => (
                  <tr key={m.month} style={{ borderBottom:'1px solid var(--border)', transition:'background .1s' }}
                    onMouseOver={e => e.currentTarget.style.background='var(--bg2)'}
                    onMouseOut={e  => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'8px 10px', fontSize:12, fontWeight:600, color:'var(--text1)' }}>{m.month}</td>
                    <td style={{ padding:'8px 10px', fontSize:12, color:'var(--teal-lite)', fontFamily:'var(--mono)' }}>{m.admitted}</td>
                    <td style={{ padding:'8px 10px', fontSize:12, color:'var(--green)', fontFamily:'var(--mono)' }}>{m.discharged}</td>
                    <td style={{ padding:'8px 10px', fontSize:12, color:'var(--red)', fontFamily:'var(--mono)' }}>{m.critical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:14 }}>
            {[['Total Admitted','835','var(--teal-lite)'],['Total Discharged','784','var(--green)'],['Avg Critical/Mo','22','var(--red)']].map(([l,v,c])=>(
              <div key={l} style={{ background:'var(--bg2)', borderRadius:'var(--r-sm)', padding:'10px 12px', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:9, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:20, fontWeight:700, color:c, fontFamily:'var(--mono)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security metrics */}
      <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'clamp(14px,2vw,20px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <span style={{ fontSize:16 }}>🔐</span>
          <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>Security Performance Metrics</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
          {SECURITY.map(m => (
            <div key={m.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:12 }}>
                <span style={{ color:'var(--text2)' }}>{m.label}</span>
                <span style={{ fontWeight:700, color:m.c, fontFamily:'var(--mono)' }}>{m.value}%</span>
              </div>
              <div style={{ height:5, background:'var(--bg3)', borderRadius:3 }}>
                <div style={{ height:'100%', width:`${m.value}%`, background:m.c, borderRadius:3, transition:'width .8s', boxShadow:`0 0 6px ${m.c}40` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
