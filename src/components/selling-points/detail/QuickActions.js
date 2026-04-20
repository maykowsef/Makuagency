import { Sparkles, Globe, Trash2, PhoneCall, Save, Search, Bot, Flag, Clock, Handshake, MessageSquare, Settings } from 'lucide-react';

const QuickActions = ({
    sp,
    onShowAI,
    onShowPublish,
    onUnpublish,
    onScheduleCall,
    onExportExcel,
    onSearchInternet,
    onFlagHasWebsite,
    existingMinisite,
    currentSchedule,
    onEditMinisite,
    customTemplates = []
}) => {
    const template = existingMinisite ? customTemplates.find(t => String(t.id) === String(existingMinisite.templateId)) : null;
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />Quick Actions
                </h3>
            </div>
            <div className="p-4 space-y-3">
                <button
                    onClick={onShowAI}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all group border border-purple-100"
                >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold">Ask AI Assistant</p>
                        <p className="text-[10px] opacity-70">Optimize profile data</p>
                    </div>
                </button>

                {existingMinisite ? (
                    <div className="space-y-2">
                        <button
                            onClick={() => window.open(`/?view=${template?.view || 'custom-template'}&id=${existingMinisite.id}`, '_blank')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-all group border border-green-100"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">View Website</p>
                                <p className="text-[10px] opacity-70">Live on {existingMinisite.domain}</p>
                            </div>
                        </button>
                        <button
                            onClick={onEditMinisite}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all group border border-orange-100"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Settings className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">Edit Settings</p>
                                <p className="text-[10px] opacity-70">Customize appearance</p>
                            </div>
                        </button>
                        <button
                            onClick={onUnpublish}
                            className="w-full text-center py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all font-medium"
                        >
                            Unpublish Website
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onShowPublish}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all group border border-indigo-100"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold">Publish Minisite</p>
                            <p className="text-[10px] opacity-70">Create custom business site</p>
                        </div>
                    </button>
                )}

                <div className="h-px bg-gray-100 my-2" />

                <div className="grid grid-cols-2 gap-2">
                    {currentSchedule ? (
                        <div className="col-span-1 flex flex-col items-center justify-center p-3 rounded-xl border border-orange-200 bg-orange-50 gap-1 overflow-hidden">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <span className="text-[10px] font-bold text-orange-700 truncate w-full text-center">Scheduled</span>
                            <span className="text-[8px] text-orange-600 truncate w-full text-center">{new Date(currentSchedule.date).toLocaleDateString()}</span>
                        </div>
                    ) : (
                        <button onClick={onScheduleCall} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all gap-2 group">
                            <PhoneCall className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                            <span className="text-xs font-bold text-gray-600">Schedule Call</span>
                        </button>
                    )}
                    <button onClick={onExportExcel} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all gap-2 group">
                        <Save className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                        <span className="text-xs font-bold text-gray-600">Export PDF</span>
                    </button>
                    <button onClick={onSearchInternet} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all gap-2 group">
                        <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="text-xs font-bold text-gray-600">Search Google</span>
                    </button>
                    <button
                        onClick={onFlagHasWebsite}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 group ${sp.website
                            ? 'border-red-300 bg-red-50 hover:bg-red-100'
                            : 'border-gray-100 hover:border-red-200 hover:bg-red-50'
                            }`}
                    >
                        <Flag className={`w-5 h-5 ${sp.website
                            ? 'text-red-600'
                            : 'text-gray-400 group-hover:text-red-600'
                            }`} />
                        <span className="text-xs font-bold text-gray-600">
                            {sp.website ? 'Has Website ✓' : 'Flag Website'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
