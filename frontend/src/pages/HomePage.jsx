import { Link } from "react-router-dom";

const categories = [
  {
    title: "PG",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  },
  {
    title: "Hostel",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200",
  },
  {
    title: "Flat",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200",
  },
  {
    title: "Mess",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#FAFAF8]">

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Trusted by Students Across India
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              Moving to a New City?
              <span className="block text-blue-600">
                Find a Place That Feels Like Home.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover verified PGs, hostels, flats and mess facilities
              around your college. Compare options, contact owners
              directly and book confidently.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/listings"
                className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700"
              >
                Explore Listings
              </Link>

              <Link
                to="/signup"
                className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
              >
                List Property
              </Link>
            </div>

            <div className="mt-12 flex gap-10">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">500+</h3>
                <p className="text-slate-500">Listings</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">100+</h3>
                <p className="text-slate-500">Owners</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">50+</h3>
                <p className="text-slate-500">Colleges</p>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400"
              alt="Student Housing"
              className="h-[550px] w-full rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white p-4 shadow-lg">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              placeholder="College"
              className="rounded-xl border border-slate-200 px-4 py-3"
            />

            <input
              placeholder="Location"
              className="rounded-xl border border-slate-200 px-4 py-3"
            />

            <select className="rounded-xl border border-slate-200 px-4 py-3">
              <option>Property Type</option>
            </select>

            <button className="rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">
            Browse By Category
          </h2>

          <Link
            to="/listings"
            className="font-semibold text-blue-600"
          >
            View All →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.title}
              to={`/listings?type=${item.title}`}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-4xl font-bold text-slate-900">
            Why Students Choose StayMate
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-100 p-8">
              <div className="text-4xl">🏠</div>
              <h3 className="mt-5 text-xl font-semibold">
                Verified Listings
              </h3>
              <p className="mt-3 text-slate-600">
                Genuine property information directly from owners.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 p-8">
              <div className="text-4xl">🎓</div>
              <h3 className="mt-5 text-xl font-semibold">
                College Focused
              </h3>
              <p className="mt-3 text-slate-600">
                Discover stays near your preferred campus.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 p-8">
              <div className="text-4xl">⭐</div>
              <h3 className="mt-5 text-xl font-semibold">
                Simple Booking
              </h3>
              <p className="mt-3 text-slate-600">
                Contact owners and complete bookings easily.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Find Your Next Stay?
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Explore verified student housing options near your college.
          </p>

          <Link
            to="/listings"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 hover:bg-slate-100"
          >
            Browse Listings
          </Link>
        </div>
      </section>

    </div>
  );
}