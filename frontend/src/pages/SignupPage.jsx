import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { saveAuth } from '../utils/auth';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', college: '', contactNumber: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/signup', form);
      saveAuth(response.data.token, response.data.user);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-white">Create your StayMate account</h1>
      <p className="mt-3 text-slate-400">Register as student or owner to manage listings and bookings.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full px-4 py-3"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full px-4 py-3"
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
            className="mt-2 w-full px-4 py-3"
            placeholder="Choose a strong password"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="mt-2 w-full px-4 py-3"
          >
            <option value="user">Student</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Contact Number</label>
          <input
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            className="mt-2 w-full px-4 py-3"
            placeholder="Your contact number"
          />
        </div>
        {form.role === 'user' && (
          <div>
            <label className="text-sm text-slate-300">College</label>
            <input
              type="text"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className="mt-2 w-full px-4 py-3"
              placeholder="Your college name"
            />
          </div>
        )}
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Signup</button>
      </form>
      <p className="mt-5 text-sm text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Login here</Link>
      </p>
    </div>
  );
};

export default SignupPage;
