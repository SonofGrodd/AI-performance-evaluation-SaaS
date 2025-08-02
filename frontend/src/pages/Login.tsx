import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login/login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    console.log('Login mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with actual auth logic/fetch
      console.log('Attempt login', { email, password });
      // simulate redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch (err: any) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <img src="/logo.svg" alt="SoftQA" className={styles.brandLogo} />
          <div style={{ fontWeight: 600, fontSize: 14 }}>SoftQA</div>
        </div>

        <h1 className={styles.heading}>Welcome Back!</h1>
        <p className={styles.subtext}>
          Sign in to access your dashboard and continue optimizing your QA process.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.iconLeft}>📧</span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`${styles.input} ${styles.withIcon}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.iconLeft}>🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                className={`${styles.input} ${styles.withIcon}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            {loading ? 'Signing in…' : 'Sign In'}
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
              <img src="/google-logo.svg" alt="Google" style={{ width: 16, height: 16 }} />
            </div>
            <div className={styles.socialText}>Continue with Google</div>
          </button>
          
        </div>

        <div className={styles.signupPrompt}>
          Don’t have an Account?{' '}
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
          <h2 className={styles.testHeading}>
            Revolutionize QA with <br />
            Smarter Automation
          </h2>
          <p className={styles.quote}>
            SoftQA has completely transformed our testing process. It’s reliable,
            efficient, and ensures our releases are always top-notch.
          </p>
          <div className={styles.author}>
            <img
              src="/michael-carter.jpg"
              alt="Michael Carter"
              className={styles.authorImg}
            />
            <div className={styles.authorInfo}>
              <p className={styles.authorName}>Michael Carter</p>
              <p className={styles.authorTitle}>
                Software Engineer at DevCore
              </p>
            </div>
          </div>
        </div>

        <div className={styles.partners}>
          <div style={{ flex: '1 0 100%', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 }}>
            JOIN 1K TEAMS
          </div>
          <img src="/logos/discord.svg" alt="Discord" className={styles.partnerLogo} />
          <img src="/logos/mailchimp.svg" alt="Mailchimp" className={styles.partnerLogo} />
          <img src="/logos/grammarly.svg" alt="Grammarly" className={styles.partnerLogo} />
          <img src="/logos/attentive.svg" alt="Attentive" className={styles.partnerLogo} />
          <img src="/logos/hellosign.svg" alt="HelloSign" className={styles.partnerLogo} />
          <img src="/logos/intercom.svg" alt="Intercom" className={styles.partnerLogo} />
          <img src="/logos/square.svg" alt="Square" className={styles.partnerLogo} />
          <img src="/logos/dropbox.svg" alt="Dropbox" className={styles.partnerLogo} />
        </div>
      </div>
    </div>
  );
};

export default Login;
