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
  <div className="min-h-screen bg-[#f7f8fc]">

    {/* Hero */}
    <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-white to-slate-100 border border-slate-200 shadow-sm px-10 py-14">

      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-70"></div>
      <div className="absolute left-20 bottom-0 h-60 w-60 rounded-full bg-sky-100 blur-3xl opacity-70"></div>

      <div className="relative z-10">

        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          🏡 Student Housing Platform
        </span>

        <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight text-slate-900">
          Discover Your
          <span className="text-blue-600"> Perfect Stay </span>
          Near College
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Compare PGs, Hostels, Flats and Mess facilities from verified
          owners around your college.
        </p>

        <div className="mt-10 rounded-3xl border bg-white p-6 shadow-lg">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />
        </div>

      </div>

    </section>


    {/* Stats */}

    <div className="mt-10 grid gap-6 md:grid-cols-3">

      <div className="rounded-3xl bg-white p-7 shadow-sm border hover:shadow-lg duration-300">

        <h3 className="text-4xl font-bold text-blue-600">
          {listings.length}
        </h3>

        <p className="mt-2 text-slate-500">
          Active Listings
        </p>

      </div>

      <div className="rounded-3xl bg-white p-7 shadow-sm border hover:shadow-lg duration-300">

        <h3 className="text-4xl font-bold text-green-600">
          50+
        </h3>

        <p className="mt-2 text-slate-500">
          Colleges Covered
        </p>

      </div>

      <div className="rounded-3xl bg-white p-7 shadow-sm border hover:shadow-lg duration-300">

        <h3 className="text-4xl font-bold text-orange-500">
          100+
        </h3>

        <p className="mt-2 text-slate-500">
          Trusted Owners
        </p>

      </div>

    </div>


    {/* Section Heading */}

    <div className="mt-14 flex items-end justify-between">

      <div>

        <p className="text-blue-600 font-semibold">
          Browse Properties
        </p>

        <h2 className="mt-2 text-4xl font-bold text-slate-900">
          Available Listings
        </h2>

      </div>

      <span className="rounded-full bg-white px-5 py-3 shadow-sm border text-slate-600">

        {listings.length} Properties

      </span>

    </div>


    {/* Loading */}

    {loading ? (

      <div className="grid gap-7 mt-8 md:grid-cols-2 xl:grid-cols-3">

        {[1,2,3,4,5,6].map((i)=>(
          <div
            key={i}
            className="h-[380px] animate-pulse rounded-3xl bg-white shadow"
          />
        ))}

      </div>

    ) : error ? (

      <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
        {error}
      </div>

    ) : listings.length===0 ? (

      <div className="mt-12 rounded-3xl bg-white p-14 text-center shadow">

        <div className="text-6xl">
          😔
        </div>

        <h3 className="mt-5 text-3xl font-bold">
          No Listings Found
        </h3>

        <p className="mt-3 text-slate-500">
          Try changing your filters.
        </p>

      </div>

    ) : (

      <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {listings.map((property)=>(
          <ListingCard
            key={property._id}
            property={property}
          />
        ))}

      </div>

    )}

  </div>
);
};
export default ListingsPage;
