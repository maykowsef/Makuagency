import React, { useState } from 'react';
import { Building2, Search, Filter, Plus, Edit, Trash2, MapPin, Globe, Phone, Mail, GitMerge, X } from 'lucide-react';

const Companies = ({ companies = [], onNavigate, onDelete, onMerge }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [mergeMode, setMergeMode] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [showMergeDialog, setShowMergeDialog] = useState(false);
    const [primaryCompanyId, setPrimaryCompanyId] = useState(null);
    const itemsPerPage = 10;

    // Get unique countries and industries for filters
    const countries = [...new Set(companies.map(c => c.address?.country).filter(Boolean))];
    const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];

    // Filter companies
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = !filterCountry || company.address?.country === filterCountry;
        const matchesIndustry = !filterIndustry || company.industry === filterIndustry;
        return matchesSearch && matchesCountry && matchesIndustry;
    });

    // Pagination
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this company?')) {
            onDelete(id);
        }
    };

    const toggleMergeMode = () => {
        setMergeMode(!mergeMode);
        setSelectedCompanies([]);
    };

    const toggleCompanySelection = (id) => {
        setSelectedCompanies(prev =>
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleMergeClick = () => {
        if (selectedCompanies.length < 2) {
            alert('Please select at least 2 companies to merge.');
            return;
        }
        setPrimaryCompanyId(selectedCompanies[0]);
        setShowMergeDialog(true);
    };

    const confirmMerge = () => {
        const secondaryIds = selectedCompanies.filter(id => id !== primaryCompanyId);
        onMerge(primaryCompanyId, secondaryIds);
        setShowMergeDialog(false);
        setMergeMode(false);
        setSelectedCompanies([]);
        setPrimaryCompanyId(null);
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
                    <p className="text-gray-500 mt-1">Manage your business relationships</p>
                </div>
                <div className="flex gap-2">
                    {mergeMode ? (
                        <>
                            <button
                                onClick={handleMergeClick}
                                disabled={selectedCompanies.length < 2}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <GitMerge className="w-4 h-4" />
                                Merge ({selectedCompanies.length})
                            </button>
                            <button
                                onClick={toggleMergeMode}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={toggleMergeMode}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <GitMerge className="w-4 h-4" />
                                Merge Mode
                            </button>
                            <button
                                onClick={() => onNavigate('company-form')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Company
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    <select
                        value={filterIndustry}
                        onChange={(e) => setFilterIndustry(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Industries</option>
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {paginatedCompanies.length > 0 ? (
                    paginatedCompanies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => mergeMode ? toggleCompanySelection(company.id) : onNavigate('company-detail', { id: company.id })}
                            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${selectedCompanies.includes(company.id)
                                ? 'border-purple-500 ring-2 ring-purple-200'
                                : 'border-gray-200'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        {mergeMode && (
                                            <input
                                                type="checkbox"
                                                checked={selectedCompanies.includes(company.id)}
                                                onChange={() => toggleCompanySelection(company.id)}
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        )}
                                        <div className="p-3 bg-indigo-100 rounded-lg">
                                            <Building2 className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{company.name}</h3>
                                            <p className="text-sm text-gray-500">{company.industry}</p>
                                            <p className="text-xs text-gray-400">ID: #{company.id}</p>
                                        </div>
                                    </div>
                                    {!mergeMode && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigate('company-form', { id: company.id });
                                                }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, company.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{company.address?.city}, {company.address?.country}</span>
                                    </div>
                                    {company.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{company.phone}</span>
                                        </div>
                                    )}
                                    {company.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{company.email}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                                    <span>{company.linkedSellingPoints?.length || 0} Selling Points</span>
                                    <span>{company.linkedContacts?.length || 0} Contacts</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No companies found. Add one to get started!</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Companies;
