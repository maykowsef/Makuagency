import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Minimize2, Maximize2, Search, Plus, Edit3, Eye } from 'lucide-react';

const AIChatBubble = ({ onAction, messages, setMessages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Local messages state removed in favor of props

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simple mock AI logic for demonstration
        setTimeout(() => {
            let responseText = "I'm not sure how to handle that yet, but I'm learning!";
            const text = inputValue.toLowerCase();

            if (text.includes('add') && text.includes('selling point')) {
                responseText = "I see you want to add a selling point. I've prepared a draft based on your message. Would you like to view the form?";
                // Auto-suggest action
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: responseText,
                    action: { label: 'Open Form', type: 'add_sp' }
                }]);
            } else if (text.includes('search') || text.includes('find')) {
                responseText = "Searching the CRM for relevant records... I found 3 matching items.";
                setMessages(prev => [...prev, { id: Date.now(), type: 'ai', text: responseText }]);
            } else {
                responseText = "Got it. I'll search or modify based on that. (Mock AI logic active)";
                setMessages(prev => [...prev, { id: Date.now(), type: 'ai', text: responseText }]);
            }

            setIsTyping(false);
        }, 1500);
    };

    const handleActionClick = (action) => {
        if (onAction) onAction(action);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={`bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col transition-all duration-300 mb-4 ${isMinimized ? 'h-14 w-64' : 'h-[500px] w-80 md:w-96'}`}>
                    {/* Header */}
                    <div className="p-4 bg-indigo-600 rounded-t-2xl flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight">AI CRM Assistant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded transition-colors">
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-none'}`}>
                                            {msg.text}
                                            {msg.action && (
                                                <button
                                                    onClick={() => handleActionClick(msg.action)}
                                                    className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs uppercase hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-3 h-3" /> {msg.action.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-2xl rounded-bl-none flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type your command..."
                                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="px-2 py-1 text-[10px] bg-gray-50 text-gray-500 rounded border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all font-bold uppercase tracking-tight flex items-center gap-1">
                                        <Search className="w-3 h-3" /> Search Records
                                    </button>
                                    <button className="px-2 py-1 text-[10px] bg-gray-50 text-gray-500 rounded border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all font-bold uppercase tracking-tight flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Quick Add
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Main Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(79,70,229,0.4)] hover:scale-110 active:scale-95 transition-all group relative animate-bounce"
                >
                    <Bot className="w-7 h-7" />
                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <span className="absolute -left-32 top-3 py-1.5 px-3 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 pointer-events-none">
                        AI CRM Assistant
                    </span>
                </button>
            )}
        </div>
    );
};

export default AIChatBubble;
