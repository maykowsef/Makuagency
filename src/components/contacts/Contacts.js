import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Globe, Trash2, Edit, Plus } from 'lucide-react';

const Contacts = ({ onNavigate, contacts = [], onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Adjusted to display neatly

    // Filter Logic
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this contact?')) {
            onDelete(id);
        }
    };

    const handleEdit = (e, id) => {
        e.stopPropagation();
        onNavigate('contact-form', { id });
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
                    <p className="text-gray-500 mt-1">Manage and view all your business contacts</p>
                </div>
                <button
                    onClick={() => onNavigate('contact-form')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Contact
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, role, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Filters</span>
                    </button>
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => onNavigate('contact-detail', { id: contact.id })}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group relative"
                    >
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleEdit(e, contact.id)}
                                className="p-1.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-50 border border-indigo-100 shadow-sm"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, contact.id)}
                                className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 border border-red-100 shadow-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <img src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}`} alt={contact.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${contact.psychofile?.color === 'Red' ? 'bg-red-100 text-red-800' :
                                    contact.psychofile?.color === 'Yellow' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                    {contact.psychofile?.type || 'Unknown'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{contact.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{contact.role} at {contact.company}</p>
                            <p className="text-xs text-gray-400 mb-2">ID: #{contact.id}</p>

                            {/* MBTI Badge if available */}
                            {contact.psychofile?.mbti && (
                                <div className="mb-4">
                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-200">
                                        {contact.psychofile.mbti}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{contact.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{contact.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <div className="flex gap-2 text-gray-400">
                                {contact.social?.linkedin && <Globe className="w-4 h-4 hover:text-blue-600 transition-colors" />}
                                {contact.social?.instagram && <Globe className="w-4 h-4 hover:text-pink-600 transition-colors" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-sm text-gray-500">
                    Showing {paginatedContacts.length} of {filteredContacts.length} results
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
