// File: frontend/src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AppRole = 'admin' | 'user';

interface RawLoginResponse {
  session?: { access_token: string };
  error?: string;
}

interface UserProfile {
  role: AppRole;
  // you can expand this if you return more fields later
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  useEffect(() => console.log('🔍 Login component mounted'), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1) Authenticate
      const authRes = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ email, password }),
      });
      const authText = await authRes.text();
      console.log('Login raw text:', authText);
      const authJson = authRes.headers.get('content-type')?.includes('application/json')
        ? JSON.parse(authText) as RawLoginResponse
        : null;

      if (!authRes.ok || !authJson?.session?.access_token) {
        const msg = authJson?.error || `Login failed (${authRes.status})`;
        throw new Error(msg);
      }

      const token = authJson.session.access_token;
      localStorage.setItem('authToken', token);

      // 2) Fetch profile
      const profRes = await fetch('http://localhost:3001/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profText = await profRes.text();
      console.log('Profile raw text:', profText);

      const profJson = profRes.headers.get('content-type')?.includes('application/json')
        ? JSON.parse(profText) as UserProfile
        : null;

      if (!profRes.ok || !profJson) {
        throw new Error(`Failed to fetch profile (${profRes.status})`);
      }
      if (typeof profJson.role !== 'string') {
        throw new Error(`Profile response missing 'role': ${profText}`);
      }

      // 3) Store & redirect
      localStorage.setItem('userRole', profJson.role);
      if (profJson.role === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');

    } catch (err: any) {
      console.error('❌ Login error:', err);
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
