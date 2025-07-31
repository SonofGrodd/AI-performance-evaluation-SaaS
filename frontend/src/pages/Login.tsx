import React, { useState, useEffect } from 'react';
import styles from './login/login.module.css';
<link
    href="https://fonts.googleapis.com/css2?family=Matter:wght@400;500;700;900&display=swap"
    rel="stylesheet"
  />

const Login: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => console.log('🔍 Login component mounted'), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up your login logic (email + password) here
    console.log('Logging in with', { email, password });
  };

  return (
    <div className={styles.container}>
      <img src="/slack-logo.svg" alt="Slack" className={styles.logo} />

      <h1 className={styles.title}>
        Enter your login credentials to sign in
      </h1>
      <p className={styles.subtitle}>
        Or choose another way to sign in.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="name@work-email.com"
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
        <button type="submit" className={styles.button}>
          Sign in
        </button>
      </form>

      <div className={styles.divider}>OR SIGN IN WITH</div>
      <div className={styles.oauthButtons}>
        <button className={styles.oauthButton}>
          <img src="/Google_g_logo.svg" alt="Google" />
          Google
        </button>
        <button className={styles.oauthButton}>
          <img src="/Apple_logo_black.svg" alt="Apple" />
          Apple
        </button>
      </div>

      <p className={styles.help}>
        Having trouble?{' '}
        <a href="#">Try entering a workspace URL</a>
      </p>

      <div className={styles.footer}>
        <a href="#">Privacy & terms</a>·
        <a href="#">Contact us</a>·
        <a href="#">Change region</a>
      </div>
    </div>
  );
};

export default Login;
