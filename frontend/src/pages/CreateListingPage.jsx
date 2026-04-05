import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'PG',
    sharing: 'Single',
    price: '',
    college: '',
    location: '',
    contactNumber: '',
    nearbyColleges: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      await api.post('/properties', formData);
      navigate('/owner/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Listing creation failed');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-white">Create a new listing</h1>
      <p className="mt-3 text-slate-400">Add your PG, hostel, flat or mess facility with college-specific details.</p>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3"
              placeholder="e.g. Cozy PG near campus"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Price per month
            <input
              required
              type="number"
              min="1000"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3"
              placeholder="₹"
            />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Type
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3"
            >
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
              <option value="Flat">Flat</option>
              <option value="Mess">Mess</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Sharing
            <select
              required
              value={form.sharing}
              onChange={(e) => setForm({ ...form, sharing: e.target.value })}
              className="w-full px-4 py-3"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Four+">Four+</option>
            </select>
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            College
            <input
              required
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className="w-full px-4 py-3"
              placeholder="College name"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Location
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3"
              placeholder="City or area"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-300">
          Contact Number
          <input
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            className="w-full px-4 py-3"
            placeholder="Your contact number for inquiries"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Nearby Colleges
          <input
            type="text"
            value={form.nearbyColleges}
            onChange={(e) => setForm({ ...form, nearbyColleges: e.target.value })}
            className="w-full px-4 py-3"
            placeholder="Comma-separated nearby colleges"
          />
          <p className="text-xs text-slate-500">e.g. Engineering College, Commerce College, Arts College</p>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Description
          <textarea
            required
            rows="5"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3"
            placeholder="Describe your listing and facilities"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Cover Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-3"
          />
        </label>
        {message && <p className="text-sm text-rose-400">{message}</p>}
        <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Publish listing</button>
      </form>
    </div>
  );
};

export default CreateListingPage;
