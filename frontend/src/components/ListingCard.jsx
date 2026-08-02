import { Link } from "react-router-dom";

const backendBaseUrl =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://staymate-1-xg47.onrender.com";

const getImageUrl = (image) => {
  if (!image)
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads"))
    return `${backendBaseUrl}${image}`;

  return image;
};

export default function ListingCard({ property }) {
  const image = getImageUrl(property.image);

  return (
    <Link
      to={`/property/${property._id}`}
      className="group overflow-hidden rounded-[28px] bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={image}
          alt={property.title}
          className="h-60 w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200";
          }}
        />

        {/* Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Type Badge */}
        <div className="absolute left-5 top-5">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg">
            {property.type}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-5 right-5">

          <div className="rounded-2xl bg-white/95 backdrop-blur-md px-5 py-3 shadow-xl">

            <div className="flex items-end gap-1">

              <span className="text-3xl font-bold text-slate-900">
                ₹{property.price}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                /month
              </span>

            </div>

          </div>

        </div>

        {/* Sharing */}
        <div className="absolute right-5 bottom-5">

          <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            {property.sharing} Sharing
          </span>

        </div>
      </div>

      {/* Content */}
      <div className="p-6">

        <div className="flex items-start justify-between gap-3">

          <div>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition">
              {property.title}
            </h2>

            <p className="mt-1 text-slate-500">
              📍 {property.location}
            </p>
          </div>

        </div>

        <div className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
          Near {property.college}
        </div>

        <p className="mt-4 line-clamp-2 text-[15px] leading-7 text-slate-600">
          {property.description}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <span className="text-sm text-slate-500">
            Verified Listing
          </span>

          <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition">
            View Details →
          </span>

        </div>

      </div>
    </Link>
  );
}