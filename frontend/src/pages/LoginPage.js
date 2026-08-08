import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const ROLES = [
  { icon:'👑', label:'Chief Medical Officer', desc:'Full system authority',    c:'#c084fc' },
  { icon:'📋', label:'Administrator',          desc:'Operations management',   c:'#60a5fa' },
  { icon:'🩺', label:'Doctor',                 desc:'Patient care & records',  c:'#22d3ee' },
  { icon:'💊', label:'Nurse',                  desc:'Ward & patient monitoring',c:'#4ade80' },
  { icon:'📞', label:'Receptionist',           desc:'Front desk & scheduling', c:'#fb923c' },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(username.trim(), password); }
    catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      const rem = err.response?.data?.attemptsRemaining;
      setError(rem !== undefined ? `${msg}  (${rem} attempt${rem!==1?'s':''} left)` : msg);
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--r-md)', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none', transition:'border-color .2s, box-shadow .2s' };
  const onF = e => { e.target.style.borderColor='var(--teal-mid)'; e.target.style.boxShadow='0 0 0 3px var(--teal-glow)'; };
  const onB = e => { e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none'; };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg0)', display:'flex', flexDirection:'column' }}>

      {/* Top bar */}
      <div style={{ background:'var(--bg1)', borderBottom:'1px solid var(--border)', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 4px 12px rgba(14,116,144,.4)' }}>🏥</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text1)' }}>Crescent Medical Center</div>
            <div style={{ fontSize:10, color:'var(--teal-lite)', letterSpacing:'.1em', textTransform:'uppercase' }}>Secure Staff Management Portal</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--green-bg)', border:'1px solid rgba(34,197,94,.2)', borderRadius:20, padding:'5px 12px' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>System Online</span>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,40px) 16px' }}>
        <div style={{ width:'100%', maxWidth:980, display:'grid', gridTemplateColumns:'1fr 420px', gap:36, alignItems:'center' }}>

          {/* Left branding */}
          <div className="fade hide-mobile">
            <div style={{ marginBottom:28 }}>
              <div style={{ width:70, height:70, borderRadius:18, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, marginBottom:18, boxShadow:'0 8px 28px rgba(14,116,144,.4)' }}>🏥</div>
              <h1 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:700, color:'var(--text1)', lineHeight:1.2, letterSpacing:'-.02em', marginBottom:12 }}>
                Welcome to<br/><span style={{ color:'var(--teal-lite)' }}>Crescent Medical</span><br/>Center Portal
              </h1>
              <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.8, maxWidth:370 }}>
                A secure role-based access control system. Every login is verified, every action is logged, and every role is strictly enforced across all hospital systems.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {ROLES.map((r,i) => (
                <div key={r.label} className="fade" style={{ animationDelay:`${.08+i*.06}s`, display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:'var(--r-md)', background:'var(--bg2)', border:'1px solid var(--border)', transition:'all .2s', cursor:'default' }}
                  onMouseOver={e=>{ e.currentTarget.style.borderColor=`${r.c}45`; e.currentTarget.style.transform='translateX(5px)'; }}
                  onMouseOut={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:`${r.c}18`, border:`1px solid ${r.c}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{r.icon}</div>
                  <div><div style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>{r.label}</div><div style={{ fontSize:11, color:'var(--text2)' }}>{r.desc}</div></div>
                  <div style={{ marginLeft:'auto', width:7, height:7, borderRadius:'50%', background:r.c, flexShrink:0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Login card */}
          <div className="fade" style={{ animationDelay:'.1s' }}>
            <div style={{ background:'var(--bg1)', border:'1px solid var(--border2)', borderRadius:'var(--r-2xl)', padding:'clamp(22px,4vw,36px)', boxShadow:'var(--shadow-lg)' }}>

              {/* Form header */}
              <div style={{ textAlign:'center', marginBottom:22 }}>
                <div style={{ width:58, height:58, borderRadius:16, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 13px', boxShadow:'0 6px 18px rgba(14,116,144,.38)' }}>🏥</div>
                <h2 style={{ fontSize:19, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>Staff Sign In</h2>
                <p style={{ fontSize:12, color:'var(--text2)' }}>Enter your hospital credentials</p>
              </div>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
                <span style={{ fontSize:10, color:'var(--text3)', letterSpacing:'.1em' }}>SECURE ACCESS</span>
                <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
              </div>

              {error && (
                <div style={{ background:'var(--red-bg)', border:'1px solid rgba(239,68,68,.25)', borderLeft:'3px solid var(--red)', borderRadius:'var(--r-sm)', padding:'10px 13px', marginBottom:16, fontSize:13, color:'#fca5a5', lineHeight:1.5 }}>
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={submit}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--text2)', marginBottom:6 }}>Username</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, opacity:.5, pointerEvents:'none' }}>👤</span>
                    <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="e.g. maryam.sheikh" autoComplete="off" required style={{...inp, paddingLeft:36}} onFocus={onF} onBlur={onB} />
                  </div>
                </div>

                <div style={{ marginBottom:22 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--text2)', marginBottom:6 }}>Password</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, opacity:.5, pointerEvents:'none' }}>🔒</span>
                    <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" required style={{...inp, paddingLeft:36, paddingRight:42}} onFocus={onF} onBlur={onB} />
                    <button type="button" onClick={()=>setShowPw(s=>!s)}
                      style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:4, display:'flex', alignItems:'center', transition:'color .2s' }}
                      onMouseOver={e=>e.currentTarget.style.color='var(--teal-lite)'}
                      onMouseOut={e=>e.currentTarget.style.color='var(--text3)'}>
                      {showPw
                        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'12px', fontSize:14, fontWeight:600, background:loading?'var(--bg3)':'var(--teal)', color:loading?'var(--text3)':'#fff', border:'none', borderRadius:'var(--r-md)', cursor:loading?'not-allowed':'pointer', transition:'all .2s', fontFamily:'var(--font)', boxShadow:loading?'none':'0 4px 14px rgba(14,116,144,.35)' }}
                  onMouseOver={e=>{ if(!loading){ e.currentTarget.style.background='var(--teal-mid)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
                  onMouseOut={e=>{ if(!loading){ e.currentTarget.style.background='var(--teal)'; e.currentTarget.style.transform='none'; }}}>
                  {loading
                    ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                        <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'var(--text2)', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
                        Verifying credentials...
                      </span>
                    : '🔐  Sign In to Portal'
                  }
                </button>
              </form>

              <div style={{ marginTop:18, padding:'11px 13px', background:'var(--bg2)', borderRadius:'var(--r-md)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:9 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>📧</span>
                <div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>Forgot your password?</div>
                  <div style={{ fontSize:12, color:'var(--teal-lite)', fontWeight:500 }}>it-support@crescentmed.com.pk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
