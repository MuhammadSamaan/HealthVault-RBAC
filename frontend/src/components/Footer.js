export default function Footer() {
  return (
    <div style={{ borderTop:'1px solid var(--border)', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, background:'var(--bg1)', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:20, height:20, borderRadius:5, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>🏥</div>
        <span style={{ fontSize:11, color:'var(--text3)' }}>Crescent Medical Center — Secure RBAC Portal v1.0</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--teal-lite)', animation:'pulse 2s infinite' }} />
        <span style={{ fontSize:11, fontWeight:600, color:'var(--teal-lite)' }}>Made by Muhammad Samaan</span>
      </div>
    </div>
  );
}
