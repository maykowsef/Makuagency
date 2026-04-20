import React, { useEffect, useState } from 'react';
import {
    Phone, Mail, MapPin, Clock, ArrowRight, Star,
    Shield, Fuel, Settings, Gauge, Calendar, ChevronRight,
    Search, X, SlidersHorizontal, ChevronLeft, Menu
} from 'lucide-react';

const TemplateUsedCarDealerPro = ({ sellingPoint }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        make: "",
        year: "",
        fuel: "",
        transmission: "",
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!sellingPoint) return <div className="p-20 text-center bg-slate-950 text-white">Loading Premium Experience...</div>;

    const { name, address1, address2, address3, city, postalCode, phones, emails, overrides = {} } = sellingPoint;

    const fullAddress = [
        address1,
        address2,
        address3,
        postalCode ? `${postalCode} ${city || ''}` : city
    ].filter(Boolean).join(', ');

    const primaryColor = overrides.primaryColor || '#0ea5e9'; // Default sky-500
    const headerText = overrides.heroTitle || overrides.headerText || name;
    const introText = overrides.heroDescription || overrides.introDescription || 'Precision. Performance. Perfection.';

    const phone = phones?.[0]?.number || 'Contact Us';
    const email = emails?.[0]?.email || 'info@dealership.com';

    // Animation classes
    const fadeUp = `transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`;

    const mapCar = (car) => {
        const attributes = car.attributes || {};
        const combined = { ...car, ...attributes };
        return {
            ...combined,
            image: (car.imageUrls && car.imageUrls[0]) || car.image || null,
            name: car.name || "Premium Vehicle",
            price: parseInt(car.price) || 0,
            year: parseInt(combined.year) || 2024,
            mileage: parseInt(combined.mileage) || 0,
            make: combined.make || car.name?.split(' ')[0] || "Premium",
            fuel: combined.fuel || "Petrol",
            transmission: combined.transmission || "Automatic",
            description: car.description || "Elite performance meets unparalleled luxury. This certified unit has been maintained to the highest standards and offers a superior driving experience.",
            features: combined.features || ["Premium Audio", "Navigation", "Climate Control"]
        };
    };

    const pStock = (sellingPoint?.announcementProfiles || []).flatMap(p => p.stockListings || []);
    const allCars = [...(sellingPoint?.stock || []), ...pStock].map(mapCar);

    // Search and Filtering Logic
    const filteredCars = allCars.filter((car) => {
        const matchesSearch =
            searchQuery === "" ||
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (car.make && car.make.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return String(car[key]).toLowerCase() === value.toLowerCase();
        });

        return matchesSearch && matchesFilters;
    });

    // Group vehicles by type (Respecting filters)
    const groupedVehicles = filteredCars.reduce((acc, vehicle) => {
        const type = vehicle.vehicleType || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(vehicle);
        return acc;
    }, {});

    const vehicleCategories = Object.keys(groupedVehicles).sort();

    const getCarDescription = (car) => {
        if (!car?.description) return "Elite performance meets unparalleled luxury.";
        if (typeof car.description === 'object') return car.description.text || "Elite performance meets unparalleled luxury.";
        return car.description;
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500 selection:text-white">
            {/* Top Bar - Professional & Responsive */}
            <nav className="bg-slate-900/80 border-b border-white/5 py-4 px-6 lg:px-12 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <span
                            className="text-2xl font-black tracking-tighter text-sky-500 cursor-pointer"
                            onClick={() => scrollToSection('top')}
                        >
                            {name}
                        </span>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex gap-8">
                            <button onClick={() => scrollToSection('top')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors">Home</button>
                            {vehicleCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => scrollToSection(`section-${cat.replace(/\s+/g, '-').toLowerCase()}`)}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors"
                                >
                                    {cat}s
                                </button>
                            ))}
                            <button onClick={() => scrollToSection('contact')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors">Contact</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 bg-sky-600/10 hover:bg-sky-600 text-sky-400 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border border-sky-500/20">
                            <Phone className="w-3.5 h-3.5" /> {phone}
                        </a>

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 py-10 px-8 animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col gap-8">
                            <button onClick={() => scrollToSection('top')} className="text-2xl font-black uppercase tracking-tight text-left">Home</button>
                            {vehicleCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => scrollToSection(`section-${cat.replace(/\s+/g, '-').toLowerCase()}`)}
                                    className="text-2xl font-black uppercase tracking-tight text-left"
                                >
                                    {cat}s
                                </button>
                            ))}
                            <button onClick={() => scrollToSection('contact')} className="text-2xl font-black uppercase tracking-tight text-left">Contact</button>
                            <a href={`tel:${phone}`} className="flex items-center gap-4 text-sky-400 text-xl font-bold uppercase">
                                <Phone /> {phone}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            <div id="top"></div>

            {/* Hero Section */}
            <header className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={overrides.heroImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"}
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_10s_infinite_alternate]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="max-w-3xl">
                        <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black uppercase tracking-widest text-sky-400 ${fadeUp}`}>
                            <Star className="w-3 h-3 fill-current" /> {overrides.heroSubtitle || "Professional Automotive Excellence"}
                        </div>
                        <h1 className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] ${fadeUp}`}>
                            {headerText.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? `text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500` : ''}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                        <p className={`text-xl text-slate-400 mb-12 font-medium max-w-xl leading-relaxed ${fadeUp} delay-200 tracking-wide`}>
                            {introText}
                        </p>
                        <div className={`flex flex-wrap gap-5 ${fadeUp} delay-500`}>
                            <button onClick={() => scrollToSection('inventory')} className="px-10 py-5 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/40 group">
                                Explore Inventory <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Advanced Filters Section */}
            <section id="inventory" className="py-24 bg-slate-900/30 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="bg-slate-950 p-8 lg:p-12 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-xl -mt-40 relative z-20">
                        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Refine Search</h2>
                                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">Locate your target machine</p>
                            </div>
                            <div className="w-full lg:w-96 relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500 transition-transform group-focus-within:scale-110" />
                                <input
                                    type="text"
                                    placeholder="SEARCH BY MODEL OR BRAND..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-xs font-black uppercase tracking-widest focus:border-sky-500/50 focus:bg-white/10 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { key: 'make', label: 'Manufacturer', icon: Shield },
                                { key: 'year', label: 'Production Year', icon: Calendar },
                                { key: 'fuel', label: 'Energy Source', icon: Fuel },
                                { key: 'transmission', label: 'Shift System', icon: Settings }
                            ].map((f) => (
                                <div key={f.key} className="relative">
                                    <f.icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:border-sky-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        value={filters[f.key]}
                                        onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    >
                                        <option value="" className="bg-slate-900">All {f.label}</option>
                                        {Array.from(new Set(allCars.map(c => c[f.key]).filter(Boolean))).sort().map(val => (
                                            <option key={val} value={val} className="bg-slate-900">{val}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Inventory Sections */}
            {vehicleCategories.map((category) => {
                const categoryCars = groupedVehicles[category];
                return (
                    <section
                        key={category}
                        id={`section-${category.replace(/\s+/g, '-').toLowerCase()}`}
                        className="py-24 bg-slate-950 border-b border-white/5"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            <div className="mb-16 flex items-end justify-between">
                                <div>
                                    <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Class: Premium</p>
                                    <h2 className="text-5xl lg:text-7xl font-black tracking-tight uppercase leading-[0.8]">{category}s</h2>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">Available Units</p>
                                    <p className="text-3xl font-black text-white/20">{categoryCars.length.toString().padStart(2, '0')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {categoryCars.map((car, idx) => (
                                    <div
                                        key={car.id || idx}
                                        onClick={() => { setSelectedCar(car); setActiveImageIndex(0); }}
                                        className="group relative bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/[0.03] transition-all duration-500 cursor-pointer hover:border-sky-500/40 shadow-xl"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                                            <div className="absolute bottom-6 left-8">
                                                <div className="bg-sky-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl">
                                                    ${(car.price || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-10">
                                            <div className="text-sky-500 text-[9px] font-black uppercase tracking-[0.3em] mb-3">{car.make}</div>
                                            <h3 className="text-2xl font-black mb-6 group-hover:text-sky-400 transition-colors uppercase tracking-tight truncate">{car.name}</h3>

                                            <div className="grid grid-cols-2 gap-y-4 border-t border-white/5 pt-6">
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Calendar className="w-4 h-4 text-sky-500/50" /> {car.year}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Gauge className="w-4 h-4 text-sky-500/50" /> {car.mileage?.toLocaleString()} KM
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Fuel className="w-4 h-4 text-sky-500/50" /> {car.fuel}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Settings className="w-4 h-4 text-sky-500/50" /> {car.transmission}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex justify-between items-center group-hover:translate-x-2 transition-transform duration-500">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">View Dossier</span>
                                                <ArrowRight className="w-5 h-5 text-sky-500" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {vehicleCategories.length === 0 && (
                <section className="py-40 text-center">
                    <SlidersHorizontal className="w-12 h-12 text-slate-800 mx-auto mb-6 animate-pulse" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose">No units match your current filter parameters. Expand search criteria.</p>
                </section>
            )}

            {/* Elite Modal */}
            {selectedCar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setSelectedCar(null)}></div>
                    <div className="relative w-full max-w-7xl bg-slate-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]">
                        <button onClick={() => setSelectedCar(null)} className="absolute top-10 right-10 z-10 w-14 h-14 bg-white/5 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90">
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Gallery */}
                        <div className="w-full lg:w-3/5 bg-black relative flex flex-col">
                            <div className="flex-1 relative overflow-hidden">
                                <img
                                    src={(selectedCar.imageUrls && selectedCar.imageUrls[activeImageIndex]) || selectedCar.image}
                                    alt={selectedCar.name}
                                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                                />
                            </div>

                            {/* Thumbnails Row */}
                            <div className="absolute bottom-10 left-10 right-10 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                {(selectedCar.imageUrls || [selectedCar.image]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-24 lg:w-32 aspect-video rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${activeImageIndex === idx ? 'border-sky-500 scale-105 shadow-2xl shadow-sky-500/50' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full lg:w-2/5 p-12 lg:p-20 flex flex-col overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950">
                            <div className="mb-12">
                                <div className="text-sky-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Manifest ID: #{String(selectedCar.id || '').slice(-6) || 'N/A'}</div>
                                <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-4 uppercase leading-[0.9]">{selectedCar.name}</h2>
                                <p className="text-sky-400 font-black text-3xl tracking-tight">${selectedCar.price?.toLocaleString()}</p>
                            </div>

                            <div className="mb-12">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 border-b border-white/5 pb-3">Machine Character</h4>
                                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                    "{getCarDescription(selectedCar)}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-10 mb-12">
                                {[
                                    { l: 'Year', v: selectedCar.year, i: Calendar },
                                    { l: 'Mileage', v: `${selectedCar.mileage?.toLocaleString()} KM`, i: Gauge },
                                    { l: 'Shift', v: selectedCar.transmission, i: Settings },
                                    { l: 'Source', v: selectedCar.fuel, i: Fuel }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                                            <stat.i className="w-3.5 h-3.5 text-sky-500" /> {stat.l}
                                        </div>
                                        <div className="font-black text-lg uppercase">{stat.v || 'N/A'}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-12">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 border-b border-white/5 pb-3">Equipped Systems</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {(selectedCar.features || []).map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <div className="w-1 h-1 rounded-full bg-sky-500" /> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-10 grid grid-cols-1 gap-4">
                                <button className="w-full py-6 bg-sky-600 hover:bg-sky-500 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-sky-500/20 active:scale-[0.98]">
                                    Request Acquisition
                                </button>
                                <a href={`tel:${phone}`} className="w-full py-6 border border-white/10 hover:bg-white/5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center transition-all">
                                    Contact Agent
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer id="contact" className="pt-32 pb-16 px-6 lg:px-12 bg-slate-900 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-20">
                        <div className="col-span-1">
                            <h2 className="text-4xl font-black mb-8 tracking-tighter text-sky-500 uppercase">{name}</h2>
                            <p className="text-slate-400 text-sm leading-[1.8] max-w-md font-medium">
                                The ultimate destination for automotive connoisseurs. We operate at the intersection of performance and prestige, delivering a curated collection of the world's finest machinery to those who refuse to compromise.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 mb-8">Contact Protocol</h4>
                            <ul className="space-y-6 text-sm font-bold  tracking-widest text-slate-300">
                                <li className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                                    <span className="leading-relaxed leading-tight">{fullAddress}</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Phone className="w-5 h-5 text-sky-400" /> {phone}
                                </li>
                                <li className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-sky-400" /> {email}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 mb-8">Service Hours</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                                    <span>Mon — Fri</span>
                                    <span className="text-white">09:00 — 18:00</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                                    <span>Saturday</span>
                                    <span className="text-white">10:00 — 16:00</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                    <span>Sunday</span>
                                    <span className="text-sky-500 italic">By Appointment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 gap-8">
                        <p>© {new Date().getFullYear()} {name} SYSTEMS. ALL RIGHTS PROTECTED.</p>
                        <div className="flex gap-12">
                            <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-sky-500 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TemplateUsedCarDealerPro;
