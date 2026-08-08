import { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';

const RS = {
  cmo:         { c:'#c084fc', bg:'rgba(168,85,247,.15)', label:'CMO' },
  admin:       { c:'#60a5fa', bg:'rgba(96,165,250,.15)',  label:'Admin' },
  doctor:      { c:'#22d3ee', bg:'rgba(34,211,238,.12)',  label:'Doctor' },
  nurse:       { c:'#4ade80', bg:'rgba(74,222,128,.12)',  label:'Nurse' },
  receptionist:{ c:'#fb923c', bg:'rgba(251,146,60,.12)',  label:'Receptionist' },
};

const DEPTS = ['Administration','Cardiology','General','ICU','Maternity','Orthopedics','Neurology','Pediatrics','Front Desk','Emergency'];

export default function StaffPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ username:'', email:'', password:'', role:'doctor', fullName:'', designation:'', department:'' });
  const [msg,     setMsg]     = useState(null);
  const [showPw,  setShowPw]  = useState(false);
  const [showForm,setShowForm]= useState(false);

  const load = () => api.get('/users').then(r => setUsers(r.data.users)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const register = async e => {
    e.preventDefault(); setMsg(null);
    try {
      await api.post('/auth/register', form);
      setMsg({ ok:true, text:`${form.fullName} registered as ${form.role}.` });
      setForm({ username:'', email:'', password:'', role:'doctor', fullName:'', designation:'', department:'' });
      setShowForm(false); load();
    } catch(err) { setMsg({ ok:false, text:err.response?.data?.error || 'Registration failed.' }); }
  };

  const inp = { width:'100%', padding:'9px 11px', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--r-sm)', color:'var(--text1)', fontSize:13, fontFamily:'var(--font)', outline:'none', transition:'border-color .2s, box-shadow .2s' };
  const onF = e => { e.target.style.borderColor='var(--teal-mid)'; e.target.style.boxShadow='0 0 0 2px var(--teal-glow)'; };
  const onB = e => { e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none'; };
  const lbl = { display:'block', fontSize:11, fontWeight:500, color:'var(--text2)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.06em' };

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'var(--green-bg)', border:'1px solid rgba(34,197,94,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>👥</div>
          <div>
            <p style={{ fontSize:10, fontWeight:500, color:'var(--green)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>CMO / Admin Access</p>
            <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>Staff Management</h1>
          </div>
        </div>
        <button onClick={() => { setShowForm(s => !s); setMsg(null); }}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:showForm?'var(--bg3)':'var(--teal)', color:'#fff', border:`1px solid ${showForm?'var(--border2)':'var(--teal)'}`, borderRadius:'var(--r-md)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s', fontFamily:'var(--font)', boxShadow:showForm?'none':'0 4px 12px rgba(14,116,144,.3)' }}>
          <span style={{ fontSize:15 }}>{showForm ? '✕' : '+'}</span>
          {showForm ? 'Close' : 'Register Staff'}
        </button>
      </div>

      {/* Register form */}
      {showForm && (
        <div className="fade-in" style={{ background:'var(--bg1)', border:'1px solid var(--border2)', borderRadius:'var(--r-lg)', padding:'clamp(16px,2vw,22px)', marginBottom:20, boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>➕</span>
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>Register New Staff Member</h3>
          </div>
          {msg && <div style={{ padding:'8px 12px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:12 }}>{msg.ok?'✅':'⚠'} {msg.text}</div>}
          <form onSubmit={register}>
            <div className="form-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:11, marginBottom:11 }}>
              {[['fullName','Full Name','text','Dr. Ayesha Khan'],['username','Username','text','ayesha.khan'],['email','Email','email','ayesha@crescentmed.com.pk']].map(([f,l,t,p])=>(
                <div key={f}><label style={lbl}>{l}</label><input type={t} placeholder={p} style={inp} value={form[f]} required onChange={e=>setForm(x=>({...x,[f]:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              ))}
            </div>
            <div className="form-grid-4" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:11, alignItems:'end' }}>
              <div><label style={lbl}>Designation</label><input placeholder="Senior Cardiologist" style={inp} value={form.designation} onChange={e=>setForm(x=>({...x,designation:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              <div><label style={lbl}>Department</label><select style={{...inp,cursor:'pointer'}} value={form.department} onChange={e=>setForm(x=>({...x,department:e.target.value}))}><option value="">Select...</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label style={lbl}>Role</label><select style={{...inp,cursor:'pointer'}} value={form.role} onChange={e=>setForm(x=>({...x,role:e.target.value}))}><option value="receptionist">Receptionist</option><option value="nurse">Nurse</option><option value="doctor">Doctor</option><option value="admin">Admin</option><option value="cmo">CMO</option></select></div>
              <div><label style={lbl}>Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPw?'text':'password'} placeholder="Min 8 chars" required style={{...inp,paddingRight:34}} value={form.password} onChange={e=>setForm(x=>({...x,password:e.target.value}))} onFocus={onF} onBlur={onB}/>
                  <button type="button" onClick={()=>setShowPw(s=>!s)} style={{ position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)',padding:2,fontSize:13 }}>{showPw?'🙈':'👁️'}</button>
                </div>
              </div>
              <button type="submit" style={{ padding:'9px 16px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'var(--font)', transition:'background .2s' }} onMouseOver={e=>e.currentTarget.style.background='var(--teal-mid)'} onMouseOut={e=>e.currentTarget.style.background='var(--teal)'}>Register</button>
            </div>
          </form>
        </div>
      )}

      {msg && !showForm && <div style={{ padding:'8px 12px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:14 }}>{msg.ok?'✅':'⚠'} {msg.text}</div>}

      {/* Staff table */}
      <div style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
        <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>All Staff Members</h3>
          <span style={{ fontSize:11, color:'var(--text3)', background:'var(--bg2)', padding:'2px 10px', borderRadius:20, border:'1px solid var(--border)', fontFamily:'var(--mono)' }}>{users.length} accounts</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:620 }}>
            <thead>
              <tr style={{ background:'var(--bg2)' }}>
                {['Staff Member','Role','Department','Status','Attempts','Actions'].map(h=>(
                  <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10, fontWeight:500, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan="6" style={{ padding:24, textAlign:'center', color:'var(--text3)' }}>Loading staff...</td></tr>
                : users.map(u => {
                  const r = RS[u.role] || RS.receptionist;
                  return (
                    <tr key={u.id} style={{ borderBottom:'1px solid var(--border)', transition:'background .1s' }}
                      onMouseOver={e=>e.currentTarget.style.background='var(--bg2)'}
                      onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'11px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background:r.bg, border:`1.5px solid ${r.c}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:r.c, flexShrink:0 }}>{u.fullName?.[0]}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>{u.fullName}</div>
                            <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)' }}>{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        <select value={u.role} onChange={e=>{ api.patch(`/users/${u.id}/role`,{role:e.target.value}).then(load).catch(()=>{}); }}
                          style={{ fontSize:11, fontWeight:600, color:r.c, background:r.bg, border:`1px solid ${r.c}30`, borderRadius:20, padding:'3px 9px', cursor:'pointer', outline:'none' }}>
                          <option value="receptionist">Receptionist</option>
                          <option value="nurse">Nurse</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                          <option value="cmo">CMO</option>
                        </select>
                      </td>
                      <td style={{ padding:'11px 14px', fontSize:12, color:'var(--text2)' }}>{u.department}</td>
                      <td style={{ padding:'11px 14px' }}>
                        <span style={{ fontSize:11, fontWeight:600, color:u.locked?'var(--red)':'var(--green)', background:u.locked?'var(--red-bg)':'var(--green-bg)', padding:'3px 9px', borderRadius:20 }}>
                          {u.locked ? '🔒 Locked' : '● Active'}
                        </span>
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        <div style={{ display:'flex', gap:3, alignItems:'center' }}>
                          {[1,2,3,4,5].map(i => <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:i<=u.failedAttempts?'var(--red)':'var(--bg3)' }} />)}
                          <span style={{ marginLeft:5, fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)' }}>{u.failedAttempts}/5</span>
                        </div>
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          {u.locked && <button onClick={()=>api.patch(`/users/${u.id}/unlock`).then(load).catch(()=>{})} style={{ padding:'4px 9px', background:'rgba(34,211,238,.1)', border:'1px solid rgba(34,211,238,.2)', borderRadius:5, color:'var(--teal-lite)', fontSize:11, fontWeight:600, cursor:'pointer' }}>Unlock</button>}
                          <button onClick={()=>{ if(window.confirm(`Remove ${u.fullName}?`)) api.delete(`/users/${u.id}`).then(load).catch(()=>{}); }} style={{ padding:'4px 9px', background:'var(--red-bg)', border:'1px solid rgba(239,68,68,.2)', borderRadius:5, color:'var(--red)', fontSize:11, fontWeight:600, cursor:'pointer' }}>Remove</button>
                        </div>
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
