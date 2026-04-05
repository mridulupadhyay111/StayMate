import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { getCurrentUser } from '../utils/auth';

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');

  const user = getCurrentUser();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setMessage('Failed to load property details');
      }
    };
    loadProperty();
  }, [id]);

  const handleRazorpayPayment = async () => {
    if (!user) {
      setMessage('Please login to book this listing.');
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await api.post('/bookings/create-order', {
        propertyId: id,
        amount: property.price,
      });

      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SZP47AdnUPsgKF',
        amount: Math.round(amount * 100),
        currency: currency,
        name: 'StayMate',
        description: `Booking for ${property.title}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/bookings/verify-payment', {
              propertyId: id,
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            setMessage(`Booking confirmed! Reference: ${verifyRes.data.booking.paymentReference}`);
          } catch (err) {
            setMessage('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contactNumber || '',
        },
        theme: {
          color: '#06B6D4',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || error.message;
      setMessage(`Failed to initiate payment: ${backendError}`);
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center text-slate-300 shadow-soft">
        {message || 'Loading property details...'}
      </div>
    );
  }

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
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
        <img src={imageUrl} alt={property.title} className="h-72 w-full rounded-[2rem] object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'; }} />
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">{property.title}</h1>
              <p className="mt-2 text-slate-400">{property.location} · {property.college}</p>
              <p className="mt-1 text-sm text-slate-400">Contact: {property.contactNumber || 'N/A'}</p>
            </div>
            <span className="rounded-full bg-cyan-500 px-4 py-2 text-lg font-semibold text-slate-950">₹{property.price}/mo</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">Type: {property.type}</div>
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">Sharing: {property.sharing}</div>
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">Owner: {property.owner?.name || 'Unknown'}</div>
          </div>
          {property.nearbyColleges?.length > 0 && (
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <h2 className="text-xl font-semibold text-white">Nearby colleges</h2>
              <p className="mt-3 text-slate-300">{property.nearbyColleges.join(', ')}</p>
            </div>
          )}
          <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
            <h2 className="text-xl font-semibold text-white">About this listing</h2>
            <p className="mt-3 leading-7">{property.description}</p>
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-white">Book this stay</h2>
          <p className="mt-3 text-slate-400">Secure payment via Razorpay with test API.</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-slate-300">
              <p className="text-sm text-cyan-300">Razorpay Test Mode</p>
              <p className="mt-2 text-sm">Use test card: <span className="font-mono font-semibold">4111 1111 1111 1111</span></p>
              <p className="mt-1 text-sm">Expiry: Any future date, CVV: Any 3 digits</p>
            </div>
            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? 'Processing...' : `Pay ₹${property.price} via Razorpay`}
            </button>
          </div>
          {message && <p className={`mt-4 text-sm ${message.includes('confirmed') ? 'text-cyan-200' : 'text-rose-200'}`}>{message}</p>}
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Quick facts</h3>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>✓ Fully student-friendly search</li>
            <li>✓ Filter by sharing, pricing and colleges</li>
            <li>✓ Owner-managed listing with instant booking</li>
            <li>✓ Secure Razorpay checkout</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default PropertyPage;
