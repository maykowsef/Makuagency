import React, { useState } from 'react';
import { Search, Filter, X, ArrowRight, Building2, Users, Globe, Calendar, FileText, History as HistoryIcon, MapPin } from 'lucide-react';

const GlobalSearch = ({
    contacts = [],
    schedules = [],
    minisites = [],
    sellingPoints = [],
    companies = [],
    onNavigate,
    initialTab = 'Selling Points',
    initialQuery = ''
}) => {
    const [selectedCategory, setSelectedCategory] = useState(initialTab);
    React.useEffect(() => {
        if (initialTab) setSelectedCategory(initialTab);
    }, [initialTab]);

    const [results, setResults] = useState([]);

    // Search criteria state for each category
    const [sellingPointCriteria, setSellingPointCriteria] = useState({
        name: '', businessType: '', industry: '', street: '', city: '', postalCode: '', country: '',
        phone: '', email: '', status: '', description: '', foundedYear: '', siret: '', id: '',
        createdAtStart: '', createdAtEnd: '', lastModifiedStart: '', lastModifiedEnd: ''
    });

    const [contactCriteria, setContactCriteria] = useState({
        name: '', email: '', phone: '', role: '', company: '', mbti: '', city: '', id: ''
    });

    const [companyCriteria, setCompanyCriteria] = useState({
        name: '', industry: '', city: '', country: '', id: ''
    });

    const [minisiteCriteria, setMinisiteCriteria] = useState({
        domain: '', businessType: '', id: ''
    });

    const [scheduleCriteria, setScheduleCriteria] = useState({
        sellingPointName: '', scheduler: '', status: '', id: ''
    });

    // Auto-search on mount if initialQuery is present
    React.useEffect(() => {
        if (initialQuery) {
            // Pre-fill the most relevant field based on active category
            switch (selectedCategory) {
                case 'Selling Points':
                    setSellingPointCriteria(prev => ({ ...prev, name: initialQuery }));
                    break;
                case 'Contacts':
                    setContactCriteria(prev => ({ ...prev, name: initialQuery }));
                    break;
                case 'Companies':
                    setCompanyCriteria(prev => ({ ...prev, name: initialQuery }));
                    break;
                case 'Minisites':
                    setMinisiteCriteria(prev => ({ ...prev, domain: initialQuery }));
                    break;
                case 'Schedules':
                    setScheduleCriteria(prev => ({ ...prev, sellingPointName: initialQuery }));
                    break;
                default: break;
            }
            // Trigger search immediately (requires effect dependency on criteria or manual trigger)
            // Since states update asynchronously, we can't call handleSearch directly here.
            // We'll rely on a separate effect to trigger search when criteria changes due to initialQuery?
            // Safer to just trigger it after a timeout or use a ref, but simple state set is fine for now.
            // Actually, we can just filter directly here for the initial load.
        }
    }, [initialQuery, selectedCategory]);

    // Effect to trigger search when criteria matches initialQuery on load
    React.useEffect(() => {
        if (initialQuery) {
            handleSearch();
        }
    }, [sellingPointCriteria.name, contactCriteria.name, companyCriteria.name, minisiteCriteria.domain, scheduleCriteria.sellingPointName]);


    const categories = [
        { id: 'Selling Points', icon: MapPin, color: 'indigo' },
        { id: 'Contacts', icon: Users, color: 'green' },
        { id: 'Companies', icon: Building2, color: 'orange' },
        { id: 'Minisites', icon: Globe, color: 'purple' },
        { id: 'Schedules', icon: Calendar, color: 'blue' },
    ];

    const searchSellingPoints = () => {
        return sellingPoints.filter(sp => {
            const created = sp.createdAt ? new Date(sp.createdAt) : null;
            const modified = sp.lastModified ? new Date(sp.lastModified) : null;
            const createdStart = sellingPointCriteria.createdAtStart ? new Date(sellingPointCriteria.createdAtStart) : null;
            const createdEnd = sellingPointCriteria.createdAtEnd ? new Date(sellingPointCriteria.createdAtEnd) : null;
            const modifiedStart = sellingPointCriteria.lastModifiedStart ? new Date(sellingPointCriteria.lastModifiedStart) : null;
            const modifiedEnd = sellingPointCriteria.lastModifiedEnd ? new Date(sellingPointCriteria.lastModifiedEnd) : null;

            return (
                (!sellingPointCriteria.name || sp.name?.toLowerCase().includes(sellingPointCriteria.name.toLowerCase())) &&
                (!sellingPointCriteria.businessType || sp.businessType?.toLowerCase().includes(sellingPointCriteria.businessType.toLowerCase())) &&
                (!sellingPointCriteria.industry || sp.industry?.toLowerCase() === sellingPointCriteria.industry.toLowerCase()) &&
                (!sellingPointCriteria.street || sp.address?.street?.toLowerCase().includes(sellingPointCriteria.street.toLowerCase())) &&
                (!sellingPointCriteria.city || sp.address?.city?.toLowerCase().includes(sellingPointCriteria.city.toLowerCase())) &&
                (!sellingPointCriteria.country || sp.address?.country?.toLowerCase().includes(sellingPointCriteria.country.toLowerCase())) &&
                (!sellingPointCriteria.postalCode || sp.address?.postalCode?.toLowerCase().includes(sellingPointCriteria.postalCode.toLowerCase())) &&
                (!sellingPointCriteria.phone || sp.phone?.toLowerCase().includes(sellingPointCriteria.phone.toLowerCase())) &&
                (!sellingPointCriteria.email || sp.email?.toLowerCase().includes(sellingPointCriteria.email.toLowerCase())) &&
                (!sellingPointCriteria.status || sp.status?.toLowerCase().includes(sellingPointCriteria.status.toLowerCase())) &&
                (!sellingPointCriteria.description || sp.description?.toLowerCase().includes(sellingPointCriteria.description.toLowerCase())) &&
                (!sellingPointCriteria.siret || sp.siret?.includes(sellingPointCriteria.siret)) &&
                (!sellingPointCriteria.id || String(sp.id).includes(sellingPointCriteria.id)) &&
                (!sellingPointCriteria.foundedYear || sp.foundedYear?.toString().includes(sellingPointCriteria.foundedYear)) &&
                // Date Range Filters
                (!createdStart || (created && created >= createdStart)) &&
                (!createdEnd || (created && created <= createdEnd)) &&
                (!modifiedStart || (modified && modified >= modifiedStart)) &&
                (!modifiedEnd || (modified && modified <= modifiedEnd))
            );
        }).map(sp => ({ ...sp, type: 'Selling Point' }));
    };

    const searchContacts = () => {
        return contacts.filter(c => {
            return (
                (!contactCriteria.name || c.name?.toLowerCase().includes(contactCriteria.name.toLowerCase())) &&
                (!contactCriteria.email || c.email?.toLowerCase().includes(contactCriteria.email.toLowerCase())) &&
                (!contactCriteria.phone || c.phone?.toLowerCase().includes(contactCriteria.phone.toLowerCase())) &&
                (!contactCriteria.role || c.role?.toLowerCase().includes(contactCriteria.role.toLowerCase())) &&
                (!contactCriteria.company || c.company?.toLowerCase().includes(contactCriteria.company.toLowerCase())) &&
                (!contactCriteria.mbti || c.psychofile?.mbti?.toLowerCase().includes(contactCriteria.mbti.toLowerCase())) &&
                (!contactCriteria.city || c.address?.city?.toLowerCase().includes(contactCriteria.city.toLowerCase())) &&
                (!contactCriteria.id || String(c.id).includes(contactCriteria.id))
            );
        }).map(c => ({ ...c, type: 'Contact' }));
    };

    const searchCompanies = () => {
        return companies.filter(c => {
            return (
                (!companyCriteria.name || c.name?.toLowerCase().includes(companyCriteria.name.toLowerCase())) &&
                (!companyCriteria.industry || c.industry?.toLowerCase().includes(companyCriteria.industry.toLowerCase())) &&
                (!companyCriteria.city || c.address?.city?.toLowerCase().includes(companyCriteria.city.toLowerCase())) &&
                (!companyCriteria.country || c.address?.country?.toLowerCase().includes(companyCriteria.country.toLowerCase())) &&
                (!companyCriteria.id || String(c.id).includes(companyCriteria.id))
            );
        }).map(c => ({ ...c, type: 'Company' }));
    };

    const searchMinisites = () => {
        return minisites.filter(m => {
            return (
                (!minisiteCriteria.domain || m.domain?.toLowerCase().includes(minisiteCriteria.domain.toLowerCase())) &&
                (!minisiteCriteria.businessType || m.businessType?.toLowerCase().includes(minisiteCriteria.businessType.toLowerCase())) &&
                (!minisiteCriteria.id || String(m.id).includes(minisiteCriteria.id))
            );
        }).map(m => ({ ...m, type: 'Minisite' }));
    };

    const searchSchedules = () => {
        return schedules.filter(s => {
            return (
                (!scheduleCriteria.sellingPointName || s.sellingPointName?.toLowerCase().includes(scheduleCriteria.sellingPointName.toLowerCase())) &&
                (!scheduleCriteria.scheduler || s.scheduler?.toLowerCase().includes(scheduleCriteria.scheduler.toLowerCase())) &&
                (!scheduleCriteria.status || s.status?.toLowerCase().includes(scheduleCriteria.status.toLowerCase())) &&
                (!scheduleCriteria.id || String(s.id).includes(scheduleCriteria.id))
            );
        }).map(s => ({ ...s, type: 'Schedule' }));
    };

    const handleSearch = () => {
        let searchResults = [];
        switch (selectedCategory) {
            case 'Selling Points': searchResults = searchSellingPoints(); break;
            case 'Contacts': searchResults = searchContacts(); break;
            case 'Companies': searchResults = searchCompanies(); break;
            case 'Minisites': searchResults = searchMinisites(); break;
            case 'Schedules': searchResults = searchSchedules(); break;
            default: searchResults = [];
        }
        setResults(searchResults);
    };

    const handleClearAll = () => {
        setSellingPointCriteria({
            name: '', businessType: '', industry: '', street: '', city: '', postalCode: '', country: '',
            phone: '', email: '', status: '', description: '', foundedYear: '', siret: '', id: '',
            createdAtStart: '', createdAtEnd: '', lastModifiedStart: '', lastModifiedEnd: ''
        });
        setContactCriteria({ name: '', email: '', phone: '', role: '', company: '', mbti: '', city: '', id: '' });
        setCompanyCriteria({ name: '', industry: '', city: '', country: '', id: '' });
        setMinisiteCriteria({ domain: '', businessType: '', id: '' });
        setScheduleCriteria({ sellingPointName: '', scheduler: '', status: '', id: '' });
        setResults([]);
    };

    const handleResultClick = (result) => {
        const returnParams = { returnTo: 'global-search', activeTab: selectedCategory };
        switch (result.type) {
            case 'Contact': onNavigate('contact-detail', { id: result.id, ...returnParams }); break;
            case 'Company': onNavigate('company-detail', { id: result.id, ...returnParams }); break;
            case 'Minisite': onNavigate('minisite-dashboard', { ...returnParams }); break;
            case 'Schedule': onNavigate('schedule-detail', { id: result.id, ...returnParams }); break;
            case 'Selling Point': onNavigate('selling-point-detail', { id: result.id, ...returnParams }); break;
            default: break;
        }
    };

    const renderSearchFields = () => {
        switch (selectedCategory) {
            case 'Selling Points':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                            <input type="text" value={sellingPointCriteria.name} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Enter name..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Business Type</label>
                            <input type="text" value={sellingPointCriteria.businessType} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, businessType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Retail..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Industry</label>
                            <select value={sellingPointCriteria.industry} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, industry: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                <option value="">All Industries</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="technology">Technology</option>
                                <option value="cafe">Cafe</option>
                                <option value="automotive">Automotive</option>
                                <option value="bakery">Bakery</option>
                                <option value="gym">Gym & Fitness</option>
                                <option value="retail">Retail</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="education">Education</option>
                                <option value="finance">Finance</option>
                                <option value="real-estate">Real Estate</option>
                                <option value="hospitality">Hospitality</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="services">Professional Services</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">SIRET</label>
                            <input type="text" value={sellingPointCriteria.siret} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, siret: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="123..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description Keywords</label>
                            <input type="text" value={sellingPointCriteria.description} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Keywords..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Selling Point ID</label>
                            <input type="text" value={sellingPointCriteria.id} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="ID..." />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                            <input type="text" value={sellingPointCriteria.street} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, street: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Street..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
                            <input type="text" value={sellingPointCriteria.city} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="City..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Postal Code</label>
                            <input type="text" value={sellingPointCriteria.postalCode} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, postalCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Code..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Country</label>
                            <input type="text" value={sellingPointCriteria.country} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, country: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Country..." />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                            <input type="text" value={sellingPointCriteria.phone} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Phone..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                            <input type="text" value={sellingPointCriteria.email} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Email..." />
                        </div>

                        {/* Dates */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Created After</label>
                            <input type="date" value={sellingPointCriteria.createdAtStart} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, createdAtStart: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Created Before</label>
                            <input type="date" value={sellingPointCriteria.createdAtEnd} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, createdAtEnd: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Modified After</label>
                            <input type="date" value={sellingPointCriteria.lastModifiedStart} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, lastModifiedStart: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Modified Before</label>
                            <input type="date" value={sellingPointCriteria.lastModifiedEnd} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, lastModifiedEnd: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Founded Year</label>
                            <input type="text" value={sellingPointCriteria.foundedYear} onChange={(e) => setSellingPointCriteria({ ...sellingPointCriteria, foundedYear: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Year..." />
                        </div>
                    </div>
                );

            case 'Contacts':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                            <input type="text" value={contactCriteria.name} onChange={(e) => setContactCriteria({ ...contactCriteria, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="John Doe..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                            <input type="text" value={contactCriteria.email} onChange={(e) => setContactCriteria({ ...contactCriteria, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="email@example.com..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contact ID</label>
                            <input type="text" value={contactCriteria.id} onChange={(e) => setContactCriteria({ ...contactCriteria, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="ID..." />
                        </div>
                    </div>
                );

            case 'Companies':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Name</label>
                            <input type="text" value={companyCriteria.name} onChange={(e) => setCompanyCriteria({ ...companyCriteria, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Acme Corp..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Industry</label>
                            <input type="text" value={companyCriteria.industry} onChange={(e) => setCompanyCriteria({ ...companyCriteria, industry: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Technology..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
                            <input type="text" value={companyCriteria.city} onChange={(e) => setCompanyCriteria({ ...companyCriteria, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="New York..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Country</label>
                            <input type="text" value={companyCriteria.country} onChange={(e) => setCompanyCriteria({ ...companyCriteria, country: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="USA..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company ID</label>
                            <input type="text" value={companyCriteria.id} onChange={(e) => setCompanyCriteria({ ...companyCriteria, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="ID..." />
                        </div>
                    </div>
                );

            case 'Minisites':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Domain</label>
                            <input type="text" value={minisiteCriteria.domain} onChange={(e) => setMinisiteCriteria({ ...minisiteCriteria, domain: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="example.com..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Minisite ID</label>
                            <input type="text" value={minisiteCriteria.id} onChange={(e) => setMinisiteCriteria({ ...minisiteCriteria, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="ID..." />
                        </div>
                    </div>
                );

            case 'Schedules':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Selling Point Name</label>
                            <input type="text" value={scheduleCriteria.sellingPointName} onChange={(e) => setScheduleCriteria({ ...scheduleCriteria, sellingPointName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Store 1..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Schedule ID</label>
                            <input type="text" value={scheduleCriteria.id} onChange={(e) => setScheduleCriteria({ ...scheduleCriteria, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="ID..." />
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Search</h2>
                <p className="text-gray-500">Search with specific criteria for each field</p>
            </div>

            {/* Category Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Search in:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setResults([]);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {category.id}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search Fields */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Search Criteria</h3>
                    <p className="text-sm text-gray-500">Fill in any field to narrow your search</p>
                </div>
                {renderSearchFields()}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSearch}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Search
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Clear All
                    </button>
                </div>
            </div>

            {/* Results */}
            {results.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            Found {results.length} result{results.length !== 1 ? 's' : ''}
                        </h3>
                        {selectedCategory === 'Selling Points' && (
                            <button
                                onClick={() => onNavigate('selling-points', { filters: sellingPointCriteria })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                                View in List
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        {selectedCategory === 'Companies' && (
                            <button
                                onClick={() => onNavigate('companies', { filters: companyCriteria })}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                                View in List
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        {/* Add other categories here as their list views become robust enough to filter via props */}
                    </div>
                    <div className="space-y-3">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                onClick={() => handleResultClick(result)}
                                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600">
                                                {result.name || result.domain || result.sellingPointName}
                                            </h4>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                {result.type}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-400">#{result.id}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {result.type === 'Contact' && (
                                                <>
                                                    <p>{result.role} at {result.company}</p>
                                                    <p>{result.email} • {result.phone}</p>
                                                </>
                                            )}
                                            {result.type === 'Selling Point' && (
                                                <>
                                                    <p>{result.businessType}</p>
                                                    <p>{result.address?.street}, {result.address?.city}</p>
                                                </>
                                            )}
                                            {result.type === 'Company' && (
                                                <>
                                                    <p>{result.industry}</p>
                                                    <p>{result.address?.city}, {result.address?.country}</p>
                                                </>
                                            )}
                                            {result.type === 'Minisite' && (
                                                <>
                                                    <p>{result.domain}</p>
                                                    <p>{result.businessType}</p>
                                                </>
                                            )}
                                            {result.type === 'Schedule' && (
                                                <>
                                                    <p>Scheduled by: {result.scheduler}</p>
                                                    <p>{new Date(result.date).toLocaleString()}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {/* If criteria is set but no results, show "No results found" */}
                        {initialQuery && results.length === 0 ? 'No results found' : 'Start searching'}
                    </h3>
                    <p className="text-gray-500">
                        {initialQuery && results.length === 0 ? 'Try different keywords' : 'Use the filters above to find what you need'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
