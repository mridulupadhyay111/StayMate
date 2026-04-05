import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { saveAuth } from '../utils/auth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', form);
      saveAuth(response.data.token, response.data.user);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 rounded-[2rem] bg-slate-950/90 p-8 shadow-soft border border-slate-800">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Welcome back</p>
          <h1 className="text-4xl font-bold text-white">Login and get closer to safe, student-friendly homes.</h1>
          <p className="text-slate-400">Sign in with your student or owner account and experience animated comfort with every step.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/90 p-5 text-slate-300 shadow-soft animate-float">
              <p className="text-sm text-cyan-300">Students</p>
              <p className="mt-2 text-lg font-semibold text-white">Browse PGs & Mess</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5 text-slate-300 shadow-soft animate-float">
              <p className="text-sm text-cyan-300">Owners</p>
              <p className="mt-2 text-lg font-semibold text-white">Manage listings with ease</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-white">Secure login</h2>
          <p className="mt-2 text-slate-400">Enter your credentials and continue toward your next safe stay.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button className="w-full rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400">
              Login
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-400">
            New here?{' '}
            <Link to="/signup" className="text-cyan-300 hover:text-cyan-200">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
