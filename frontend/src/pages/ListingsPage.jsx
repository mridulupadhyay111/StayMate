import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    sharing: searchParams.get('sharing') || '',
    college: searchParams.get('college') || '',
    location: searchParams.get('location') || '',
    search: searchParams.get('search') || '',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const response = await api.get('/properties', { params });
      setListings(response.data);
      setError('');
    } catch (err) {
      setError('Unable to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [filters]);

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-white">Search student stays and mess plans</h1>
        <p className="mt-2 text-slate-400">Use filters to compare sharing, pricing and college proximity.</p>
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">Loading listings...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-600 bg-rose-900/20 p-6 text-rose-200">{error}</div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-300">No listings match the selected filters.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
          {listings.map((property) => (
            <ListingCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
