import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/" className="font-bold text-2xl text-cyan-300">StayMate</Link>
          <p className="text-sm text-slate-400">Housing & mess bookings for students</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <Link className="hover:text-cyan-300" to="/listings">Explore</Link>
          {user?.role === 'owner' && <Link className="hover:text-cyan-300" to="/owner/dashboard">Owner Panel</Link>}
          {user?.role === 'user' && <Link className="hover:text-cyan-300" to="/bookings">My Bookings</Link>}
          {!user && <Link className="hover:text-cyan-300" to="/login">Login</Link>}
          {!user && <Link className="hover:text-cyan-300" to="/signup">Signup</Link>}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;


