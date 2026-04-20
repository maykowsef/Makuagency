import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Gauge, Fuel, ImageIcon, X, Car } from 'lucide-react';

const FUEL_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plugin Hybrid', 'LPG', 'Other'];
const TRANSMISSION_OPTIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'];

const defaultForm = {
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel: 'Petrol',
    transmission: 'Automatic',
    description: '',
    image: '',
    features: ''
};

const VehicleModal = ({ isOpen, onClose, onSave, initial }) => {
    const [form, setForm] = useState(initial || defaultForm);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        setForm(initial || defaultForm);
    }, [initial, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.make || !form.model) {
            alert('Name, Make and Model are required.');
            return;
        }
        setSaving(true);
        // Convert features string to array
        const features = form.features
            ? form.features.split(',').map(f => f.trim()).filter(Boolean)
            : [];
        await onSave({ ...form, features });
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Car className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {form.id ? 'Edit Vehicle' : 'Add Vehicle to Inventory'}
                            </h2>
                            <p className="text-xs text-gray-500">This will appear on the minisite template</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Vehicle Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Mercedes-Benz S500 AMG"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    {/* Make & Model */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Make (Brand) *</label>
                            <input
                                name="make"
                                value={form.make}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Mercedes-Benz"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Model *</label>
                            <input
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                required
                                placeholder="e.g. S500"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Year & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                            <input
                                name="year"
                                type="number"
                                value={form.year}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (€)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="e.g. 25000"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Mileage, Fuel, Transmission */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mileage (km)</label>
                            <input
                                name="mileage"
                                type="number"
                                value={form.mileage}
                                onChange={handleChange}
                                placeholder="e.g. 45000"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Type</label>
                            <select
                                name="fuel"
                                value={form.fuel}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                {FUEL_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Transmission</label>
                            <select
                                name="transmission"
                                value={form.transmission}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                {TRANSMISSION_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="https://example.com/car.jpg"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        {form.image && (
                            <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl border border-gray-200" onError={e => e.target.style.display='none'} />
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe the vehicle condition, history, options..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        />
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Features <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                        <input
                            name="features"
                            value={Array.isArray(form.features) ? form.features.join(', ') : (form.features || '')}
                            onChange={handleChange}
                            placeholder="e.g. Navigation, Sunroof, Heated Seats, Backup Camera"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-60 text-sm"
                        >
                            {saving ? 'Saving...' : (form.id ? 'Update Vehicle' : 'Add to Inventory')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InventoryList = ({ inventory = [], onAdd, onEdit, onDelete, spId }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const spInventory = inventory.filter(item => String(item.sellingPointId) === String(spId));

    const handleAdd = () => {
        setEditingItem(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem({
            ...item,
            features: Array.isArray(item.features) ? item.features.join(', ') : (item.features || '')
        });
        setShowModal(true);
    };

    const handleSave = async (formData) => {
        if (editingItem?.id) {
            // Edit existing
            if (onEdit) await onEdit({ ...formData, id: editingItem.id });
        } else {
            // Add new
            if (onAdd) await onAdd(formData);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this vehicle from inventory?')) {
            if (onDelete) await onDelete(id);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Physical Inventory</h3>
                        <p className="text-sm text-gray-500">{spInventory.length} vehicles in stock — shown on your minisite</p>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-bold"
                >
                    <Plus className="w-4 h-4" /> ADD VEHICLE
                </button>
            </div>

            {spInventory.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {spInventory.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 group hover:border-indigo-200 transition-all">
                            <div className="flex gap-6">
                                <div className="w-24 h-24 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1 font-medium">Make: <strong className="text-gray-900">{item.make}</strong></span>
                                                <span className="flex items-center gap-1 font-medium">Model: <strong className="text-gray-900">{item.model}</strong></span>
                                                <span className="flex items-center gap-1 font-medium">Year: <strong className="text-gray-900">{item.year}</strong></span>
                                                <span className="flex items-center gap-1 font-medium">Price: <strong className="text-indigo-600 text-sm">{item.price?.toLocaleString()} €</strong></span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-400">
                                                {item.mileage && (
                                                    <span className="flex items-center gap-1">
                                                        <Gauge className="w-3 h-3" /> {Number(item.mileage).toLocaleString()} km
                                                    </span>
                                                )}
                                                {item.fuel && (
                                                    <span className="flex items-center gap-1 uppercase">
                                                        <Fuel className="w-3 h-3" /> {item.fuel}
                                                    </span>
                                                )}
                                                {item.transmission && (
                                                    <span className="flex items-center gap-1">
                                                        <Package className="w-3 h-3" /> {item.transmission}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-100"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    {item.description && (
                                        <p className="text-xs text-gray-500 mt-2 italic line-clamp-1">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No vehicles in inventory yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Add vehicles — they will show on your minisite template automatically.</p>
                </div>
            )}

            <VehicleModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                initial={editingItem}
            />
        </div>
    );
};

export default InventoryList;
