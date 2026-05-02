import React from 'react';
import { Globe, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

const SocialMedia = ({ sp, onAdd, onEdit, onDelete }) => {
    // COMPREHENSIVE NULL CHECKS
    if (!sp || typeof sp !== 'object') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" /> Social Media Profiles
                    </h3>
                </div>
                <div className="p-4">
                    <p className="text-gray-500">Social media data not available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" /> Social Media Profiles
                </h3>
                <button
                    onClick={() => onAdd('social')}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Profile
                </button>
            </div>

            <div className="p-6">
                {sp.socialMedia?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sp.socialMedia.map((social) => (
                            <div key={social.id} className="group p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${social.isPrimary ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-gray-900 capitalize">{social.platform}</h4>
                                                {social.isPrimary && <span className="text-[8px] bg-indigo-100 text-indigo-700 font-black px-1.5 py-0.5 rounded uppercase">PRIMARY</span>}
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium">{social.followers || '0'} followers</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEdit('social', social)} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-100">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => onDelete('social', social.id)} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-100">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-indigo-600 hover:border-indigo-200 transition-all"
                                >
                                    <span className="truncate">{social.url}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Globe className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 italic">No social media profiles linked yet.</p>
                        <button onClick={() => onAdd('social')} className="mt-2 text-xs font-bold text-indigo-600 hover:underline tracking-tight uppercase">Add first profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialMedia;
