import React, { useState } from 'react';
import { Building2, Search, X, AlertCircle } from 'lucide-react';

const CompanySelector = ({ value, companyId, onChange, companies }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState('');

    const filteredCompanies = companies.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(c.id).includes(search)
    );

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company ID</label>
                    <input
                        type="text"
                        value={companyId || ''}
                        onChange={(e) => {
                            const id = e.target.value;
                            const comp = companies.find(c => String(c.id) === String(id));
                            onChange({ companyId: id, companyName: comp ? comp.name : (value || '') });
                        }}
                        className="w-full border p-2 rounded text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="ID..."
                    />
                </div>
                <div className="flex-[2]">
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={value || ''}
                            readOnly
                            className="w-full border p-2 rounded text-sm bg-gray-50 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Search & Select..."
                            onClick={() => setShowPopup(true)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPopup(true)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-[70] p-4 max-h-80 flex flex-col min-w-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            Select Company
                        </h4>
                        <button onClick={() => setShowPopup(false)} type="button" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Search by name or ID..."
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setShowPopup(false);
                            }}
                        />
                    </div>
                    <div className="overflow-y-auto space-y-1 flex-1 custom-scrollbar">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map(company => (
                                <button
                                    key={company.id}
                                    type="button"
                                    onClick={() => {
                                        onChange({ companyId: company.id, companyName: company.name });
                                        setShowPopup(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900 group-hover:text-indigo-600">{company.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">ID: #{company.id}</p>
                                    </div>
                                    <Building2 className="w-4 h-4 text-gray-300 group-hover:text-indigo-400" />
                                </button>
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No companies found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySelector;
