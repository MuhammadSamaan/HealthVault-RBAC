import { useEffect, useState, useCallback } from 'react';
import { api } from '../context/AuthContext';

const OC = {
  SUCCESS: { c:'var(--green)',    bg:'var(--green-bg)',            bd:'rgba(34,197,94,.2)'   },
  FAILED:  { c:'var(--red)',      bg:'var(--red-bg)',              bd:'rgba(239,68,68,.2)'   },
  BLOCKED: { c:'var(--red)',      bg:'var(--red-bg)',              bd:'rgba(239,68,68,.2)'   },
  DENIED:  { c:'var(--amber)',    bg:'var(--amber-bg)',            bd:'rgba(245,158,11,.2)'  },
  INFO:    { c:'var(--teal-lite)',bg:'rgba(34,211,238,.1)',        bd:'rgba(34,211,238,.2)'  },
};

export default function AuditPage() {
  const [logs,    setLogs]    = useState([]);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [live,    setLive]    = useState(true);

  const load = useCallback(() => {
    Promise.all([api.get('/audit'), api.get('/audit/stats')])
      .then(([l,s]) => { setLogs(l.data.logs); setStats(s.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!live) return;
    const iv = setInterval(load, 3000);
    return () => clearInterval(iv);
  }, [live, load]);

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🔍</div>
          <div>
            <p style={{ fontSize:10, fontWeight:500, color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>CMO Access Only</p>
            <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>Security Audit Log</h1>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setLive(l => !l)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)', border:`1px solid ${live?'rgba(34,197,94,.4)':'var(--border2)'}`, background:live?'var(--green-bg)':'transparent', color:live?'var(--green)':'var(--text2)', borderRadius:'var(--r-sm)', transition:'all .2s' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:live?'var(--green)':'var(--text3)', display:'inline-block', animation:live?'pulse 1.5s infinite':'' }} />
            {live ? 'Live' : 'Auto-Refresh'}
          </button>
          <button onClick={load}
            style={{ padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)', border:'1px solid var(--border2)', background:'transparent', color:'var(--text2)', borderRadius:'var(--r-sm)' }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:10, marginBottom:20 }}>
          {Object.entries(OC).map(([k,o]) => (
            <div key={k} style={{ background:'var(--bg2)', border:`1px solid ${o.bd}`, borderRadius:'var(--r-md)', padding:'12px 14px' }}>
              <div style={{ fontSize:9, fontWeight:500, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{k}</div>
              <div style={{ fontSize:24, fontWeight:700, color:o.c, fontFamily:'var(--mono)' }}>{stats.byOutcome?.[k] || 0}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
        <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>All Security Events</h3>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {live && (
              <span style={{ fontSize:11, color:'var(--green)', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', display:'inline-block', animation:'pulse 1.5s infinite' }} />
                Live
              </span>
            )}
            <span style={{ fontSize:11, color:'var(--text3)', background:'var(--bg2)', padding:'2px 10px', borderRadius:20, border:'1px solid var(--border)', fontFamily:'var(--mono)' }}>{logs.length} events</span>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:560 }}>
            <thead>
              <tr style={{ background:'var(--bg2)' }}>
                {['Timestamp','Event','User','IP Address','Details','Outcome'].map(h => (
                  <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10, fontWeight:500, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan="6" style={{ padding:24, textAlign:'center', color:'var(--text3)' }}>Loading audit data...</td></tr>
                : logs.length === 0
                  ? <tr><td colSpan="6" style={{ padding:28, textAlign:'center', color:'var(--text3)', fontSize:13 }}>No events yet. Login attempts will appear here automatically.</td></tr>
                  : logs.map(log => {
                    const o = OC[log.outcome] || OC.INFO;
                    return (
                      <tr key={log.id} style={{ borderBottom:'1px solid var(--border)', transition:'background .1s' }}
                        onMouseOver={e => e.currentTarget.style.background='var(--bg2)'}
                        onMouseOut={e  => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'10px 14px', fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)', whiteSpace:'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={{ padding:'10px 14px' }}><span style={{ fontSize:11, fontWeight:600, color:'var(--text2)', fontFamily:'var(--mono)' }}>{log.event}</span></td>
                        <td style={{ padding:'10px 14px', fontSize:12, fontWeight:600, color:'var(--teal-lite)', whiteSpace:'nowrap' }}>{log.username}</td>
                        <td style={{ padding:'10px 14px', fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)' }}>{log.ip}</td>
                        <td style={{ padding:'10px 14px', fontSize:12, color:'var(--text2)', maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.details}</td>
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ fontSize:10, fontWeight:700, color:o.c, background:o.bg, border:`1px solid ${o.bd}`, padding:'3px 9px', borderRadius:20, fontFamily:'var(--mono)', whiteSpace:'nowrap' }}>{log.outcome}</span>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
