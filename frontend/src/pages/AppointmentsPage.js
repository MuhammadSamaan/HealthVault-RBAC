import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';

const STATUS_STYLE = {
  Confirmed: { c:'var(--green)',    bg:'var(--green-bg)' },
  Pending:   { c:'var(--amber)',    bg:'var(--amber-bg)' },
  Cancelled: { c:'var(--red)',      bg:'var(--red-bg)'   },
  Completed: { c:'var(--teal-lite)',bg:'rgba(34,211,238,.1)' },
};
const TYPE_ICONS = { Consultation:'🩺','Follow-up':'🔄',ECG:'❤️',Surgery:'🔬','X-Ray':'📷',Vaccination:'💉','Blood Test':'🩸',Other:'📋' };
const DOCTORS     = ['Dr. Maryam Sheikh','Dr. Zainab Raza'];
const DEPARTMENTS = ['Cardiology','General','ICU','Maternity','Orthopedics','Neurology','Pediatrics','Emergency'];
const TYPES       = ['Consultation','Follow-up','ECG','Surgery','X-Ray','Vaccination','Blood Test','Other'];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appts,    setAppts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState('All');
  const [msg,      setMsg]      = useState(null);
  const [form,     setForm]     = useState({ patientName:'', patientAge:'', doctor:'Dr. Zainab Raza', department:'General', date:'', time:'', type:'Consultation', notes:'' });

  const canManage = ['cmo','admin','doctor','receptionist'].includes(user?.role);
  const load = () => api.get('/hospital/appointments').then(r=>setAppts(r.data.appointments||[])).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const submit = async e => {
    e.preventDefault(); setMsg(null);
    try {
      await api.post('/hospital/appointments', form);
      setMsg({ ok:true, text:`Appointment booked for ${form.patientName}` });
      setShowForm(false);
      setForm({ patientName:'', patientAge:'', doctor:'Dr. Zainab Raza', department:'General', date:'', time:'', type:'Consultation', notes:'' });
      load();
    } catch(err){ setMsg({ ok:false, text:err.response?.data?.error||'Failed to book appointment.' }); }
  };

  const updateStatus = async (id, status) => { await api.patch(`/hospital/appointments/${id}/status`,{status}).catch(()=>{}); load(); };
  const cancel       = async id => { if(!window.confirm('Cancel this appointment?')) return; await api.delete(`/hospital/appointments/${id}`).catch(()=>{}); load(); };

  const filtered = filter==='All' ? appts : appts.filter(a=>a.status===filter);
  const stats    = { total:appts.length, confirmed:appts.filter(a=>a.status==='Confirmed').length, pending:appts.filter(a=>a.status==='Pending').length, completed:appts.filter(a=>a.status==='Completed').length };

  const inp = { width:'100%', padding:'9px 11px', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--r-sm)', color:'var(--text1)', fontSize:13, fontFamily:'var(--font)', outline:'none', transition:'border-color .2s, box-shadow .2s' };
  const onF = e=>{ e.target.style.borderColor='var(--teal-mid)'; e.target.style.boxShadow='0 0 0 2px var(--teal-glow)'; };
  const onB = e=>{ e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none'; };
  const lbl = { display:'block', fontSize:11, fontWeight:500, color:'var(--text2)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.06em' };

  return (
    <div className="fade" style={{ padding:'clamp(16px,3vw,28px)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'var(--teal-glow)', border:'1px solid rgba(34,211,238,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🗓️</div>
          <div>
            <p style={{ fontSize:10, fontWeight:500, color:'var(--teal-lite)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>Patient Scheduling</p>
            <h1 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'var(--text1)' }}>Appointments</h1>
          </div>
        </div>
        {canManage && (
          <button onClick={()=>{ setShowForm(s=>!s); setMsg(null); }}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:showForm?'var(--bg3)':'var(--teal)', color:'#fff', border:`1px solid ${showForm?'var(--border2)':'var(--teal)'}`, borderRadius:'var(--r-md)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s', fontFamily:'var(--font)', boxShadow:showForm?'none':'0 4px 12px rgba(14,116,144,.3)' }}>
            <span style={{ fontSize:15 }}>{showForm?'✕':' +'}</span>
            {showForm?'Close':'Book Appointment'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:11, marginBottom:18 }}>
        {[['Total',stats.total,'📊','var(--teal-lite)'],['Confirmed',stats.confirmed,'✅','var(--green)'],['Pending',stats.pending,'⏳','var(--amber)'],['Completed',stats.completed,'🏁','var(--purple)']].map(([l,v,ic,c])=>(
          <div key={l} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{ic}</div>
            <div>
              <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color:c, fontFamily:'var(--mono)' }}>{v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking form */}
      {showForm && (
        <div className="fade-in" style={{ background:'var(--bg1)', border:'1px solid var(--border2)', borderRadius:'var(--r-lg)', padding:'clamp(16px,2vw,22px)', marginBottom:18, boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>📋</span>
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>Book New Appointment</h3>
          </div>
          {msg && <div style={{ padding:'8px 12px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:12 }}>{msg.ok?'✅':'⚠'} {msg.text}</div>}
          <form onSubmit={submit}>
            <div className="form-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:11, marginBottom:11 }}>
              <div><label style={lbl}>Patient Name *</label><input placeholder="Full name" style={inp} value={form.patientName} required onChange={e=>setForm(x=>({...x,patientName:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              <div><label style={lbl}>Age</label><input type="number" placeholder="Age" style={inp} value={form.patientAge} onChange={e=>setForm(x=>({...x,patientAge:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              <div><label style={lbl}>Doctor *</label><select style={{...inp,cursor:'pointer'}} value={form.doctor} onChange={e=>setForm(x=>({...x,doctor:e.target.value}))}>{DOCTORS.map(d=><option key={d}>{d}</option>)}</select></div>
            </div>
            <div className="form-grid-4" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:11, marginBottom:11 }}>
              <div><label style={lbl}>Department</label><select style={{...inp,cursor:'pointer'}} value={form.department} onChange={e=>setForm(x=>({...x,department:e.target.value}))}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label style={lbl}>Date *</label><input type="date" style={inp} value={form.date} required onChange={e=>setForm(x=>({...x,date:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              <div><label style={lbl}>Time *</label><input type="time" style={inp} value={form.time} required onChange={e=>setForm(x=>({...x,time:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
              <div><label style={lbl}>Type *</label><select style={{...inp,cursor:'pointer'}} value={form.type} onChange={e=>setForm(x=>({...x,type:e.target.value}))}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div style={{ marginBottom:14 }}><label style={lbl}>Notes</label><textarea placeholder="Optional notes..." rows={2} style={{...inp,resize:'vertical'}} value={form.notes} onChange={e=>setForm(x=>({...x,notes:e.target.value}))} onFocus={onF} onBlur={onB}/></div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" style={{ padding:'9px 22px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)', transition:'background .2s' }} onMouseOver={e=>e.currentTarget.style.background='var(--teal-mid)'} onMouseOut={e=>e.currentTarget.style.background='var(--teal)'}>✅ Confirm Booking</button>
              <button type="button" onClick={()=>setShowForm(false)} style={{ padding:'9px 16px', background:'transparent', color:'var(--text2)', border:'1px solid var(--border2)', borderRadius:'var(--r-sm)', fontSize:13, cursor:'pointer', fontFamily:'var(--font)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {msg && !showForm && <div style={{ padding:'9px 13px', borderRadius:'var(--r-sm)', background:msg.ok?'var(--green-bg)':'var(--red-bg)', border:`1px solid ${msg.ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, color:msg.ok?'var(--green)':'var(--red)', fontSize:12, marginBottom:14 }}>{msg.ok?'✅':'⚠'} {msg.text}</div>}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {['All','Confirmed','Pending','Completed','Cancelled'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:'5px 13px', borderRadius:20, border:`1px solid ${filter===s?'var(--teal-mid)':'var(--border)'}`, background:filter===s?'var(--teal-glow)':'transparent', color:filter===s?'var(--teal-lite)':'var(--text2)', fontSize:12, fontWeight:filter===s?600:400, cursor:'pointer', transition:'all .15s', fontFamily:'var(--font)' }}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading
        ? <div style={{ padding:28, textAlign:'center', color:'var(--text3)' }}>Loading appointments...</div>
        : filtered.length===0
          ? <div style={{ padding:28, textAlign:'center', color:'var(--text3)', background:'var(--bg1)', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', fontSize:13 }}>No appointments found for this filter.</div>
          : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filtered.map(a => {
                const ss = STATUS_STYLE[a.status]||STATUS_STYLE.Pending;
                return (
                  <div key={a.id} style={{ background:'var(--bg1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'14px 16px', transition:'all .2s', display:'flex', alignItems:'center', gap:13, flexWrap:'wrap' }}
                    onMouseOver={e=>{ e.currentTarget.style.borderColor='rgba(34,211,238,.2)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                    onMouseOut={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; }}>
                    <div style={{ width:42, height:42, borderRadius:11, background:'var(--teal-glow)', border:'1px solid rgba(34,211,238,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{TYPE_ICONS[a.type]||'📋'}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>{a.patientName}</span>
                        {a.patientAge && <span style={{ fontSize:11, color:'var(--text3)' }}>Age {a.patientAge}</span>}
                        <span style={{ fontSize:10, fontWeight:600, color:ss.c, background:ss.bg, padding:'2px 7px', borderRadius:20 }}>{a.status}</span>
                      </div>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, color:'var(--text2)' }}>🩺 {a.doctor}</span>
                        <span style={{ fontSize:12, color:'var(--text2)' }}>🏥 {a.department}</span>
                        <span style={{ fontSize:12, color:'var(--teal-lite)', fontFamily:'var(--mono)' }}>📅 {a.date} at {a.time}</span>
                        <span style={{ fontSize:12, color:'var(--text2)' }}>🏷️ {a.type}</span>
                      </div>
                      {a.notes && <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>💬 {a.notes}</div>}
                    </div>
                    {canManage && (
                      <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap' }}>
                        {a.status==='Pending'    && <button onClick={()=>updateStatus(a.id,'Confirmed')} style={{ padding:'5px 10px', background:'var(--green-bg)', border:'1px solid rgba(34,197,94,.2)', borderRadius:'var(--r-sm)', color:'var(--green)', fontSize:11, fontWeight:600, cursor:'pointer' }}>✓ Confirm</button>}
                        {a.status==='Confirmed'  && <button onClick={()=>updateStatus(a.id,'Completed')} style={{ padding:'5px 10px', background:'rgba(34,211,238,.1)', border:'1px solid rgba(34,211,238,.2)', borderRadius:'var(--r-sm)', color:'var(--teal-lite)', fontSize:11, fontWeight:600, cursor:'pointer' }}>✓ Complete</button>}
                        {a.status!=='Cancelled'  && <button onClick={()=>cancel(a.id)} style={{ padding:'5px 10px', background:'var(--red-bg)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'var(--r-sm)', color:'var(--red)', fontSize:11, fontWeight:600, cursor:'pointer' }}>✕ Cancel</button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
      }
    </div>
  );
}
