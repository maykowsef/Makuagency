import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, User, Building2, Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Brain } from 'lucide-react';

const ContactForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', zip: '', country: '' },
        social: { linkedin: '', facebook: '', instagram: '' },
        description: '',
        psychofile: {
            mbti: '',
            type: '',
            color: 'Blue',
            traits: '',
            howToConvince: '',
            preferredColors: []
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e, section = null, subSection = null) => {
        const { name, value } = e.target;
        if (section) {
            if (subSection) {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subSection]: {
                            ...prev[section][subSection],
                            [name]: value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTraitChange = (e) => {
        const traits = e.target.value.split(',').map(t => t.trim());
        setFormData(prev => ({
            ...prev,
            psychofile: {
                ...prev.psychofile,
                traits: traits
            }
        }));
    };

    // Helper to handle trait input as string for the form
    const traitInputValue = Array.isArray(formData.psychofile.traits)
        ? formData.psychofile.traits.join(', ')
        : formData.psychofile.traits;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ];

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    {initialData ? 'Edit Contact' : 'Add New Contact'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-600" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={formData.address.street}
                                onChange={(e) => handleChange(e, 'address')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.address.city}
                                    onChange={(e) => handleChange(e, 'address')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="Zip Code"
                                    value={formData.address.zip}
                                    onChange={(e) => handleChange(e, 'address')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.address.state}
                                onChange={(e) => handleChange(e, 'address')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.address.country}
                                onChange={(e) => handleChange(e, 'address')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Psychological Profile */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" /> Psychological Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">MBTI Type</label>
                            <select
                                name="mbti"
                                value={formData.psychofile.mbti}
                                onChange={(e) => handleChange(e, 'psychofile')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">Select MBTI...</option>
                                {mbtiTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Personality Pattern</label>
                            <select
                                name="type"
                                value={formData.psychofile.type}
                                onChange={(e) => handleChange(e, 'psychofile')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">Select Pattern...</option>
                                <option value="Driver (D)">Driver (D)</option>
                                <option value="Expressive (I)">Expressive (I)</option>
                                <option value="Amiable (S)">Amiable (S)</option>
                                <option value="Analytical (C)">Analytical (C)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traits (comma separated)</label>
                        <input
                            type="text"
                            value={traitInputValue}
                            onChange={handleTraitChange}
                            placeholder="Results-oriented, Direct, Competitive"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">How to Convince</label>
                        <textarea
                            name="howToConvince"
                            value={formData.psychofile.howToConvince}
                            onChange={(e) => handleChange(e, 'psychofile')}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color Profile</label>
                        <select
                            name="color"
                            value={formData.psychofile.color}
                            onChange={(e) => handleChange(e, 'psychofile')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                            <option value="Yellow">Yellow</option>
                            <option value="Green">Green</option>
                        </select>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-indigo-600" /> Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="linkedin"
                            placeholder="LinkedIn URL"
                            value={formData.social.linkedin}
                            onChange={(e) => handleChange(e, 'social')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            name="facebook"
                            placeholder="Facebook URL"
                            value={formData.social.facebook}
                            onChange={(e) => handleChange(e, 'social')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram URL"
                            value={formData.social.instagram}
                            onChange={(e) => handleChange(e, 'social')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Description</h3>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Contact
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
