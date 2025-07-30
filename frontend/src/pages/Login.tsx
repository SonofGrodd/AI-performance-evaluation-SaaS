import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login/login.module.css';

type AppRole = 'admin' | 'user';
interface RawLoginResponse { session?: { access_token: string }; error?: string; }
interface UserProfile { role: string; }

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => console.log('🔍 Login component mounted'), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1) Authenticate
      const authRes = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const authText = await authRes.text();
      const authJson = authRes.headers.get('content-type')?.includes('application/json')
        ? (JSON.parse(authText) as RawLoginResponse)
        : null;
      if (!authRes.ok || !authJson?.session?.access_token) {
        throw new Error(authJson?.error || `Login failed (${authRes.status})`);
      }
      const token = authJson.session.access_token;
      localStorage.setItem('authToken', token);

      // 2) Fetch profile
      const profRes = await fetch('http://localhost:3001/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profJson = await profRes.json() as UserProfile;
      if (!profRes.ok || typeof profJson.role !== 'string') {
        throw new Error(`Failed to fetch profile (${profRes.status})`);
      }

      // 3) Map & store role
      const mappedRole: AppRole = profJson.role === 'user' ? 'user' : 'admin';
      localStorage.setItem('userRole', mappedRole);

      // 4) Redirect
      navigate(mappedRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
