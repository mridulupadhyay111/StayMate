import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../utils/auth";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", form);

      saveAuth(response.data.token, response.data.user);

      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  
    return (
  <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex items-center justify-center px-4">

    <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid-cols-2">

      {/* Left Side */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          alt="StayMate"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-bold">
            Find Your Perfect Stay
          </h2>

          <p className="mt-3 max-w-sm text-lg text-white/90">
            Trusted PGs, Hostels, Flats and Mess Facilities near your college.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-10">

        <div className="w-full max-w-md">

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900">
              Welcome Back 👋
            </h1>

            <p className="mt-3 text-slate-500">
              Login to continue your StayMate journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </button>

          </form>

          <p className="mt-6 text-center text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>

  </div>
);
};

export default LoginPage;