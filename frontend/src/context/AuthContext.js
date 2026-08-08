import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Ctx = createContext(null);
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('crescent_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [token, setToken]           = useState(localStorage.getItem('crescent_token'));
  const [loading, setLoading]       = useState(true);
  const [seconds, setSeconds]       = useState(7200);
  const [showExpiry, setShowExpiry] = useState(false);
  const [expWarned, setExpWarned]   = useState(false);

  useEffect(() => {
    (async () => {
      const t = localStorage.getItem('crescent_token');
      if (!t) { setLoading(false); return; }
      try { const r = await api.get('/auth/me'); setUser(r.data); }
      catch { localStorage.removeItem('crescent_token'); setToken(null); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!token) return;
    setSeconds(7200); setExpWarned(false);
    const iv = setInterval(() => {
      setSeconds(s => {
        if (s === 300 && !expWarned) { setExpWarned(true); setShowExpiry('warning'); }
        if (s <= 1) { setShowExpiry('expired'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [token]);

  const login = async (username, password) => {
    const r = await api.post('/auth/login', { username, password });
    localStorage.setItem('crescent_token', r.data.token);
    setToken(r.data.token); setUser(r.data.user);
    setShowExpiry(false); setExpWarned(false);
    return r.data;
  };

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('crescent_token');
    setToken(null); setUser(null); setShowExpiry(false);
  }, []);

  const fmtTimer = () => {
    const h = Math.floor(seconds/3600);
    const m = Math.floor((seconds%3600)/60);
    const s = seconds%60;
    return h > 0 ? `${h}h ${m}m` : `${m}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <Ctx.Provider value={{ user, token, loading, login, logout, api, seconds, fmtTimer, showExpiry, setShowExpiry }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
export { api };
