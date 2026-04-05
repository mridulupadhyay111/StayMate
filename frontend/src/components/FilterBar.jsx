const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-900/95 p-5 shadow-soft sm:grid-cols-5">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        placeholder="Search by name or keyword"
        className="col-span-2"
      />
      <input
        type="text"
        value={filters.college}
        onChange={(e) => handleChange('college', e.target.value)}
        placeholder="College name"
        className="w-full px-4 py-3"
      />
      <input
        type="text"
        value={filters.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="Location"
        className="w-full px-4 py-3"
      />
      <select value={filters.type} onChange={(e) => handleChange('type', e.target.value)}>
        <option value="">All types</option>
        <option value="PG">PG</option>
        <option value="Hostel">Hostel</option>
        <option value="Flat">Flat</option>
        <option value="Mess">Mess</option>
      </select>
      <select value={filters.sharing} onChange={(e) => handleChange('sharing', e.target.value)}>
        <option value="">Any sharing</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Triple">Triple</option>
        <option value="Four+">Four+</option>
      </select>
    </div>
  );
};

export default FilterBar;
