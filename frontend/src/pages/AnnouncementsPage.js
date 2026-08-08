import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';

const TAG_COLORS = {
  Facility: 'var(--teal-lite)', Meeting: 'var(--purple)', Protocol: 'var(--amber)',
  Emergency: 'var(--red)', General: 'var(--blue)', Research: 'var(--pink)',
};
const PRIORITY_STYLE = {
  urgent: { c:'var(--red)',      bg:'var(--red-bg)',   label:'🚨 Urgent'  },
  high:   { c:'var(--amber)',    bg:'var(--amber-bg)', label:'⚠ High'    },
  normal: { c:'var(--teal-lite)',bg:'rgba(34,211,238,.1)', label:'ℹ Normal' },
};
const ROLE_ICONS = { cmo:'👑', admin:'📋', doctor:'🩺', nurse:'💊', receptionist:'📞' };
const TAGS       = ['General','Facility','Meeting','Protocol','Emergency','Research'];
const PRIORITIES = ['normal','high','urgent'];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [anns,     setAnns]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState('All');
  const [msg,      setMsg]      = useState(null);
  const [form,     setForm]     = useState({ title:'', body:'', tag:'General', priority:'normal' });

  const canManage = ['cmo','admin'].includes(user?.role);

  const load = () => api.get('/hospital/announcements')
    .then(r => setAnns(r.data.announcements || []))
    .catch(() => {})
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault(); setMsg(null);
    try {
      await api.post('/hospital/announcements', form);
      setMsg({ ok:true, text:'Announcement posted successfully.' });
      setShowForm(false);
      setForm({ title:'', body:'', tag:'General', priority:'normal' });
      load();
    } catch(err) { setMsg({ ok:false, text:err.response?.data?.error || 'Failed to post announcement.' }); }
  };

  const deleteAnn = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await api.delete(`/hospital/announcements/${id}`).catch(() => {});
    load();
  };

  const filtered = filter === 'All' ? anns : anns.filter(a => a.tag === filter || a.priority === filter);

  const inp = { width:'100%', padding:'9px 11px', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--r-sm)', color:'var(--text1)', fontSize:13, fontFamily:'var(--font)', outline:'none', transition:'border-color .2s, box-shadow .2s' };
  const onF = e => { e.target.style.borderColor='var(--teal-mid)'; e.target.style.boxShadow='0 0 0 2px var(--teal-glow)'; };
  const onB = e => { e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none'; };
  const lbl = { display:'block', fontSize:11, fontWeight:500, color:'var(--text2)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.06em' };

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Page header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(168,85,247,.15)', border:'1px solid rgba(168,85,247,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📢</div>
          <div>
            <p style={{ fontSize:10, fontWeight:500, color:'var(--purple)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>Hospital Notices</p>
            <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>Announcements</h1>
          </div>
        </div>
        {canManage && (
          <button onClick={() => { setShowForm(s => !s); setMsg(null); }}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:showForm?'var(--bg3)':'var(--purple)', color:'#fff', border:`1px solid ${showForm?'var(--border2)':'var(--purple)'}`, borderRadius:'var(--r-md)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s', fontFamily:'var(--font)', boxShadow:showForm?'none':'0 4px 12px rgba(168,85,247,.3)' }}>
            <span style={{ fontSize:15 }}>{showForm ? '✕' : '+'}</span>
            {showForm ? 'Close' : 'New Announcement'}
          </button>
        )}
      </div>

      {/* Who can post info box */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', marginBottom:18, flexWrap:'wrap' }}>
        <span style={{ fontSize:14 }}>ℹ️</span>
        <div style={{ fontSize:12, color:'var(--text2)' }}>
          <strong style={{ color:'var(--text1)' }}>Who can post:</strong>{' '}
          <span style={{ color:'#c084fc' }}>👑 CMO</span> and{' '}
          <span style={{ color:'#60a5fa' }}>📋 Administrator</span> can create and delete announcements.
          All other staff can read them.
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="fade-in" style={{ background:'var(--bg1)', border:'1px solid var(--border2)', borderRadius:'var(--r-lg)', padding:'clamp(16px,2vw,22px)', marginBottom:18, boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>📝</span>
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>Post New Announcement</h3>
          </div>
          {msg && (
            <div style={{ padding:'8px 12px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:12 }}>
              {msg.ok ? '✅' : '⚠'} {msg.text}
            </div>
          )}
          <form onSubmit={submit}>
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Title *</label>
              <input placeholder="Announcement title" style={inp} value={form.title} required onChange={e => setForm(x => ({...x, title:e.target.value}))} onFocus={onF} onBlur={onB} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Body *</label>
              <textarea placeholder="Full announcement content..." rows={4} style={{...inp, resize:'vertical', lineHeight:1.6}} value={form.body} required onChange={e => setForm(x => ({...x, body:e.target.value}))} onFocus={onF} onBlur={onB} />
            </div>
            <div className="form-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:12, alignItems:'end' }}>
              <div>
                <label style={lbl}>Category Tag</label>
                <select style={{...inp, cursor:'pointer'}} value={form.tag} onChange={e => setForm(x => ({...x, tag:e.target.value}))}>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Priority</label>
                <select style={{...inp, cursor:'pointer'}} value={form.priority} onChange={e => setForm(x => ({...x, priority:e.target.value}))}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <button type="submit" style={{ padding:'9px 20px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)', transition:'opacity .2s', whiteSpace:'nowrap' }}
                onMouseOver={e => e.currentTarget.style.opacity='.85'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
                📢 Post
              </button>
            </div>
          </form>
        </div>
      )}

      {msg && !showForm && (
        <div style={{ padding:'9px 13px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:14 }}>
          {msg.ok ? '✅' : '⚠'} {msg.text}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
        {['All', ...TAGS, 'urgent', 'high'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'4px 12px', borderRadius:20, border:`1px solid ${filter===f?'rgba(168,85,247,.5)':'var(--border)'}`, background:filter===f?'rgba(168,85,247,.15)':'transparent', color:filter===f?'var(--purple)':'var(--text2)', fontSize:11, fontWeight:filter===f?600:400, cursor:'pointer', transition:'all .15s', fontFamily:'var(--font)', textTransform:'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      {loading
        ? <div style={{ padding:28, textAlign:'center', color:'var(--text3)' }}>Loading announcements...</div>
        : filtered.length === 0
          ? <div style={{ padding:28, textAlign:'center', color:'var(--text3)', background:'var(--bg1)', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', fontSize:13 }}>No announcements found.</div>
          : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map((a, i) => {
                const tagColor  = TAG_COLORS[a.tag]  || 'var(--teal-lite)';
                const pStyle    = PRIORITY_STYLE[a.priority] || PRIORITY_STYLE.normal;
                return (
                  <div key={a.id} className="slide-in" style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderLeft:`3px solid ${tagColor}`, borderRadius:'var(--r-lg)', padding:'18px 20px', transition:'all .2s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor=`${tagColor}40`; e.currentTarget.style.borderLeftColor=tagColor; e.currentTarget.style.transform='translateY(-1px)'; }}
                    onMouseOut={e  => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.borderLeftColor=tagColor; e.currentTarget.style.transform='none'; }}>

                    {/* Top row */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10, flexWrap:'wrap' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, fontWeight:600, color:tagColor, background:`${tagColor}18`, padding:'3px 9px', borderRadius:20 }}>{a.tag}</span>
                        <span style={{ fontSize:11, fontWeight:600, color:pStyle.c, background:pStyle.bg, padding:'3px 9px', borderRadius:20 }}>{pStyle.label}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:11, color:'var(--text3)' }}>{new Date(a.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                        {canManage && (
                          <button onClick={() => deleteAnn(a.id, a.title)}
                            style={{ padding:'4px 10px', background:'var(--red-bg)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'var(--r-sm)', color:'var(--red)', fontSize:11, fontWeight:600, cursor:'pointer', transition:'opacity .2s' }}
                            onMouseOver={e => e.currentTarget.style.opacity='.7'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text1)', marginBottom:8, lineHeight:1.4 }}>{a.title}</h3>

                    {/* Body */}
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.75, marginBottom:12 }}>{a.body}</p>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:10, borderTop:'1px solid var(--border)' }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', background:'var(--teal-glow)', border:'1px solid rgba(34,211,238,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>
                        {ROLE_ICONS[a.authorRole] || '👤'}
                      </div>
                      <div>
                        <span style={{ fontSize:12, fontWeight:500, color:'var(--text1)' }}>{a.author}</span>
                        <span style={{ fontSize:11, color:'var(--text3)', marginLeft:6 }}>· {a.authorRole?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
      }
    </div>
  );
}
