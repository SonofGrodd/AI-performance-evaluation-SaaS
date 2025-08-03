import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signup.module.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

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
      // TODO: connect this with your backend/signup API
      console.log('Creating account with:', email, password);
      // Simulate success
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
          <div className={styles.brandText}>Fredan</div>
        </div>

        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.subtext}>
          Sign up to explore intelligent employee performance insights.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.orText}>OR</span>
          <div className={styles.dividerLine} />
        </div>

        <div className={styles.socials}>
          <button className={styles.socialBtn}>
            <img src="/google-logo.svg" alt="Google" />
            Continue with Google
          </button>
          <button className={styles.socialBtn}>
            <img src="/apple-logo-black.svg" alt="Apple" />
            Continue with Apple
          </button>
        </div>

        <p className={styles.redirectPrompt}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.testimonial}>
          <h2 className={styles.testHeading}>
            Built for high-performing teams
          </h2>
          <p className={styles.quote}>
            Fredan makes it effortless to monitor growth, track engagement, and
            align performance with company goals.
          </p>
          <div className={styles.author}>
            <img src="/michael-carter.jpg" alt="Michael Carter" />
            <div>
              <p className={styles.authorName}>Michael Carter</p>
              <p className={styles.authorTitle}>Engineering Lead at DevCore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
