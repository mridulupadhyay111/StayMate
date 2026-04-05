import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditListingPage = () => {
  const { id } = useParams();
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
  const [currentImage, setCurrentImage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        const property = response.data;
        setForm({
          title: property.title,
          description: property.description,
          type: property.type,
          sharing: property.sharing,
          price: property.price,
          college: property.college,
          location: property.location,
          contactNumber: property.contactNumber || '',
          nearbyColleges: property.nearbyColleges?.join(', ') || '',
        });
        const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
        setCurrentImage(
          property.image.startsWith('http://localhost:5000')
            ? property.image.replace('http://localhost:5000', backendBaseUrl)
            : property.image.startsWith('https://localhost:5000')
            ? property.image.replace('https://localhost:5000', backendBaseUrl)
            : property.image.startsWith('/uploads')
            ? `${backendBaseUrl}${property.image}`
            : property.image
        );
      } catch (error) {
        setMessage('Unable to load listing for editing.');
      }
    };
    loadProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      await api.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/owner/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-white">Edit listing</h1>
      <p className="mt-3 text-slate-400">Update details, upload a new image, or change nearby colleges.</p>
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
          Current image
          {currentImage && <img src={currentImage} alt="current property" className="rounded-3xl object-cover" />}
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Upload new cover image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-3"
          />
        </label>
        {message && <p className="text-sm text-rose-400">{message}</p>}
        <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Save changes</button>
      </form>
    </div>
  );
};

export default EditListingPage;
