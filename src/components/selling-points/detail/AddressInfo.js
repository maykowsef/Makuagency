import React from 'react';
import { MapPin, Edit, ExternalLink, Navigation } from 'lucide-react';

const AddressInfo = ({ sp, onEdit, setEditSection, setEditingItem, setShowEditModal }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Address & Location</h3>
                        <p className="text-sm text-gray-500">Physical business location</p>
                    </div>
                </div>
                <button onClick={() => onEdit('address')} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-bold">
                    <Edit className="w-4 h-4" />EDIT ALL
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address Line 1</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.address1 || 'Not specified'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Address Line 1', field: 'address1', value: sp.address1 }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address Line 2</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.address2 || 'Not specified'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Address Line 2', field: 'address2', value: sp.address2 }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address Line 3</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.address3 || 'Not specified'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Address Line 3', field: 'address3', value: sp.address3 }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">City</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.city || 'N/A'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'City', field: 'city', value: sp.city }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Postal Code</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900 font-mono">{sp.postalCode || 'N/A'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Postal Code', field: 'postalCode', value: sp.postalCode }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Region</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.region || 'N/A'}</p>
                                    <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Region', field: 'region', value: sp.region }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Country</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{sp.country || 'N/A'}</p>
                                    <button onClick={() => { setEditSection('address'); setEditingItem(sp); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg aspect-video flex flex-col items-center justify-center border border-gray-200 group relative overflow-hidden">
                    <MapPin className="w-12 h-12 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2 font-medium">Map Preview</p>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${sp.address1}, ${sp.city}, ${sp.country}`)}`, '_blank')}
                            className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-100"
                        >
                            <ExternalLink className="w-4 h-4" />Google Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressInfo;
