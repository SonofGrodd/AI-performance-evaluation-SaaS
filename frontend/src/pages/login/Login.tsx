// File: src/pages/login/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

type AppRole = 'admin' | 'user';

interface RawLoginResponse {
  session?: { access_token: string };
  error?: string;
}

interface UserProfile {
  role: string;
  email?: string;
}

const ADMIN_EMAIL_OVERRIDES = ['admin@yourdomain.com', 'manager@fredan.com']; // add any emergency override emails

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Early redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole') as AppRole | null;
    if (token && storedRole) {
      if (storedRole === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate
      const authRes = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const authJson = await authRes.json().catch(() => null) as RawLoginResponse | null;

      if (!authRes.ok || !authJson?.session?.access_token) {
        const msg = authJson?.error || `Login failed (${authRes?.status})`;
        throw new Error(msg);
      }

      const token = authJson.session!.access_token;
      localStorage.setItem('authToken', token);

      // 2. Fetch profile
      const profRes = await fetch('http://localhost:3001/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profRes.ok) {
        const txt = await profRes.text();
        throw new Error(`Failed to fetch profile (${profRes.status}): ${txt}`);
      }

      const profJson = (await profRes.json()) as UserProfile;
      console.log('Profile returned:', profJson);

      // 3. Determine role
      let mappedRole: AppRole = 'user';

      if (profJson.role && profJson.role.toLowerCase() === 'admin') {
        mappedRole = 'admin';
      } else if (ADMIN_EMAIL_OVERRIDES.includes(email.toLowerCase())) {
        // fallback override for known admin emails (temporary)
        mappedRole = 'admin';
        console.warn('Using email override to treat as admin for', email);
      }

      localStorage.setItem('userRole', mappedRole);

      // 4. Redirect
      if (mappedRole === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <img src="/logo.svg" alt="Fredan" className={styles.brandLogo} />
          <div style={{ fontWeight: 600, fontSize: 14 }}></div>
        </div>

        <h1 className={styles.heading}>Welcome Back!</h1>
        <p className={styles.subtext}>
         Sign in to your dashboard and continue elevating employee performance.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.iconLeft}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="email"> <path id="vector" d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#114350" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_2" d="M18.7698 7.7688L13.2228 12.0551C12.5025 12.6116 11.4973 12.6116 10.777 12.0551L5.22998 7.7688" stroke="#114350" stroke-width="1.5" stroke-linecap="round"></path> </g> </g> </g></svg></span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`${styles.input} ${styles.withIcon}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.iconLeft}><svg viewBox="0 0 24 24" width='16' height='16' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="lock-line"> <path id="vector" d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8" stroke="#114350" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_2" d="M2 13C2 10.2386 4.23858 8 7 8H17C19.7614 8 22 10.2386 22 13V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V13Z" stroke="#114350" stroke-width="1.5"></path> <path id="vector_3" d="M12 13V17" stroke="#114350" stroke-width="1.5" stroke-linecap="round"></path> </g> </g> </g></svg></span>
              <input
                type="password"
                placeholder="Enter your password"
                className={`${styles.input} ${styles.withIcon}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
          </div>

          <div className={styles.actionsRow}>
            <div />
            <a href="#" className={styles.forgot}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span style={{ marginLeft: 8 }}>Signing in…</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.orText}>OR</div>
          <div className={styles.dividerLine} />
        </div>

        <div className={styles.socials}>
          <button type="button" className={styles.socialBtn}>
            <div className={styles.socialIcon}>
              <img src="/img/Google_g_logo.svg" alt="Google" style={{ width: 16, height: 16 }} />
            </div>
            <div className={styles.socialText}>Continue with Google</div>
          </button>

        </div>

        <div className={styles.signupPrompt}>
          Don’t have an account?{' '}
          <span
            style={{ color: '#0f3446', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.testimonialBlock}>
          <h1 className={styles.testHeading}>
           Transform Employee Performance with AI Solutions
          </h1><br></br>
          <p className={styles.quote}>
          "Fredan surfaces strengths and areas for growth so your team can thrive.
          Since adopting Fredan, our review cycle became more actionable and team engagement rose significantly."
          </p>
          <div className={styles.author}>
            <img
              src="img/elon.jpg"
              alt="elon"
              className={styles.authorImg}
            />
            <div className={styles.authorInfo}>
              <p className={styles.authorName}>Elon Musk</p>
              <p className={styles.authorTitle}>
                Tesla CEO
              </p>
            </div>
          </div>
        </div>

        <div className={styles.partners}>
          <div style={{ flex: '1 0 100%', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 }}>
            JOIN 1K TEAMS
          </div>
          <img src="/img/discord.svg" alt="Discord" className={styles.partnerLogo} />
          <img src="/img/mailchimp.svg" alt="Mailchimp" className={styles.partnerLogo} />
          <img src="/img/grammarly.svg" alt="Grammarly" className={styles.partnerLogo} />
          <img src="/img/intercom.svg" alt="Intercom" className={styles.partnerLogo} />
          <img src="/img/dropbox.svg" alt="Dropbox" className={styles.partnerLogo} />
        </div>
      </div>
    </div>
  );
};

export default Login;
