import React from 'react';
import { Filter, Home, Check, X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, onApply, onClear, isOpen, onClose }) => {

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const amenitiesList = [
        { id: 1, name: 'Parking' },
        { id: 2, name: 'Lift' },
        { id: 3, name: 'Power Backup' },
        { id: 4, name: 'Wifi' }, // Assuming these IDs map to DB
        // Ideally fetch these from backend or use constants
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar
                    md:translate-x-0 md:h-[calc(100vh-10rem)] md:sticky md:top-28 md:rounded-2xl md:border md:mb-8 md:shadow-sm dark:md:shadow-none
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between md:hidden">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X className="w-6 h-6" /></button>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            Start Your Search
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Min Rent</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleChange('minPrice', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-violet-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Max Rent</label>
                                <input
                                    type="number"
                                    placeholder="Max Limit"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-violet-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-white/5" />

                    {/* Property Type */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Property Type</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Apartment', value: 'APARTMENT' },
                                { label: 'Independent House', value: 'INDEPENDENT' },
                                { label: 'Villa', value: 'VILLA' },
                                { label: 'Studio', value: 'STUDIO' },
                                { label: 'Independent Floor', value: 'INDEPENDENT_FLOOR' },
                                { label: 'PG / Hostel', value: 'PG' },
                                { label: 'Commercial Shop', value: 'COMMERCIAL_SHOP' },
                                { label: 'Office Space', value: 'OFFICE_SPACE' }
                            ].map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.type === item.value ? 'bg-violet-600 border-violet-600' : 'border-gray-200 dark:border-white/20 group-hover:border-gray-400 dark:group-hover:border-white/40'}`}>
                                        {filters.type === item.value && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="propertyType"
                                        className="hidden"
                                        checked={filters.type === item.value}
                                        onChange={() => handleChange('type', filters.type === item.value ? 'all' : item.value)}
                                    />
                                    <span className={`text-sm ${filters.type === item.value ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300'}`}>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-white/5" />

                    {/* Bedrooms */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Bedrooms</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {['1', '2', '3', '4+'].map((bhk) => (
                                <button
                                    key={bhk}
                                    onClick={() => handleChange('bedrooms', filters.bedrooms === bhk ? '' : bhk)}
                                    className={`py-2 rounded-lg text-sm font-medium border transition-all ${filters.bedrooms === bhk ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                >
                                    {bhk}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-white/5" />

                    {/* Actions */}
                    <div className="pt-2 space-y-3">
                        <button
                            onClick={onApply}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-900/20"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={onClear}
                            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold transition-all"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
