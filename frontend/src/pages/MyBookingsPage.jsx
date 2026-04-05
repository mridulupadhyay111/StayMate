import { useEffect, useState } from 'react';
import api from '../services/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/bookings/my');
        setBookings(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-white">My bookings</h1>
        <p className="mt-2 text-slate-400">Track your recent PG and mess reservations.</p>
      </div>
      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">Loading bookings...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-600 bg-rose-900/20 p-6 text-rose-200">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">You have no bookings yet. Explore listings to book a stay.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {bookings.map((booking) => (
            <div key={booking._id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{booking.property.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{booking.property.location} · {booking.property.college}</p>
                </div>
                <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">₹{booking.amount}</span>
              </div>
              <div className="mt-4 grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">
                <p><span className="font-semibold text-white">Payment:</span> {booking.paymentProvider || booking.paymentMethod}</p>
                <p><span className="font-semibold text-white">Reference:</span> {booking.paymentReference || 'N/A'}</p>
                <p><span className="font-semibold text-white">Status:</span> {booking.paymentStatus}</p>
              </div>
              <p className="mt-4 text-slate-300">Booking confirmed on {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
