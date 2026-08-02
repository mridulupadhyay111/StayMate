import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { getCurrentUser } from "../utils/auth";

const PropertyPage = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setMessage("Failed to load property details");
      }
    };

    loadProperty();
  }, [id]);

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay script.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay script."));
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    if (!user) {
      setMessage("Please login to book this listing.");
      return;
    }

    setLoading(true);

    try {
      try {
        await loadRazorpayScript();

        const orderResponse = await api.post("/bookings/create-order", {
          propertyId: id,
          amount: property.price,
        });

        const { orderId, amount, currency } = orderResponse.data;

        const options = {
          key:
            import.meta.env.VITE_RAZORPAY_KEY_ID ||
            "rzp_test_T6B516noR5y5tg",
          amount: Math.round(Number(amount) * 100),
          currency,
          name: "StayMate",
          description: `Booking for ${property.title}`,
          order_id: orderId,

          handler: async (response) => {
            try {
              const verifyRes = await api.post(
                "/bookings/verify-payment",
                {
                  propertyId: id,
                  orderId: response.razorpay_order_id || orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }
              );

              setMessage(
                `Booking confirmed! Reference: ${verifyRes.data.booking.paymentReference}`
              );
            } catch (err) {
              const backendError =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message;
              setMessage(`Payment verification failed: ${backendError}`);
            }
          },

          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contactNumber || "",
          },

          theme: {
            color: "#111827",
          },
        };

        if (!window.Razorpay) {
          throw new Error("Payment gateway is unavailable right now.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (error) {
        console.warn("Razorpay checkout failed, using fallback booking flow:", error);
      }

      const fallbackResponse = await api.post("/bookings/fallback-booking", {
        propertyId: id,
        amount: property.price,
      });

      setMessage(
        `Booking request received. Reference: ${fallbackResponse.data.booking.paymentReference}`
      );
    } catch (error) {
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      setMessage(`Failed to initiate payment: ${backendError}`);
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          {message || "Loading property details..."}
        </div>
      </div>
    );
  }

  const backendBaseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    (import.meta.env.DEV ? "http://localhost:8080" : "https://staymate-1-xg47.onrender.com");

  const imageUrl = property.image.startsWith("http://localhost:5000")
    ? property.image.replace("http://localhost:5000", backendBaseUrl)
    : property.image.startsWith("https://localhost:5000")
    ? property.image.replace("https://localhost:5000", backendBaseUrl)
    : property.image.startsWith("http")
    ? property.image
    : property.image.startsWith("/uploads")
    ? `${backendBaseUrl}${property.image}`
    : property.image;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
        <div>
          <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg">
            <img
              src={imageUrl}
              alt={property.title}
              className="h-[280px] w-full object-cover md:h-[380px] lg:h-[420px]"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute left-5 top-5">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg">
                {property.type}
              </span>
            </div>

            <div className="absolute right-5 top-5">
              <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                {property.sharing} Sharing
              </span>
            </div>

            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur-md">
              <span className="text-3xl font-bold text-slate-900">₹{property.price}</span>
              <span className="ml-1 text-sm text-slate-500">/month</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm">
              <p className="text-sm font-medium text-indigo-700">Property Type</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{property.type}</h3>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-sm">
              <p className="text-sm font-medium text-emerald-700">Sharing</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{property.sharing}</h3>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
              <p className="text-sm font-medium text-amber-700">Contact</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{property.contactNumber || "N/A"}</h3>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">About this Property</h2>
            <p className="mt-5 leading-8 text-slate-600">{property.description}</p>
          </div>

          <div className="mt-6 rounded-3xl border bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">Property Owner</h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                {property.owner?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{property.owner?.name || "Owner"}</h3>
                <p className="text-slate-500">{property.owner?.email}</p>
              </div>
            </div>
          </div>

          {property.nearbyColleges?.length > 0 && (
            <div className="mt-6 rounded-3xl border bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900">Nearby Colleges</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {property.nearbyColleges.map((college) => (
                  <span
                    key={college}
                    className="rounded-full bg-blue-50 px-5 py-2 font-medium text-blue-600"
                  >
                    {college}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Monthly Rent</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">₹{property.price}</span>
              <span className="text-slate-500">/month</span>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-slate-900 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Processing..." : "Book Now"}
            </button>

            {message && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {message}
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold text-slate-900">What's Included</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>✓ Verified Listing</li>
                <li>✓ Direct Owner Contact</li>
                <li>✓ Secure Payment</li>
                <li>✓ Student Friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;