import React from 'react';
import { Megaphone, Plus, ExternalLink, Edit, Trash2, ShoppingCart, Info, TrendingUp, ImageIcon, Gauge, Fuel } from 'lucide-react';

const AnnouncementProfiles = ({
    sp,
    activeAnnouncementsPage,
    setActiveAnnouncementsPage,
    onAdd,
    onEdit,
    onDelete,
    onAddStock,
    onEditStock,
    onDeleteStock,
    currentAnnouncementsItems,
    totalAnnouncementsPages,
    Pagination,
    ANNOUNCEMENT_SITES
}) => {
    const getHostname = (url) => {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Announcement Profiles</h3>
                        <p className="text-sm text-gray-500">{sp.announcementProfiles?.length || 0} active platforms</p>
                    </div>
                </div>
                <button onClick={() => onAdd('announcements')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-bold">
                    <Plus className="w-4 h-4" />ADD PROFILE
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {currentAnnouncementsItems.map((profile) => (
                    <div key={profile.id} className="border border-gray-100 rounded-xl p-6 bg-gray-50/50">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                                    {profile.url && getHostname(profile.url) ? (
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${getHostname(profile.url)}&sz=64`}
                                            alt={profile.platform}
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <span className="text-2xl" style={{ display: (profile.url && getHostname(profile.url)) ? 'none' : 'block' }}>
                                        {ANNOUNCEMENT_SITES.find(s => s.id === profile.siteId)?.icon || '📢'}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900">{profile.platform}</h4>
                                        {profile.isPrimary && <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">PRIMARY</span>}
                                    </div>
                                    <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                        {profile.url} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onEdit('announcements', profile)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-200">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDelete('announcements', profile.id)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-200">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Target</p>
                                <p className="text-2xl font-bold text-gray-900">{profile.targetListings || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Found</p>
                                <p className="text-2xl font-bold text-gray-900">{profile.stockListings?.length || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Completion</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-2xl font-bold ${profile.stockListings?.length >= (profile.targetListings || 0) ? 'text-green-600' : 'text-orange-600'}`}>
                                        {profile.targetListings > 0 ? Math.round((profile.stockListings?.length / profile.targetListings) * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-gray-400" />Stock & Ads
                                </h5>
                                <button onClick={() => onAddStock(profile.id)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1 border border-indigo-100">
                                    <Plus className="w-3 h-3" />ADD AD
                                </button>
                            </div>

                            {profile.stockListings?.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.stockListings.map((listing) => (
                                        <div key={listing.id} className="bg-white p-4 rounded-lg border border-gray-100 group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-200 transition-colors">
                                                        {listing.imageUrls?.[0] ? (
                                                            <img src={listing.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        )}
                                                        {listing.imageUrls?.length > 1 && (
                                                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1.5 font-bold">
                                                                +{listing.imageUrls.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h6 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                                            {listing.name || 'Untitled Ad'}
                                                            {listing.vehicleType && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold uppercase tracking-tight">{listing.vehicleType}</span>}
                                                        </h6>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">Year: <strong>{listing.year}</strong></span>
                                                            <span className="flex items-center gap-1">Price: <strong className="text-gray-900">{listing.price}€</strong></span>
                                                            {listing.mileage && (
                                                                <span className="flex items-center gap-1">
                                                                    <Gauge className="w-3.5 h-3.5 text-gray-400" />
                                                                    <strong>{Number(listing.mileage).toLocaleString()} km</strong>
                                                                </span>
                                                            )}
                                                            {listing.fuelType && (
                                                                <span className="flex items-center gap-1 uppercase tracking-tight">
                                                                    <Fuel className="w-3.5 h-3.5 text-gray-400" />
                                                                    <strong>{listing.fuelType}</strong>
                                                                </span>
                                                            )}
                                                            <a href={listing.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold">
                                                                Ad Link <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                        {listing.description && (
                                                            <p className="mt-2 text-xs text-gray-500 line-clamp-2 italic">{listing.description}</p>
                                                        )}
                                                        {listing.imageUrls?.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {listing.imageUrls.map((url, idx) => (
                                                                    <div key={idx} className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 group/img relative">
                                                                        <img
                                                                            src={url}
                                                                            alt=""
                                                                            className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform"
                                                                            onClick={() => window.open(url, '_blank')}
                                                                            onError={(e) => {
                                                                                e.target.src = 'https://via.placeholder.com/150?text=Invalid';
                                                                            }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                                                                            <ImageIcon className="w-3 h-3 text-white" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => onEditStock(profile.id, listing)} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-indigo-600">
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => onDeleteStock(profile.id, listing.id)} className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-red-600">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-200">
                                    <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No ads scanned yet for this platform.</p>
                                    <button onClick={() => onAddStock(profile.id)} className="mt-2 text-xs font-bold text-indigo-600 hover:underline">Start manual scan</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {
                totalAnnouncementsPages > 1 && (
                    <Pagination
                        currentPage={activeAnnouncementsPage}
                        totalPages={totalAnnouncementsPages}
                        onPageChange={setActiveAnnouncementsPage}
                    />
                )
            }
        </div >
    );
};

export default AnnouncementProfiles;
