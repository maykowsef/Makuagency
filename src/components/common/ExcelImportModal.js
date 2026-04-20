import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Database, Users, Building2, ArrowUp, ArrowDown, Trash2, Loader2 } from 'lucide-react';

const ExcelImportModal = ({ isOpen, onClose, onImport }) => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Review/Order, 4: Options
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [previewRows, setPreviewRows] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [mapping, setMapping] = useState({});
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [options, setOptions] = useState({
        injectCompanies: true,
        injectContacts: true,
        skipDuplicates: true
    });
    const fileInputRef = useRef(null);

    const targetFields = [
        { key: 'name', label: 'Business Name', required: true },
        { key: 'street', label: 'Address Line 1', required: false },
        { key: 'address2', label: 'Address Line 2', required: false },
        { key: 'address3', label: 'Address Line 3', required: false },
        { key: 'postalCode', label: 'Postal code', required: false },
        { key: 'city', label: 'City', required: false },
        { key: 'country', label: 'Country', required: false },
        { key: 'phone', label: 'Phone', required: false },
        { key: 'email', label: 'Email', required: false },
    ];

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            // Simple CSV parser (assumes comma separator)
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length > 0) {
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                setHeaders(headers);

                const rows = lines.slice(1, 6).map(line =>
                    line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
                );
                setPreviewRows(rows);

                // Auto-map logic
                const newMapping = {};
                headers.forEach(h => {
                    const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const exactMatch = targetFields.find(f => f.key.toLowerCase() === normalized);
                    if (exactMatch) newMapping[exactMatch.key] = h;
                    else {
                        // Fuzzy matches
                        if (normalized.includes('name') && !newMapping.name) newMapping.name = h;
                        if (normalized.includes('phone')) newMapping.phone = h;
                        if (normalized.includes('mail')) newMapping.email = h;
                        if (normalized.includes('address') || normalized.includes('street')) newMapping.street = h;
                        if (normalized.includes('city')) newMapping.city = h;
                    }
                });
                setMapping(newMapping);
                setStep(2);
            }
        };
        reader.readAsText(file);
    };

    const handleMappingChange = (targetField, sourceHeader) => {
        setMapping(prev => ({ ...prev, [targetField]: sourceHeader }));
    };

    const processData = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length <= 1) return;

            const headerRow = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const dataRows = lines.slice(1);

            const processed = dataRows.map((line, idx) => {
                const cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                const item = { _tempId: idx };

                Object.entries(mapping).forEach(([field, header]) => {
                    const index = headerRow.indexOf(header);
                    if (index !== -1 && cells[index]) {
                        if (['street', 'address2', 'address3', 'city', 'postalCode', 'country'].includes(field)) {
                            if (!item.address) item.address = {};
                            item.address[field] = cells[index];
                        } else {
                            item[field] = cells[index];
                        }
                    }
                });
                return item;
            });
            setMappedData(processed);
            setStep(3); // Go to Review
        };
        reader.readAsText(file);
    };

    const handleMove = (index, direction) => {
        const newData = [...mappedData];
        if (direction === 'up' && index > 0) {
            [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
        } else if (direction === 'down' && index < newData.length - 1) {
            [newData[index + 1], newData[index]] = [newData[index], newData[index + 1]];
        }
        setMappedData(newData);
    };

    const handleDelete = (index) => {
        setMappedData(prev => prev.filter((_, i) => i !== index));
    };

    const handleSort = (type) => {
        const newData = [...mappedData];
        if (type === 'name') {
            newData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
        setMappedData(newData);
    };

    const handleImport = async () => {
        setImporting(true);
        const total = mappedData.length;

        for (let i = 0; i < total; i++) {
            // Real one-by-one injection call - wrapping in array for existing handleBulkImport
            onImport([mappedData[i]], options);

            // Animation/Progress
            await new Promise(r => setTimeout(r, 150));
            setProgress(Math.round(((i + 1) / total) * 100));
        }

        setTimeout(() => {
            onClose();
            setImporting(false);
            setProgress(0);
            setStep(1); // Reset for next time
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileSpreadsheet className="w-6 h-6" /> Bulk Import
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">Inject data from Excel/CSV</p>
                    </div>
                    <button onClick={onClose} disabled={importing} className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center h-full py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <Upload className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-lg font-bold text-gray-700">Click to upload .CSV file</p>
                            <p className="text-sm text-gray-500 mt-2">Supports CSV format (Excel export)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv,.txt"
                                className="hidden"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Map Columns</h3>
                            <p className="text-sm text-gray-500 mb-6">Match your file columns to the CRM fields.</p>
                            <div className="space-y-3">
                                {targetFields.map(field => (
                                    <div key={field.key} className="flex items-center gap-4">
                                        <div className="w-1/3 text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300" />
                                        <select
                                            value={mapping[field.key] || ''}
                                            onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        >
                                            <option value="">Select Column...</option>
                                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Review & Reorder</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleSort('name')} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">Sort A-Z</button>
                                    <button onClick={() => setMappedData([...mappedData].sort(() => Math.random() - 0.5))} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Shuffle</button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Drag/move items to set injection order. <span className="font-bold">{mappedData.length}</span> items ready.</p>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {mappedData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm group hover:border-indigo-300 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                                            <span className="text-[10px] text-center font-bold text-gray-300">{idx + 1}</span>
                                            <button onClick={() => handleMove(idx, 'down')} disabled={idx === mappedData.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{item.name || 'Unknown Name'}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{item.address?.city || 'No City'}</span>
                                                <span>•</span>
                                                <span>{item.phone || 'No Phone'}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Import Options</h3>
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={options.injectCompanies}
                                        onChange={(e) => setOptions(prev => ({ ...prev, injectCompanies: e.target.checked }))}
                                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="font-bold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4" /> Inject Companies</span>
                                        <p className="text-sm text-gray-500 mt-1">If a company name is provided but doesn't exist, create a new company record automatically.</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={options.injectContacts}
                                        onChange={(e) => setOptions(prev => ({ ...prev, injectContacts: e.target.checked }))}
                                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-4 h-4" /> Inject Contacts</span>
                                        <p className="text-sm text-gray-500 mt-1">Extract contact person details (if mapped) and link them to the selling point.</p>
                                    </div>
                                </label>

                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                                    <p className="text-sm text-yellow-800">Note: Rows without a Business Name will be ignored. Existing ID matches will be skipped.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {importing && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Injecting Data...</h3>
                            <p className="text-gray-500 mb-4">Please wait while we process your records one by one.</p>
                            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-sm font-bold text-indigo-600 mt-2">{progress}%</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
                    <button
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        disabled={step === 1 || importing}
                        className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Back
                    </button>

                    {step === 2 ? (
                        <button
                            onClick={processData}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                        >
                            Next: Review Data
                        </button>
                    ) : step < 4 ? (
                        <button
                            onClick={() => setStep(prev => Math.min(4, prev + 1))}
                            disabled={(step === 1 && !file) || importing}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Next: Options
                        </button>
                    ) : (
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {importing ? 'Injecting...' : <><Database className="w-4 h-4" /> Start Injection</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExcelImportModal;
