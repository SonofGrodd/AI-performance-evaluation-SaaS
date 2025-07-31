import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login/login.module.css';

type AppRole = 'admin' | 'user';

interface RawLoginResponse {
  session?: { access_token: string };
  error?: string;
}

interface UserProfile {
  role: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    console.log('🔍 Login mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const authRes = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const authJson = authRes.headers.get('content-type')?.includes('application/json')
        ? (await authRes.json()) as RawLoginResponse
        : null;

      if (!authRes.ok || !authJson?.session?.access_token) {
        const msg = authJson?.error || `Login failed (${authRes.status})`;
        throw new Error(msg);
      }

      const token = authJson.session.access_token;
      localStorage.setItem('authToken', token);

      const profRes = await fetch('http://localhost:3001/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profJson = await profRes.json() as UserProfile;
      if (!profRes.ok || typeof profJson.role !== 'string') {
        throw new Error(`Failed to fetch profile (${profRes.status})`);
      }

      const mappedRole: AppRole = profJson.role === 'user' ? 'user' : 'admin';
      localStorage.setItem('userRole', mappedRole);

      if (mappedRole === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goSignup = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.spacer} />
        <div className={styles.signupWrapper}>
          <div className={styles.prompt}>Need to create an account?</div>
          <button
            className={styles.signupButton}
            onClick={goSignup}
            aria-label="Sign up"
            type="button"
          >
            <span className={styles.icon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="9" r="3" fill="currentColor" />
                <path
                  d="M6 19c0-2.761 4.477-5 10-5s10 2.239 10 5v1H6v-1z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className={styles.signupText}>Sign up</span>
          </button>
        </div>
      </div>

      <div className={styles.centerWrapper}>
        <div className={styles.card}>
          <h3 className={styles.heading}>Welcome back</h3>

          <div className={styles.oauthSection}>
            <button type="button" className={styles.oauthBtn}>
              <span className={styles.oauthIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" rx="1" />
                  <rect x="15" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" rx="1" />
                  <rect x="3" y="15" width="6" height="6" stroke="currentColor" strokeWidth="2" rx="1" />
                  <rect x="11" y="11" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="11" width="2" height="2" fill="currentColor" />
                  <rect x="11" y="14" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="14" width="2" height="2" fill="currentColor" />
                </svg>
              </span>
              <span className={styles.oauthText}>Continue with QR code</span>
            </button>
            <button type="button" className={styles.oauthBtn}>
              <span className={styles.oauthIcon}>
                <img src="/Google_g_logo.svg" alt="Google" className={styles.googleLogo} />
              </span>
              <span className={styles.oauthText}>Continue with Google</span>
            </button>
          </div>

          <div className={styles.orDivider}>
            <div className={styles.line} />
            <div className={styles.orText}>Or</div>
            <div className={styles.line} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && <div className={styles.error}>{error}</div>}
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <div className={styles.helpText}>
            Having trouble logging in?{' '}
            <a href="#" className={styles.link}>
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
