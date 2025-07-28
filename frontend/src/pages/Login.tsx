// File: frontend/src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AppRole = 'admin' | 'user';

interface RawLoginResponse {
  session?: {
    access_token: string;
    // …other session fields
  };
  user?: {
    // Supabase’s auth user object (we ignore its “role”:authenticated field)
  };
  error?: string;
}

interface UserProfile {
  role: AppRole;
  // …other profile fields
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // 🔍 Debug to confirm mount
  useEffect(() => {
    console.log('Login component mounted');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1) Authenticate
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('HTTP status:', res.status);
      const raw: RawLoginResponse = await res.json();
      console.log('Login response:', raw);

      if (!res.ok) {
        throw new Error(raw.error || 'Login failed');
      }

      // 2) Extract token from session
      const token = raw.session?.access_token;
      if (!token) {
        throw new Error('No access_token in login response');
      }
      localStorage.setItem('authToken', token);

      // 3) Fetch your app‑level profile (contains the real “role”)
      const profileRes = await fetch('http://localhost:3001/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileRes.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const profile: UserProfile = await profileRes.json();
      console.log('User profile:', profile);

      localStorage.setItem('userRole', profile.role);

      // 4) Redirect
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
