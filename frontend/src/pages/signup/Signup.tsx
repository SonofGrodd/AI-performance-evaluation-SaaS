import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signup.module.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirm) {
      setError('All fields are required');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with real signup API call
      console.log('📝 Creating account with', { email, password });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <img src="/logo.svg" alt="Fredan" className={styles.brandLogo} />
        </div>

        <h1 className={styles.heading}>Join Fredan</h1>
        <p className={styles.subtext}>
          Sign up to gain access to your intelligent performance dashboard.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                placeholder="Create a password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                placeholder="Confirm password"
                className={styles.input}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span style={{ marginLeft: 8 }}>Creating account…</span>
              </>
            ) : (
              'Sign Up'
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
          Already have an account?{' '}
          <span
            style={{ color: '#0f3446', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.testimonialBlock}>
          <h1 className={styles.testHeading}>
            Power your career with smart insights
          </h1>
          <p className={styles.quote}>
            "Fredan gives every team member clarity and direction. Our onboarding, feedback, and reviews
            are more meaningful and results-driven than ever before."
          </p>
          <div className={styles.author}>
            <img src="/img/susan.jpg" alt="Susan" className={styles.authorImg} />
            <div className={styles.authorInfo}>
              <p className={styles.authorName}>Susan Evans</p>
              <p className={styles.authorTitle}>HR Director, NovaTech</p>
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

export default Signup;
