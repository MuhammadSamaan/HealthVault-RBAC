import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SessionModal() {
  const { showExpiry, setShowExpiry, logout, fmtTimer } = useAuth();
  const navigate = useNavigate();
  if (!showExpiry) return null;
  const isExpired = showExpiry === 'expired';
  const handleLogout = async () => { setShowExpiry(false); await logout(); navigate('/login'); };
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.78)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div className="fade" style={{ width:'100%', maxWidth:400, background:'var(--bg2)', border:`1px solid ${isExpired?'rgba(239,68,68,.4)':'rgba(245,158,11,.4)'}`, borderRadius:'var(--r-xl)', padding:30, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ width:50, height:50, borderRadius:'50%', background:isExpired?'var(--red-bg)':'var(--amber-bg)', border:`1px solid ${isExpired?'rgba(239,68,68,.3)':'rgba(245,158,11,.3)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:14 }}>
          {isExpired?'🔒':'⏱️'}
        </div>
        <h2 style={{ fontSize:17, fontWeight:700, color:'var(--text1)', marginBottom:8 }}>{isExpired?'Session Expired':'Session Expiring Soon'}</h2>
        <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7, marginBottom:22 }}>
          {isExpired ? 'Your session has expired. Please sign in again to continue.' : `Your session expires in ${fmtTimer()}. Stay signed in?`}
        </p>
        <div style={{ display:'flex', gap:10 }}>
          {!isExpired && <button onClick={()=>setShowExpiry(false)} style={{ flex:1, padding:'10px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'var(--r-md)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)' }}>Stay Signed In</button>}
          <button onClick={handleLogout} style={{ flex:1, padding:'10px', background:isExpired?'var(--teal)':'var(--red-bg)', color:isExpired?'#fff':'var(--red)', border:`1px solid ${isExpired?'transparent':'rgba(239,68,68,.3)'}`, borderRadius:'var(--r-md)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)' }}>
            {isExpired?'Sign In Again':'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
