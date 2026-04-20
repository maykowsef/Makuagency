import React, { useState, useEffect, useMemo } from 'react';
import {
    Users, Search, Send, FileText, Video, Phone, Paperclip,
    MoreVertical, Smile, ImageIcon, Link as LinkIcon, ShoppingCart, CheckCircle,
    Bug, Lightbulb, AlertTriangle, Check, Clock, Eye, EyeOff, Minus
} from 'lucide-react';

const ChatInterface = ({ currentUser, allMessages = [], onSendMessage, onUpdateStatus, onMarkRead, onAttachItem, users: propUsers }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [showAttachSP, setShowAttachSP] = useState(false);
    const [showAttachContact, setShowAttachContact] = useState(false);
    const [activeCall, setActiveCall] = useState(null); // 'video' or 'audio'

    const generalChannel = {
        id: 'general',
        name: 'General Team Chat',
        role: 'Everyone',
        avatar: 'https://ui-avatars.com/api/?name=Team&background=6366f1&color=fff',
        status: 'online',
        isChannel: true
    };

    // Mock Data for Attachments (Preserved)
    const mockSellingPoints = [
        { id: 101, name: 'Premium Package - Tesla Dealership', company: 'Tesla Inc.' },
        { id: 102, name: 'Basic SEO - Local Bakery', company: 'Sweet Treats' },
        { id: 103, name: 'Web Dev - Startup Hub', company: 'TechStars' },
    ];

    const mockContacts = [
        { id: 201, name: 'Alice Johnson', role: 'CEO' },
        { id: 202, name: 'Bob Smith', role: 'Marketing Director' },
    ];

    const mockUsers = [
        { id: 1, name: 'Makrem Youssef', role: 'Employer Data Specialist', avatar: 'https://ui-avatars.com/api/?name=Makrem&background=4F46E5&color=fff', status: 'online' },
        { id: 2, name: 'System Admin', role: 'Administrator', avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=dc2626&color=fff', status: 'online' },
        { id: 3, name: 'John Doe', role: 'Sales Lead', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff', status: 'offline' },
    ];

    // Use props users if available, otherwise mock
    const otherUsers = (propUsers || mockUsers).filter(u => u.id !== currentUser.id);

    const selfUser = {
        ...currentUser,
        id: currentUser.id,
        name: 'Me (Notes)',
        role: 'Personal Space',
        status: 'online',
        isSelf: true
    };

    const users = [selfUser, ...otherUsers];

    // Filter messages for the selected conversation
    const currentMessages = useMemo(() => {
        if (!selectedUser) return [];
        if (selectedUser.id === 'general') {
            return allMessages.filter(msg => msg.receiverId === 'general')
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
        return allMessages.filter(msg =>
            (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
            (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [allMessages, selectedUser, currentUser]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        if (user.id !== 'general' && !user.isSelf) {
            onMarkRead(user.id);
        }
    };

    // Mark messages as read when new ones arrive in the current selected conversation
    useEffect(() => {
        if (selectedUser && selectedUser.id !== 'general' && !selectedUser.isSelf) {
            const hasUnread = allMessages.some(m => m.senderId === selectedUser.id && m.receiverId === currentUser.id && !m.read);
            if (hasUnread) {
                onMarkRead(selectedUser.id);
            }
        }
    }, [allMessages, selectedUser, currentUser.id, onMarkRead]);

    // Helper to get last message and unread count for a user
    const getUserMeta = (userId) => {
        const userMsgs = allMessages.filter(m =>
            (m.senderId === userId && m.receiverId === currentUser.id) ||
            (m.senderId === currentUser.id && m.receiverId === userId)
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const lastMsg = userMsgs[0];
        const unreadCount = allMessages.filter(m => m.senderId === userId && m.receiverId === currentUser.id && !m.read).length;

        return { lastMsg, unreadCount };
    };

    const handleSend = () => {
        if (!inputValue.trim() || !selectedUser) return;
        onSendMessage({
            text: inputValue,
            receiverId: selectedUser.id,
            type: 'text',
            senderName: currentUser.name
        });
        setInputValue('');
    };

    const handleAttach = (type, item) => {
        onSendMessage({
            text: `Attached ${type}: ${item.name}`,
            receiverId: selectedUser.id,
            type: 'attachment',
            attachment: { type, item }
        });
        setShowAttachSP(false);
        setShowAttachContact(false);
    };

    const startCall = (type) => {
        setActiveCall(type);
    };

    const endCall = () => {
        setActiveCall(null);
    };

    const renderMessageContent = (msg) => {
        const isMe = msg.senderId === currentUser.id;

        if (msg.type === 'bug_report') {
            return (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 w-64 md:w-80">
                    <div className="flex items-center gap-2 mb-2 border-b border-red-100 pb-2">
                        <Bug className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-red-800">Bug Report</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${msg.bugDetails.priority === 'Critical' ? 'bg-red-600 text-white' :
                            msg.bugDetails.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {msg.bugDetails.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium mb-1">Description:</p>
                    <p className="text-sm text-gray-600 mb-3 italic">"{msg.bugDetails.description}"</p>

                    {msg.bugDetails.screenshot && (
                        <div className="mb-3 p-2 bg-white rounded border border-gray-200 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-indigo-600 underline truncate">{msg.bugDetails.screenshot}</span>
                        </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-red-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.status === 'Fixed' ? 'bg-green-100 text-green-700' :
                                msg.status === 'Working on it' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>{msg.status || 'Open'}</span>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {currentUser.role === 'Administrator' && (
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => onUpdateStatus(msg.id, 'Working on it')}
                                className="flex-1 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition-colors"
                            >
                                Working on it
                            </button>
                            <button
                                onClick={() => onUpdateStatus(msg.id, 'Fixed')}
                                className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition-colors"
                            >
                                Mark Fixed
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (msg.type === 'suggestion') {
            return (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 w-64 md:w-80">
                    <div className="flex items-center gap-2 mb-2 border-b border-yellow-100 pb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800">Suggestion</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{msg.suggestionDetails.title}</p>
                    <p className="text-sm text-gray-600 mb-3">"{msg.suggestionDetails.description}"</p>

                    <div className="mt-2 pt-2 border-t border-yellow-100">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            msg.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-gray-200 text-gray-700'
                            }`}>{msg.status || 'Pending'}</span>
                    </div>

                    {/* Admin Actions */}
                    {currentUser.role === 'Administrator' && msg.status === 'Pending Review' && (
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => onUpdateStatus(msg.id, 'Approved')}
                                className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => onUpdateStatus(msg.id, 'Rejected')}
                                className="flex-1 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        const isGeneral = selectedUser?.id === 'general';

        return (
            <div className={`p-4 rounded-2xl shadow-sm text-sm relative border transition-all ${isMe
                ? 'bg-indigo-600 text-white rounded-br-none border-indigo-500 shadow-indigo-100'
                : 'bg-white text-gray-800 rounded-bl-none border-gray-100 shadow-gray-100 hover:border-gray-200'
                }`}>
                {/* Show sender name in General Chat for others */}
                {isGeneral && !isMe && (
                    <div className="text-[10px] items-center gap-1 mb-1 font-bold text-indigo-600 opacity-90 block tracking-tight">
                        {msg.senderName || 'Coworker'}
                    </div>
                )}

                <div className="leading-relaxed">
                    {msg.text}
                </div>

                <div className={`flex items-center justify-between gap-4 mt-2 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                    <span className="text-[10px] font-medium tracking-tighter">
                        {msg.time}
                    </span>

                    {isMe && !isGeneral && (
                        <div className="flex items-center gap-1 group/receipt">
                            {msg.read ? (
                                <div className="flex items-center gap-1 text-indigo-200">
                                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover/receipt:opacity-100 transition-opacity">Seen</span>
                                    <Eye className="w-3 h-3" />
                                </div>
                            ) : (
                                <EyeOff className="w-3 h-3 opacity-40" />
                            )}
                        </div>
                    )}
                </div>

                {msg.attachment && (
                    <div className="mt-3 p-3 bg-black/5 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                        <div className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm">
                            {msg.attachment.type === 'Selling Point' ? <ShoppingCart className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${isMe ? 'text-white' : 'text-gray-900'}`}>{msg.attachment.item.name}</p>
                            <span className={`text-[9px] font-bold uppercase tracking-widest opacity-70 ${isMe ? 'text-indigo-100' : 'text-gray-500'}`}>{msg.attachment.type}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white border border-gray-200 rounded-2xl m-4 md:m-8 lg:m-12 shadow-sm">
            {/* Sidebar: User List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Team Chat</h2>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search coworkers..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {[generalChannel, ...users].map(user => {
                        const { lastMsg, unreadCount } = user.id === 'general' ? { lastMsg: null, unreadCount: 0 } : getUserMeta(user.id);

                        return (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 relative ${selectedUser?.id === user.id ? 'bg-indigo-50/50 border-r-4 border-indigo-600' : ''}`}
                            >
                                <div className="relative shrink-0">
                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all" />
                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${(user.status === 'online' || user.status === 'Active') ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className={`text-sm tracking-tight truncate ${unreadCount > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{user.name}</p>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{lastMsg?.time || ''}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest truncate max-w-[120px]">{user.role}</p>
                                        {(unreadCount > 0 && !user.isSelf) && (
                                            <span className="flex-shrink-0 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow-sm animate-bounce">
                                                {unreadCount} NEW
                                            </span>
                                        )}
                                    </div>
                                    {lastMsg && (
                                        <p className={`text-xs mt-1 truncate ${unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
                                            {lastMsg.senderId === currentUser.id ? 'You: ' : ''}{lastMsg.text}
                                        </p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-gray-50/30">
                    {/* Header */}
                    <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Now</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => startCall('audio')} className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                            <button onClick={() => startCall('video')} className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                            <button className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {currentMessages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        )}
                        {currentMessages.map((msg, idx) => (
                            <div key={msg.id} className={`flex ${msg.sender === currentUser.id || msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] group`}>
                                    {renderMessageContent(msg)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Attach Bar */}
                    <div className="px-6 flex gap-2">
                        <button onClick={() => setShowAttachSP(true)} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase flex items-center gap-1.5 shadow-sm">
                            <ShoppingCart className="w-3.5 h-3.5" /> Attach Selling Point
                        </button>
                        <button onClick={() => setShowAttachContact(true)} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase flex items-center gap-1.5 shadow-sm">
                            <Users className="w-3.5 h-3.5" /> Attach Contact
                        </button>
                    </div>

                    {/* Input Container */}
                    <div className="p-4 md:p-6 bg-transparent shrink-0">
                        <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-2">
                            <button className="p-2.5 text-gray-400 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Write a message..."
                                className="flex-1 px-2 py-3 bg-transparent border-none text-sm outline-none placeholder:text-gray-400"
                            />
                            <div className="flex items-center gap-1 px-2 border-l border-gray-100 ml-2">
                                <button className="p-2 text-gray-400 hover:text-indigo-600"><Smile className="w-5 h-5" /></button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600"><ImageIcon className="w-5 h-5" /></button>
                            </div>
                            <button
                                onClick={handleSend}
                                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/20">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a coworker to start chatting</h3>
                    <p className="text-sm text-gray-500 max-w-xs text-center mb-6">Communicate with your team, share records, and hold meetings directly in the CRM.</p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md px-6">
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <p className="font-bold text-gray-900 text-sm mb-1">Employers</p>
                            <div className="flex -space-x-2 overflow-hidden">
                                {users.filter(u => u.role !== 'Administrator').map(u => (
                                    <img key={u.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={u.avatar} alt="" />
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <p className="font-bold text-gray-900 text-sm mb-1">Admin Chats</p>
                            <div className="flex -space-x-2 overflow-hidden">
                                {users.filter(u => u.role === 'Administrator').map(u => (
                                    <img key={u.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={u.avatar} alt="" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Attach Selling Point Modal */}
            {showAttachSP && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                            <h3 className="font-bold text-gray-900">Attach Selling Point</h3>
                            <button onClick={() => setShowAttachSP(false)} className="p-1 hover:bg-white rounded-full"><CheckCircle className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-2 space-y-2">
                            {mockSellingPoints.map(sp => (
                                <button key={sp.id} onClick={() => handleAttach('Selling Point', sp)} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg group transition-colors flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">SP</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{sp.name}</p>
                                        <p className="text-xs text-gray-500">{sp.company}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Attach Contact Modal */}
            {showAttachContact && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                            <h3 className="font-bold text-gray-900">Attach Contact</h3>
                            <button onClick={() => setShowAttachContact(false)} className="p-1 hover:bg-white rounded-full"><CheckCircle className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-2 space-y-2">
                            {mockContacts.map(c => (
                                <button key={c.id} onClick={() => handleAttach('Contact', c)} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg group transition-colors flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">{c.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{c.name}</p>
                                        <p className="text-xs text-gray-500">{c.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Call Overlay */}
            {activeCall && (
                <div className="fixed inset-0 bg-gray-900/95 z-[60] flex flex-col items-center justify-center text-white backdrop-blur">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-2xl animate-pulse">
                        <img src={selectedUser?.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{selectedUser?.name}</h2>
                    <p className="text-indigo-300 mb-12 animate-pulse">{activeCall === 'video' ? 'Video Calling...' : 'Calling...'}</p>

                    <div className="flex items-center gap-8">
                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all"><MoreVertical className="w-6 h-6" /></button>
                        <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/50 transition-transform hover:scale-110"><Phone className="w-8 h-8 rotate-[135deg]" /></button>
                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all"><Video className="w-6 h-6" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
