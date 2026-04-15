import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  PropertyCard,
  FilterSidebar,
  HeroSection,
  Pagination,
  SkeletonCard
} from '../components/Browse';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FreeMap from '../components/common/FreeMap';

const PropertyBrowse = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    type: 'all',
    bedrooms: '',
    amenities: [],
    sharing: '',
    food: 'all',
    seating: '',
    shopType: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch Properties
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 8, // 4 rows of 2
        status: 'Available',
        ...filters
      };

      if (filters.sharing) params.sharing_capacity = filters.sharing;
      if (filters.food !== 'all') params.food_included = filters.food;
      if (filters.seating) params.seating_capacity = filters.seating;
      if (filters.shopType) params.shop_use_type = filters.shopType;

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all' || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      // Transform array to comma-separated string for amenities if needed by backend, 
      // but axios handles arrays as repeated params usually. 
      // Our backend controller `req.query.amenities.split(',')` expects a comma-separated string.
      if (params.amenities && params.amenities.length > 0) {
        params.amenities = params.amenities.join(',');
      }

      // API Call
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/properties/allproperties`, { params });

      setProperties(response.data.properties);
      setPagination(prev => ({
        ...prev,
        // The backend returns { properties, totalCount, totalPages, currentPage }
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      }));
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, pagination.currentPage]);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setIsFilterOpen(false);
    fetchProperties();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      type: 'all',
      bedrooms: '',
      amenities: [],
      sharing: '',
      food: 'all',
      seating: '',
      shopType: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans selection:bg-violet-500/30 transition-colors duration-300 flex flex-col h-screen">
      <Navbar
        onNavigate={(path) => navigate(`/${path}`)}
        user={user}
      />

      <div className="flex-1 flex overflow-hidden pt-20">
        {/* Left Side: Results List */}
        <div className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ${showMap ? 'lg:w-[60%]' : 'w-full'}`}>
          {!showMap && <HeroSection onSearch={handleSearch} initialValue={filters.search} />}

          <div className={`max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 ${!showMap ? '-mt-10' : ''} relative z-20`}>
            <div className="flex flex-col md:flex-row gap-8">
              {!showMap && (
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                />
              )}

              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    Available Properties
                    {!loading && <span className="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">{pagination.totalCount} found</span>}
                  </h2>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>

                <div className={`grid grid-cols-1 ${showMap ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'} gap-6`}>
                  {loading ? (
                    Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                  ) : error ? (
                    <div className="col-span-full py-20 text-center bg-gray-100 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 border-dashed">
                      <p className="text-red-400 mb-4">{error}</p>
                      <button onClick={fetchProperties} className="bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20">Retry</button>
                    </div>
                  ) : properties.length > 0 ? (
                    properties.map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center bg-gray-100 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 border-dashed">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
                      <p className="text-gray-500 dark:text-gray-400">Adjust your filters to find your dream home.</p>
                      <button onClick={handleClearFilters} className="mt-6 text-violet-600 dark:text-violet-400 hover:text-black dark:hover:text-white font-bold">Clear all filters</button>
                    </div>
                  )}
                </div>

                {!loading && !error && properties.length > 0 && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map */}
        {showMap && (
          <div className="hidden lg:block lg:w-[40%] h-full sticky top-0 border-l border-gray-200 dark:border-white/10">
            <FreeMap properties={properties} zoom={12} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBrowse;