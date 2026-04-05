import { Link } from 'react-router-dom';

const categories = [
  { label: 'PG', icon: '🏡', description: 'Comfortable shared rooms with food options.' },
  { label: 'Hostel', icon: '🏨', description: 'Student-friendly hostels near campus.' },
  { label: 'Flat', icon: '🏢', description: 'Independent flats for focused living.' },
  { label: 'Mess', icon: '🍽️', description: 'Daily meal plans with homely menus.' },
];

const HomePage = () => {
  return (
    <div className="space-y-12">
      <section className="rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.2),_transparent_25%),_linear-gradient(to_bottom_right,_#020617,_#0f172a)] p-10 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 animate-pulse">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /> Inching closer to safe homes
            </span>
            <div className="space-y-5">
              <h1 className="text-5xl font-bold tracking-tight text-white">The easiest way to find PGs, hostels, flats, and mess near college.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">Browse verified student stays, connect with owners, and book instantly with beautiful motion and smart filters.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/listings" className="rounded-full bg-cyan-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:bg-cyan-400">
                Browse listings
              </Link>
              <Link to="/signup" className="rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300">
                Create owner account
              </Link>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Popular stays</p>
              <div className="mt-6 grid gap-4">
                {categories.map((item) => (
                  <Link
                    key={item.label}
                    to={`/listings?type=${item.label}`}
                    className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-4 transition hover:-translate-x-1 hover:border-cyan-500"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-2xl">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.label}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 shadow-soft border border-cyan-500/10">
              <h2 className="text-2xl font-bold text-white">Everything college students need</h2>
              <ul className="mt-5 space-y-3 text-slate-300">
                <li>• Verified owner listings with contact info</li>
                <li>• Search by college, location, type, sharing</li>
                <li>• Book with card or QR payment options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft animate-float">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Fast search</p>
          <h3 className="mt-4 text-2xl font-bold text-white">Find stays by college & location.</h3>
          <p className="mt-3 text-slate-400">Use smart filters to surface the best PGs, hostels, flats and messes near your campus.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft animate-float animation-delay-100">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Owner mode</p>
          <h3 className="mt-4 text-2xl font-bold text-white">Add and manage your listings.</h3>
          <p className="mt-3 text-slate-400">Owners can upload images, edit details, delete outdated listings, and add nearby colleges.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft animate-float animation-delay-200">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Secure booking</p>
          <h3 className="mt-4 text-2xl font-bold text-white">Card & QR payment options.</h3>
          <p className="mt-3 text-slate-400">Simulated payment flow that shows both card entry and QR scan options for a real booking experience.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
