import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal, ArrowUpDown, Filter, AlertCircle, Loader2 } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import ProfileCard from '../../components/ProfileCard';
import SearchFilters from '../../components/SearchFilters';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import profileApi from '../../api/profileApi';

const getInitialGender = (param) => {
  if (!param) return 'Bride';
  const p = param.trim().toLowerCase();
  if (p === 'bride' || p === 'female') return 'Bride';
  if (p === 'groom' || p === 'male') return 'Groom';
  return 'Bride';
};

export const BrowseProfiles = () => {
  const [searchParams] = useSearchParams();

  // Profiles State
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    gender: getInitialGender(searchParams.get('gender')),
    religion: searchParams.get('religion') || 'All',
    community: 'All',
    location: searchParams.get('location') || 'All',
    education: 'All',
    verifiedOnly: false,
    searchQuery: ''
  });

  const [sortBy, setSortBy] = useState('match'); // 'match', 'age_asc', 'age_desc'
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = {};
    if (filters.gender && filters.gender !== 'All') {
      params.gender = filters.gender;
    }
    if (filters.religion && filters.religion !== 'All') {
      params.religion = filters.religion;
    }
    if (filters.community && filters.community !== 'All') {
      params.caste = filters.community;
    }
    if (filters.location && filters.location !== 'All') {
      params.city = filters.location;
    }
    if (filters.education && filters.education !== 'All') {
      params.education = filters.education;
    }
    if (filters.searchQuery) {
      params.search = filters.searchQuery;
    }

    profileApi.getProfiles(params, { signal: controller.signal })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setProfiles(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error('Error fetching browse profiles:', err);
        setError('Unable to load profiles. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [
    filters.gender,
    filters.religion,
    filters.community,
    filters.location,
    filters.education,
    filters.searchQuery
  ]);

  // Client-side sort/filter refinement
  const filteredProfiles = profiles.filter((profile) => {
    if (filters.verifiedOnly && !profile.is_verified) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'match') return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
    if (sortBy === 'age_asc') return (a.age || 0) - (b.age || 0);
    if (sortBy === 'age_desc') return (b.age || 0) - (a.age || 0);
    return 0;
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      gender: 'Bride',
      religion: 'All',
      community: 'All',
      location: 'All',
      education: 'All',
      verifiedOnly: false,
      searchQuery: ''
    });
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner & Heading */}
      <div className="bg-gradient-to-r from-rose-50 via-cream-100 to-rose-50 p-6 md:p-8 rounded-3xl border border-rose-200 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-maroon-700 bg-white px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
            Verified Indian Matrimony
          </span>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-dark-800 tracking-tight">
            Browse Compatible Profiles
          </h1>
          <p className="text-xs md:text-sm text-muted-500 mt-2">
            Discover authentic brides and grooms aligned with your lifestyle, family traditions, and partner preferences.
          </p>
        </div>
      </div>

      {/* Search Bar & View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Keyword Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-muted-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            placeholder="Search by name, profession, city, college..."
            className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-maroon-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cream-50 border border-rose-200 text-xs rounded-xl px-3 py-2 text-dark-800 font-medium focus:ring-2 focus:ring-maroon-600 focus:outline-none"
            >
              <option value="match">Highest Preference Match %</option>
              <option value="age_asc">Age: Low to High</option>
              <option value="age_desc">Age: High to Low</option>
            </select>
          </div>

          {/* Grid / List Toggle */}
          <div className="hidden sm:flex items-center bg-cream-50 p-1 rounded-xl border border-rose-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-maroon-600 text-white' : 'text-muted-500 hover:text-dark-800'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-maroon-600 text-white' : 'text-muted-500 hover:text-dark-800'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Browse Grid & Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className={`w-full lg:w-72 shrink-0 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Profile Results Area */}
        <div className="flex-1 min-w-0">
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-dark-800">
              {loading ? (
                <span className="text-muted-500 font-medium">Searching profiles...</span>
              ) : (
                <>
                  Showing <span className="text-maroon-700 font-bold">{filteredProfiles.length}</span> verified profiles matching criteria
                </>
              )}
            </p>
          </div>

          {loading ? (
            /* LOADING STATE: Skeleton UI */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-rose-100 p-4 space-y-4 animate-pulse">
                  <div className="w-full h-56 bg-cream-100 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-cream-100 rounded-md w-3/4" />
                    <div className="h-3 bg-cream-100 rounded-md w-1/2" />
                    <div className="h-3 bg-cream-100 rounded-md w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* ERROR STATE: Server/Network Error UI */
            <div className="p-8 bg-red-50/60 border border-red-200 rounded-3xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="font-serif font-bold text-dark-800 text-lg">Unable to Load Profiles</h3>
              <p className="text-xs text-muted-600">{error}</p>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setFilters({ ...filters })}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : filteredProfiles.length === 0 ? (
            /* EMPTY STATE: Only when request completes with 0 results */
            <EmptyState
              title="No Matching Profiles Found"
              description="Try clearing your filters or broadening your search criteria to discover more compatible matches."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            /* SUCCESS STATE: Display Profile Cards */
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default BrowseProfiles;
