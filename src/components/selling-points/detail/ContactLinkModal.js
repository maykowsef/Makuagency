import React, { useState } from 'react';
import { Search, X, User, Plus, Link as LinkIcon, Hash } from 'lucide-react';

const ContactLinkModal = ({ isOpen, onClose, onLinkExisting, onCreateNew, contacts = [], linkedContactIds = [] }) => {
    const [searchType, setSearchType] = useState('name'); // 'name' or 'id'
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    // Filter out already linked contacts
    const availableContacts = contacts.filter(c => !linkedContactIds.includes(c.id));

    const filteredContacts = availableContacts.filter(contact => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();

        if (searchType === 'id') {
            return String(contact.id).includes(searchTerm);
        } else {
            const fullName = `${contact.firstName || ''} ${contact.lastName || ''} ${contact.name || ''}`.toLowerCase();
            return fullName.includes(term) ||
                contact.email?.toLowerCase().includes(term) ||
                contact.role?.toLowerCase().includes(term) ||
                contact.position?.toLowerCase().includes(term) ||
                contact.company?.toLowerCase().includes(term);
        }
    });

    const handleSelect = (contact) => {
        onLinkExisting(contact);
        setSearchTerm('');
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <LinkIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Link Contact</h3>
                            <p className="text-sm text-gray-600">Choose an existing contact or create new</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 group"
                    >
                        <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setSearchType('name')}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${searchType === 'name'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            Search by Name
                        </button>
                        <button
                            onClick={() => setSearchType('id')}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${searchType === 'id'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            Search by ID
                        </button>
                    </div>

                    <div className="relative">
                        {searchType === 'name' ? (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        ) : (
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        )}
                        <input
                            type={searchType === 'id' ? 'number' : 'text'}
                            placeholder={searchType === 'id' ? 'Enter Contact ID...' : 'Search by name, email, role...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => handleSelect(contact)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl border-2 border-transparent hover:border-indigo-200 transition-all duration-200 text-left group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                                    <span className="text-lg font-bold text-indigo-700">
                                        {(contact.firstName?.[0] || contact.name?.[0] || '?').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-gray-900 truncate">
                                            {contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.name}
                                        </p>
                                        <span className="text-xs font-mono text-gray-400">#{contact.id}</span>
                                    </div>
                                    <p className="text-sm text-indigo-600 font-medium mb-1 truncate">
                                        {contact.role || contact.position || 'No Position'}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        {contact.email && <span className="truncate">{contact.email}</span>}
                                        {contact.phone && <span>• {contact.phone}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center  justify-center w-10 h-10 rounded-lg bg-indigo-100 group-hover:bg-indigo-600 transition-all duration-200">
                                    <LinkIcon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-all duration-200" />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium mb-1">No contacts found</p>
                            <p className="text-sm text-gray-400">
                                {searchTerm ? `No results for "${searchTerm}"` : 'No available contacts to link'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-b-2xl">
                    <button
                        onClick={onCreateNew}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Contact & Link
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ContactLinkModal;
