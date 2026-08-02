import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../utils/auth";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    college: "",
    contactNumber: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/signup", form);

      saveAuth(response.data.token, response.data.user);

      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-10 shadow-xl border border-slate-200">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Join StayMate
          </h1>

          <p className="mt-3 text-slate-500">
            Create your account and start exploring student housing.
          </p>
        </div>

        {/* Trust Box */}
        <div className="mb-8 rounded-2xl bg-slate-100 p-4">
          <p className="font-semibold text-slate-900">
            Trusted by students across India
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Discover verified PGs, hostels, flats and mess facilities near your college.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
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
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          {/* Password */}
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
              placeholder="Create a password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          {/* Role Selection */}
          <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    I am a
  </label>

  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
  >
    <option value="user">Student</option>
    <option value="owner">Property Owner</option>
  </select>
</div>
          {/* Contact Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Contact Number
            </label>

            <input
              type="tel"
              value={form.contactNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  contactNumber: e.target.value,
                })
              }
              placeholder="Enter contact number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          {/* College */}
          {form.role === "user" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                College Name
              </label>

              <input
                type="text"
                value={form.college}
                onChange={(e) =>
                  setForm({
                    ...form,
                    college: e.target.value,
                  })
                }
                placeholder="Enter your college"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;