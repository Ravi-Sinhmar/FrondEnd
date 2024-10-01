import React, { useState } from 'react';
const BACKEND_URL = 
  process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_URL
    : process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_PRODUCTION_BACKEND_URL
      : '';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      // Handle successful login (e.g., save token, redirect)
      console.log('Login successful:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 flex flex-col gap-5'>
      <h2 className='flex justify-center items-center text-4xl font-bold rounded-md '>Login</h2>
      <form className='flex flex-col gap-2 bg-blb px-2 py-2 rounded-md' onSubmit={handleSubmit}>
        <div className=' p-4 flex flex-col rounded-md'>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='rounded-sm'
          />
        </div>
        <div className='p-4 flex flex-col rounded-md'>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='rounded-sm'
          />
        </div>
        <button type="submit" disabled={loading} className='bg-blin flex w-full justify-center items-center text-lg font-bold rounded-md'>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
