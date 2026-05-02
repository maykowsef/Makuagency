import React from 'react';
import { ImageIcon, Plus, Download, Trash2, CheckCircle2, FileText, Edit, Copy, Clock } from 'lucide-react';

const LogosNotes = ({
    sp,
    activeLogosPage,
    setActiveLogosPage,
    onAddLogo,
    onDeleteLogo,
    onSetCurrentLogo,
    onAddNote,
    onEditNote,
    onDeleteNote,
    currentLogosItems,
    totalLogosPages,
    Pagination,
    formatDate
}) => {
    // COMPREHENSIVE NULL CHECKS
    if (!sp || typeof sp !== 'object') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-600" /> Logos & Notes
                    </h3>
                </div>
                <div className="p-4">
                    <p className="text-gray-500">Logos and notes data not available.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Logos</h3>
                    </div>
                    <button onClick={onAddLogo} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors border border-indigo-100">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {currentLogosItems.map((logo) => (
                        <div key={logo.id} className={`p-4 rounded-xl border-2 transition-all group ${logo.isCurrent ? 'border-indigo-100 bg-indigo-50/30' : 'border-gray-50 bg-gray-50 hover:border-indigo-100'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                    <img src={logo.imageUrl} alt={logo.version} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 truncate text-sm">{logo.version || 'Logo Version'}</h4>
                                        {logo.isCurrent && (
                                            <span className="flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                <CheckCircle2 className="w-3 h-3" /> CURRENT
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                                        <span>Added {formatDate(logo.uploadDate)}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>By {logo.uploadedBy?.name || 'System'}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!logo.isCurrent && (
                                        <button
                                            onClick={() => onSetCurrentLogo(logo.id)}
                                            className="p-2 hover:bg-white rounded-lg text-green-600 border border-transparent hover:border-green-100 shadow-sm transition-all"
                                            title="Set as Current"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => window.open(logo.imageUrl, '_blank')}
                                        className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-200 shadow-sm transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteLogo('logoHistory', logo.id)}
                                        className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-600 border border-transparent hover:border-red-200 shadow-sm transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {totalLogosPages > 1 && (
                        <Pagination
                            currentPage={activeLogosPage}
                            totalPages={totalLogosPages}
                            onPageChange={setActiveLogosPage}
                        />
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Internal Notes</h3>
                    </div>
                    <button onClick={onAddNote} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors border border-amber-100">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {sp.notes?.map((note) => (
                        <div key={note.id} className="group relative p-4 bg-gray-50 rounded-xl border border-transparent hover:border-amber-200 transition-all hover:bg-amber-50/30">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <img src={note.author?.avatar} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="" />
                                    <span className="text-xs font-bold text-gray-900">{note.author?.name}</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {formatDate(note.date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEditNote(note)} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-100 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => onDeleteNote('note', note.id)} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-100 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed pl-8">{note.text}</p>
                        </div>
                    ))}

                    {(!sp.notes || sp.notes.length === 0) && (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-2xl">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-gray-300" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">No notes yet</h4>
                            <p className="text-xs text-gray-400 mb-4">Internal notes are only visible to team members.</p>
                            <button onClick={onAddNote} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-all shadow-sm">
                                ADD FIRST NOTE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogosNotes;
