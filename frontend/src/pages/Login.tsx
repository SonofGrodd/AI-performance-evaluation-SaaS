// File: frontend/src/pages/Login.tsx
import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-4 py-2 border rounded"
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
