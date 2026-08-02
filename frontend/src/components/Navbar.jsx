import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useState } from "react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg shadow-blue-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold text-white shadow-md shadow-blue-500/30">
            S
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              StayMate
            </h1>
            <p className="text-xs text-blue-100">
              Student Housing
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-white transition hover:text-slate-200"
          >
            Home
          </Link>

          <Link
            to="/listings"
            className="font-medium text-white transition hover:text-slate-200"
          >
            Listings
          </Link>

          {user?.role === "owner" && (
            <Link
              to="/owner/dashboard"
              className="font-medium text-white transition hover:text-slate-200"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "user" && (
            <Link
              to="/bookings"
              className="font-medium text-white transition hover:text-slate-200"
            >
              My Bookings
            </Link>
          )}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-slate-400/60 bg-white/10 px-5 py-2 font-medium text-white transition hover:border-blue-300 hover:bg-white/20"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-blue-500 px-5 py-2 font-medium text-white transition hover:bg-blue-400"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                {user.name}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-400/60 bg-white/10 px-3 py-2 text-white md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-blue-800 bg-slate-900/95 md:hidden">
          <div className="space-y-2 p-4">

            {user && (
              <div className="rounded-xl bg-slate-800 px-4 py-3 text-white font-medium">
                {user.name}
              </div>
            )}

            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-white hover:bg-slate-800"
            >
              Home
            </Link>

            <Link
              to="/listings"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-white hover:bg-slate-800"
            >
              Listings
            </Link>

            {user?.role === "owner" && (
              <Link
                to="/owner/dashboard"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
            )}

            {user?.role === "user" && (
              <Link
                to="/bookings"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-white hover:bg-slate-800"
              >
                My Bookings
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-slate-200 hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-blue-500 px-4 py-3 text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-red-500 px-4 py-3 text-left text-white hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;