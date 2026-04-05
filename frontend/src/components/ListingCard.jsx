import { Link } from 'react-router-dom';

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80';
  if (image.startsWith('http://localhost:5000')) return image.replace('http://localhost:5000', backendBaseUrl);
  if (image.startsWith('https://localhost:5000')) return image.replace('https://localhost:5000', backendBaseUrl);
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${backendBaseUrl}${image}`;
  return image;
};

const ListingCard = ({ property }) => {
  const imageUrl = getImageUrl(property.image);

  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-soft transition hover:-translate-y-1 hover:border-cyan-500">
      <img
        src={imageUrl}
        alt={property.title}
        className="h-52 w-full rounded-3xl object-cover"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80';
        }}
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-50">{property.title}</h3>
          <p className="text-sm text-slate-400">{property.location} · {property.college}</p>
        </div>
        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">₹{property.price}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{property.description.slice(0, 120)}...</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-slate-700 px-3 py-1">{property.type}</span>
        <span className="rounded-full border border-slate-700 px-3 py-1">{property.sharing} sharing</span>
      </div>
      <Link
        to={`/property/${property._id}`}
        className="mt-5 inline-flex rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
      >
        View Details
      </Link>
    </div>
  );
};

export default ListingCard;
