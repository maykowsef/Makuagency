import React from 'react';
import { Phone, Plus, Edit, Trash2 } from 'lucide-react';

const PhoneNumbers = ({ sp, onAdd, onEdit, onDelete }) => {
    // COMPREHENSIVE NULL CHECKS
    if (!sp || typeof sp !== 'object') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Phone className="w-4 h-4 text-indigo-600" /> Phone Numbers
                    </h3>
                </div>
                <div className="p-4">
                    <p className="text-gray-500">Phone data not available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-600" /> Phone Numbers
                </h3>
                <button
                    onClick={() => onAdd('phones')}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Phone
                </button>
            </div>
            <div className="p-6">
                <div className="space-y-3">
                    {sp.phones?.map((phone) => (
                        <div key={phone.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${phone.isPrimary ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-gray-900">{phone.number}</p>
                                        {phone.isPrimary && <span className="text-[9px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">PRIMARY</span>}
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase">{phone.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit('phones', phone)} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-100">
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => onDelete('phones', phone.id)} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-100">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {(!sp.phones || sp.phones.length === 0) && (
                        <p className="text-sm text-gray-400 italic text-center py-4">No phone numbers added.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhoneNumbers;
