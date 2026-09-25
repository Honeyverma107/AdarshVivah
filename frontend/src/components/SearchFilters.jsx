import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import Button from './Button';

export const SearchFilters = ({ filters, onFilterChange, onResetFilters }) => {
  const handleChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-rose-100 pb-3">
        <h3 className="font-serif font-bold text-dark-800 text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-maroon-600" />
          Refine Search
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-maroon-600 hover:text-maroon-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-semibold text-dark-800 mb-2 uppercase tracking-wider">
          Looking For
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Bride', value: 'Bride' },
            { label: 'Groom', value: 'Groom' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange('gender', item.value)}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                filters.gender === item.value
                  ? 'bg-maroon-600 text-white border-maroon-600 shadow-xs'
                  : 'bg-rose-50/60 text-dark-800 border-rose-100 hover:bg-rose-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Religion Filter */}
      <div>
        <label className="block text-xs font-semibold text-dark-800 mb-1.5 uppercase tracking-wider">
          Religion
        </label>
        <select
          value={filters.religion}
          onChange={(e) => handleChange('religion', e.target.value)}
          className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
        >
          <option value="All">All Religions</option>
          <option value="Hindu">Hindu</option>
          <option value="Sikh">Sikh</option>
          <option value="Jain">Jain</option>
          <option value="Christian">Christian</option>
          <option value="Muslim">Muslim</option>
        </select>
      </div>

      {/* Community / Caste Filter */}
      <div>
        <label className="block text-xs font-semibold text-dark-800 mb-1.5 uppercase tracking-wider">
          Community / Caste
        </label>
        <select
          value={filters.community}
          onChange={(e) => handleChange('community', e.target.value)}
          className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
        >
          <option value="All">All Communities</option>
          <option value="Brahmin">Brahmin</option>
          <option value="Rajput">Rajput / Kshatriya</option>
          <option value="Maratha">Maratha</option>
          <option value="Reddy">Reddy</option>
          <option value="Nair">Nair</option>
          <option value="Agarwal">Agarwal / Marwari</option>
          <option value="Jat Sikh">Jat Sikh</option>
          <option value="Gujarati">Gujarati</option>
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-semibold text-dark-800 mb-1.5 uppercase tracking-wider">
          City / Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
        >
          <option value="All">All Locations</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Delhi NCR">Delhi NCR</option>
          <option value="Pune">Pune</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Kochi">Kochi</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Jaipur">Jaipur</option>
        </select>
      </div>

      {/* Education Filter */}
      <div>
        <label className="block text-xs font-semibold text-dark-800 mb-1.5 uppercase tracking-wider">
          Minimum Education
        </label>
        <select
          value={filters.education}
          onChange={(e) => handleChange('education', e.target.value)}
          className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
        >
          <option value="All">Any Qualification</option>
          <option value="Engineering / Tech">Engineering / Tech</option>
          <option value="MBA / Business">MBA / Finance</option>
          <option value="Medical / Doctor">Doctor / Medical</option>
          <option value="Chartered Accountant">CA / CFA</option>
        </select>
      </div>

      {/* Verification Filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
          <input
            type="checkbox"
            checked={filters.verifiedOnly || false}
            onChange={(e) => handleChange('verifiedOnly', e.target.checked)}
            className="w-4 h-4 text-maroon-600 rounded-md border-rose-300 focus:ring-maroon-600"
          />
          <span className="text-xs font-semibold text-dark-800">Verified Profiles Only</span>
        </label>
      </div>

    </div>
  );
};
export default SearchFilters;
