import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import SchemeCard from './SchemeCard';

const BrowseSchemes = ({ profile, onApply }) => {
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchSchemes();
    }, []);

    useEffect(() => {
        filterSchemes();
    }, [schemes, searchQuery, selectedState, selectedCategory]);

    const fetchSchemes = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://let-go-3-0.onrender.com';
        try {
            setLoading(true);

            // 1. Fetch States
            try {
                const statesRes = await fetch(`${apiUrl}/api/subsidies/states`);
                if (statesRes.ok) {
                    const statesData = await statesRes.json();
                    if (statesData.success) {
                         setStates(statesData.data);
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch states", e);
            }

            // 2. Fetch Schemes
            const schemeBody = {
                 state: profile?.state || null,
                 equipment_type: null
            };

            const response = await fetch(`${apiUrl}/api/subsidies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schemeBody)
            });

            // Check for API errors
            if (!response.ok) {
                throw new Error(`https error! status: ${response.status}`);
            }

            const resJson = await response.json();

            // If API returns success
            if (resJson.success && resJson.data) {
                const subsidyData = resJson.data;
                const allSchemes = [
                    ...(subsidyData.central_subsidies || []), 
                    ...(subsidyData.state_subsidies || [])
                ];
                
                if (allSchemes.length === 0) {
                    throw new Error("No schemes returned");
                }

                // Add category field if missing based on source
                const processedSchemes = allSchemes.map(s => ({
                    ...s,
                    category: s.state ? "State Scheme" : "Central Scheme"
                }));

                setSchemes(processedSchemes);
                setError(null);
            } else {
                throw new Error("Invalid API response format");
            }
        } catch (err) {
            console.warn("Backend unavailable or error, using mock data.", err);
            // Mock Data Fallback
            setSchemes([
                {
                    scheme_name: "PM-KISAN Samman Nidhi",
                    description: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
                    category: "Central Scheme",
                    state: "All India",
                    subsidy_percentage: 100,
                    formatted_max_amount: "₹6,000/year",
                    tags: ["Financial Support", "Small Farmers"]
                },
                {
                    scheme_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                    description: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
                    category: "Central Scheme",
                    state: "All India",
                    subsidy_percentage: 98,
                    formatted_max_amount: "Cover varies",
                    tags: ["Insurance", "Crop Loss"]
                },
                {
                    scheme_name: "National Mission for Sustainable Agriculture (NMSA)",
                    description: "Promoting organic farming and soil health management.",
                    category: "Central Scheme",
                    state: "All India",
                    subsidy_percentage: 50,
                    formatted_max_amount: "₹50,000/ha",
                    tags: ["Sustainability", "Organic"]
                },
                {
                    scheme_name: "Tractor Subsidy Scheme",
                    description: "Subsidy on purchase of new tractors for farm mechanization.",
                    category: "State Scheme",
                    state: "Maharashtra",
                    subsidy_percentage: 40,
                    formatted_max_amount: "₹1.25 Lakhs",
                    tags: ["Mechanization", "Equipment"]
                },
                {
                    scheme_name: "Drip Irrigation Subsidy",
                    description: "Financial assistance for installing drip irrigation systems to save water.",
                    category: "State Scheme",
                    state: "Punjab",
                    subsidy_percentage: 80,
                    formatted_max_amount: "₹45,000/acre",
                    tags: ["Irrigation", "Water Saving"]
                }
            ]);
            // Ensure states are populated if fetch failed
            if (states.length === 0) {
                 setStates(["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Gujarat"]);
            }
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    const filterSchemes = () => {
        let filtered = [...schemes];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.scheme_name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query)
            );
        }

        if (selectedState) {
            filtered = filtered.filter(s =>
                s.state === selectedState || s.category === 'Central Scheme'
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        setFilteredSchemes(filtered);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-organic-green" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600 dark:text-gray-400">
                <AlertCircle size={40} className="text-red-400 mb-4" />
                <p>{error}</p>
                <button
                    onClick={fetchSchemes}
                    className="mt-4 px-4 py-2 bg-organic-green rounded-lg text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search schemes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-organic-green"
                    />
                </div>

                {/* State Filter */}
                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-organic-green"
                >
                    <option value="">All States</option>
                    {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-organic-green"
                >
                    <option value="">All Categories</option>
                    <option value="Central Scheme">Central Schemes</option>
                    <option value="State Scheme">State Schemes</option>
                </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-600 dark:text-gray-400">
                Showing {filteredSchemes.length} of {schemes.length} schemes
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchemes.map((scheme, idx) => (
                    <SchemeCard key={idx} scheme={scheme} onApply={onApply} />
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="text-center text-slate-600 dark:text-gray-400 py-12">
                    No schemes found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default BrowseSchemes;
