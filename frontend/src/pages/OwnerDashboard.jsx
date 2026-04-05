import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OwnerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('listings');

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owners/listings');
      setListings(response.data);
      setError('');
    } catch (err) {
      setError('Unable to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/owner/listings');
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await api.delete(`/properties/${id}`);
      loadListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Owner dashboard</h1>
            <p className="mt-2 text-slate-400">Manage your PG and mess listings with edit, delete and view bookings.</p>
          </div>
          <Link to="/owner/create" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            Add new listing
          </Link>
        </div>
      </div>

      <div className="flex gap-3 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
            activeTab === 'listings'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Your Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
            activeTab === 'bookings'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">Loading...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-600 bg-rose-900/20 p-6 text-rose-200">{error}</div>
      ) : activeTab === 'listings' ? (
        listings.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">You have not added any listings yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
            {listings.map((property) => {
              const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
              const imageUrl = property.image.startsWith('http://localhost:5000')
                ? property.image.replace('http://localhost:5000', backendBaseUrl)
                : property.image.startsWith('https://localhost:5000')
                ? property.image.replace('https://localhost:5000', backendBaseUrl)
                : property.image.startsWith('http')
                ? property.image
                : property.image.startsWith('/uploads')
                ? `${backendBaseUrl}${property.image}`
                : property.image;
              return (
                <div key={property._id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-soft">
                  <img src={imageUrl} alt={property.title} className="h-44 w-full rounded-3xl object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'; }} />
                  <div className="mt-4 space-y-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{property.title}</h2>
                      <p className="text-sm text-slate-400">{property.location} · {property.college}</p>
                      <p className="text-sm text-slate-400">Contact: {property.contactNumber || 'Not provided'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-slate-700 px-3 py-1">{property.type}</span>
                      <span className="rounded-full border border-slate-700 px-3 py-1">{property.sharing}</span>
                      <span className="rounded-full border border-slate-700 px-3 py-1">₹{property.price}/mo</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Link
                        to={`/owner/edit/${property._id}`}
                        className="rounded-full bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="rounded-full border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">No bookings for your listings yet.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{booking.property.title}</h3>
                    <p className="text-sm text-slate-400">{booking.property.location} · {booking.property.college}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300"><span className="font-semibold">Booked by:</span> {booking.user.name}</p>
                      <p className="text-sm text-slate-400">{booking.user.email}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">₹{booking.amount}</span>
                  </div>
                  <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-slate-300">
                    <p className="text-sm"><span className="font-semibold">Payment:</span> {booking.paymentProvider}</p>
                    <p className="mt-1 text-sm"><span className="font-semibold">Reference:</span> {booking.paymentReference}</p>
                    <p className="mt-1 text-sm"><span className="font-semibold">Status:</span> {booking.paymentStatus}</p>
                  </div>
                  <p className="text-sm text-slate-400">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default OwnerDashboard;
