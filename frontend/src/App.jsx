import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ListingsPage from './pages/ListingsPage';
import PropertyPage from './pages/PropertyPage';
import OwnerDashboard from './pages/OwnerDashboard';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import Navbar from './components/Navbar';
import { getCurrentUser } from './utils/auth';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar user={user} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/owner/dashboard" element={user?.role === 'owner' ? <OwnerDashboard /> : <Navigate to="/login" />} />
          <Route path="/owner/create" element={user?.role === 'owner' ? <CreateListingPage /> : <Navigate to="/login" />} />
          <Route path="/owner/edit/:id" element={user?.role === 'owner' ? <EditListingPage /> : <Navigate to="/login" />} />
          <Route path="/bookings" element={user?.role === 'user' ? <MyBookingsPage /> : <Navigate to={user?.role === 'owner' ? '/owner/dashboard' : '/login'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
