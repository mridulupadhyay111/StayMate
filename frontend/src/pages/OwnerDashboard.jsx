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
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-blue-600 font-medium">Owner Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Manage Your Properties
            </h1>
            <p className="mt-2 text-slate-500">
              View listings, track bookings and manage your student housing business.
            </p>
          </div>

          <Link
            to="/owner/create"
            className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
          >
            + Add New Listing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3 mt-6">
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">Total Listings</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {listings.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">Bookings</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">Revenue</p>
          <h2 className="mt-2 text-4xl font-bold text-green-600">
            ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0)}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-3 rounded-2xl bg-slate-100 p-2 w-fit">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-5 py-2 rounded-xl font-medium transition ${
            activeTab === "listings"
              ? "bg-white shadow text-slate-900"
              : "text-slate-500"
          }`}
        >
          Listings ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2 rounded-xl font-medium transition ${
            activeTab === "bookings"
              ? "bg-white shadow text-slate-900"
              : "text-slate-500"
          }`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
          Loading...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-3xl border border-red-300 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      ) : activeTab === "listings" ? (
        listings.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            No listings added yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((property) => {
              const backendBaseUrl =
                import.meta.env.VITE_API_URL?.replace("/api", "") ||
                "https://staymate-1-xg47.onrender.com";

              const imageUrl = property.image?.startsWith("http://localhost:5000")
                ? property.image.replace(
                    "http://localhost:5000",
                    backendBaseUrl
                  )
                : property.image?.startsWith("https://localhost:5000")
                ? property.image.replace(
                    "https://localhost:5000",
                    backendBaseUrl
                  )
                : property.image?.startsWith("http")
                ? property.image
                : property.image?.startsWith("/uploads")
                ? `${backendBaseUrl}${property.image}`
                : property.image;

              return (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition"
                >
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1554995207-c18c203602cb";
                    }}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {property.title}
                        </h2>

                        <p className="mt-1 text-slate-500 text-sm">
                          {property.location}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-700 font-semibold">
                        ₹{property.price}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                        {property.type}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                        {property.sharing}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      {property.college}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Link
                        to={`/owner/edit/${property._id}`}
                        className="rounded-xl bg-blue-600 py-3 text-center text-white font-medium hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(property._id)}
                        className="rounded-xl border border-red-300 bg-red-50 py-3 text-red-600 font-medium hover:bg-red-100"
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
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {booking.property?.title}
              </h3>

              <p className="mt-1 text-slate-500">
                {booking.property?.location}
              </p>

              <div className="mt-5 flex justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {booking.user?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {booking.user?.email}
                  </p>
                </div>

                <span className="text-xl font-bold text-green-600">
                  ₹{booking.amount}
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm">
                  <strong>Payment:</strong> {booking.paymentProvider}
                </p>

                <p className="text-sm mt-1">
                  <strong>Status:</strong> {booking.paymentStatus}
                </p>

                <p className="text-sm mt-1">
                  <strong>Reference:</strong> {booking.paymentReference}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;