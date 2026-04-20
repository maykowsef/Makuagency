import React, { useState } from 'react';
import { Search, X, User, Plus } from 'lucide-react';

const ContactSearchModal = ({ isOpen, onClose, onSelect, onCreateNew, contacts }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredContacts = (contacts || []).filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Select Contact</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => onSelect(contact)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                    <p className="text-xs text-gray-500">{contact.role || contact.position}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No contacts found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCreateNew}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Create New Contact
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactSearchModal;
