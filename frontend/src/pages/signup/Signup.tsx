import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signup.module.css';


const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState(''); // Changed from 'password' to 'confirmPassword'
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!email.trim() || !password.trim() || !confirm.trim()) {
    setError('All fields are required');
    return;
  }

  if (password !== confirm) {
    setError('Passwords do not match');
    return;
  }

  // Proceed to sign up
  console.log('✅ Proceeding to signup with', { email, password });
  // API call logic here...



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
    <span className={styles.iconLeft}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g><path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.7698 7.7688L13.2228 12.0551C12.5025 12.6116 11.4973 12.6116 10.777 12.0551L5.22998 7.7688" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" /></g>
      </svg>
    </span>
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
    <span className={styles.iconLeft}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 13C2 10.2386 4.23858 8 7 8H17C19.7614 8 22 10.2386 22 13V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V13Z" stroke="#114350" strokeWidth="1.5" />
        <path d="M12 13V17" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" /></g>
      </svg>
    </span>
    <input
      type="password"
      placeholder="Create a password"
      className={`${styles.input} ${styles.withIcon}`}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
</div>


        <div className={styles.inputGroup}>
  <label className={styles.label}>Confirm Password</label>
  <div className={styles.inputWrapper}>
    <span className={styles.iconLeft}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 13C2 10.2386 4.23858 8 7 8H17C19.7614 8 22 10.2386 22 13V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V13Z" stroke="#114350" strokeWidth="1.5" />
        <path d="M12 13V17" stroke="#114350" strokeWidth="1.5" strokeLinecap="round" /></g>
      </svg>
    </span>
    <input
      type="password"
      placeholder="Confirm Password"
      className={`${styles.input} ${styles.withIcon}`}
      value={password}
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
            style={{ color: '#0f3446', fontWeight: 500, cursor: 'pointer' }}
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
