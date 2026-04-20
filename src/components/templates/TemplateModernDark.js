import React, { useState, useEffect } from "react";
import {
    Car,
    Calendar,
    Zap,
    Settings,
    MapPin,
    Phone,
    Mail,
    Globe,
    ArrowRight,
    Star,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    Shield,
    Award,
    Clock
} from "lucide-react";

const TemplateModernDark = ({ sellingPoint }) => {
    const overrides = sellingPoint?.overrides || {};
    const name = overrides.headerText || (typeof sellingPoint?.name === 'object' ? sellingPoint.name.text : sellingPoint?.name) || "Neo Motors";
    const description = overrides.introDescription || "Unleashing the Future of Performance";
    const primaryColor = overrides.primaryColor || "#3b82f6"; // Modern Blue

    const addressObj = sellingPoint?.address || {};
    const street = addressObj.street || sellingPoint?.address1;
    const address2 = addressObj.address2 || sellingPoint?.address2;
    const city = sellingPoint?.city || addressObj.city;
    const postalCode = sellingPoint?.postalCode || addressObj.postalCode;
    const country = sellingPoint?.country || addressObj.country;

    const fullAddress = [street, address2, city, postalCode, country].filter(Boolean).join(', ') || "Avenue of Innovation, Cyber City";
    const phones = sellingPoint?.phones || [];
    const primaryPhone = sellingPoint?.phone || (phones.length > 0 ? phones[0].number : "+1 (555) 000-TECH");
    const email = sellingPoint?.email || "contact@neomotors.io";

    const socialMedia = sellingPoint?.socialMedia || [];
    const facebookLink = socialMedia.find(s => s.platform.toLowerCase() === 'facebook')?.url || "#";
    const instagramLink = socialMedia.find(s => s.platform.toLowerCase() === 'instagram')?.url || "#";

    const logoUrl = sellingPoint?.logo || (sellingPoint?.logoHistory || []).find(l => l.isCurrent)?.imageUrl || (sellingPoint?.logos || []).find(l => l.isCurrent)?.url;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mapCar = (car) => {
        const attributes = car.attributes || {};
        const combined = { ...car, ...attributes };
        return {
            ...combined,
            image: (car.imageUrls && car.imageUrls[0]) || car.image || null,
            name: car.name || "Executive Series",
            make: combined.make || "NEO",
            model: combined.model || "X-1",
            price: parseInt(car.price) || 0,
            year: parseInt(combined.year) || 2024,
            mileage: parseInt(combined.mileage) || 0,
            fuel: combined.fuel || "Electric",
            transmission: combined.transmission || "1-Speed Auto",
            description: car.description || "Synthesizing luxury and sustainable speed.",
            features: combined.features || ["Autopilot", "Glass Roof", "Bioweapon Defense Mode"],
            engine: combined.engine || "Dual Motor",
            horsepower: combined.horsepower || 450,
        };
    };

    const pStock = (sellingPoint?.announcementProfiles || []).flatMap(p => p.stockListings || []);
    const cars = [...(sellingPoint?.stock || []), ...pStock].map(mapCar);

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.make.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group cars by vehicleType (use filteredCars to respect search)
    const groupedVehicles = filteredCars.reduce((acc, car) => {
        const type = car.vehicleType || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(car);
        return acc;
    }, {});

    const vehicleCategories = Object.keys(groupedVehicles).sort();

    const getCarDescription = (car) => {
        if (!car?.description) return "Engineered for excellence.";
        if (typeof car.description === 'object') return car.description.text || "Engineered for excellence.";
        return car.description;
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
                        {logoUrl ? (
                            <img src={logoUrl} alt={name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <span className="text-xl font-black tracking-tighter uppercase italic">{name}</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <button onClick={() => scrollToSection('home')} className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-blue-500 transition-colors">Home</button>
                        {vehicleCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => scrollToSection(`category-${cat.replace(/\s+/g, '-').toLowerCase()}`)}
                                className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-blue-500 transition-colors whitespace-nowrap"
                            >
                                {cat}s
                            </button>
                        ))}
                        {['Services', 'About', 'Contact'].map(item => (
                            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-blue-500 transition-colors">
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <a href={`tel:${primaryPhone}`} className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                            <Phone className="w-4 h-4" /> {primaryPhone}
                        </a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
                            {isMenuOpen ? <X /> : <Settings className="animate-spin-slow" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${overrides.heroImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-blue-900/40"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                            <Star className="w-3 h-3 fill-current" /> {overrides.heroSubtitle || "Premium Quality Assured"}
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 uppercase italic tracking-tighter">
                            {(overrides.heroTitle || description).split(' ').map((word, i) => (
                                <span key={i} className={i === (overrides.heroTitle || description).split(' ').length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
                            {overrides.heroDescription || "Excellence is not a skill, it is an attitude. Discover our curated collection of high-performance vehicles designed for those who demand the absolute best."}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => scrollToSection('showroom')} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-fill text-lg font-black uppercase italic tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 flex items-center gap-3">
                                Enter Showroom <ArrowRight className="w-5 h-5" />
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-fill text-lg font-black uppercase italic tracking-wider transition-all">
                                Get In Touch
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">Scroll Down</span>
                    <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
                </div>
            </section>

            {/* Search Bar */}
            <div className="bg-black/50 border-y border-white/5 backdrop-blur-3xl sticky top-[73px] z-40">
                <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                    <Search className="w-5 h-5 text-blue-500" />
                    <input
                        type="text"
                        placeholder="SEARCH THE FUTURE..."
                        className="bg-transparent border-none text-white w-full font-bold uppercase tracking-widest placeholder:text-gray-700 focus:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Showroom */}
            <section id="showroom" className="py-24 bg-black">
                <div className="container mx-auto px-6">
                    {/* Dynamic Sections by Category */}
                    {vehicleCategories.map((category) => {
                        const categoryCars = groupedVehicles[category];
                        return (
                            <div key={category} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} className="mb-32">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                                    <div>
                                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Inventory Phase</p>
                                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">{category}s</h2>
                                        <div className="w-24 h-2 bg-blue-600"></div>
                                    </div>
                                    <p className="text-gray-500 max-w-sm font-medium tracking-wide">
                                        Advanced diagnostics and master engineering applied to every {category.toLowerCase()}.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {categoryCars.map((car, i) => (
                                        <div key={car.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 cursor-pointer" onClick={() => setSelectedCar(car)}>
                                            <div className="relative h-64 overflow-hidden">
                                                <img src={car.image} alt={car.name || car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'} />
                                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-black uppercase tracking-widest border border-white/10">
                                                    {car.year}
                                                </div>
                                                <div className="absolute bottom-4 right-4 bg-blue-600 px-4 py-2 rounded font-black text-xl shadow-xl">
                                                    €{(car.price || 0).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-1 block">{car.make}</span>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 truncate">{car.name || car.model}</h3>

                                                <div className="flex items-center gap-6 mb-8 text-xs font-bold text-gray-500 uppercase tracking-widest flex-wrap">
                                                    <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-blue-500" /> {car.fuel}</div>
                                                    <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-blue-500" /> {car.mileage?.toLocaleString()} KM</div>
                                                </div>

                                                <button className="w-full py-4 border border-white/10 group-hover:bg-white group-hover:text-black transition-all font-black uppercase italic tracking-wider text-sm">
                                                    View Manifest
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {vehicleCategories.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                            <Car className="w-16 h-16 mx-auto text-gray-800 mb-4" />
                            <p className="text-gray-600 font-bold uppercase tracking-widest">No vehicles found in your frequency.</p>
                        </div>
                    )}

                    {filteredCars.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                            <Car className="w-16 h-16 mx-auto text-gray-800 mb-4" />
                            <p className="text-gray-600 font-bold uppercase tracking-widest">No vehicles found in your frequency.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Services */}
            <section id="services" className="py-24 bg-[#050505] relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Precision Maintenance", desc: "Military-grade diagnostics and repair for your high-end machine.", icon: <Settings className="w-8 h-8" /> },
                            { title: "Financial Engineering", desc: "Optimized payment solutions tailored to your economic profile.", icon: <Award className="w-8 h-8" /> },
                            { title: "Ceramic Defense", desc: "Advanced exterior protection to maintain structural brilliance.", icon: <Shield className="w-8 h-8" /> }
                        ].map((s, i) => (
                            <div key={i} className="p-10 bg-black border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all">
                                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8">{s.icon}</div>
                                <h3 className="text-2xl font-black uppercase mb-4 italic tracking-tight">{s.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-black border-t border-white/5 py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
                        <div>
                            <h2 className="text-5xl font-black uppercase italic mb-8 tracking-tighter">Get Connected</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-blue-500"><MapPin /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Base of Operations</p>
                                        <p className="font-bold text-gray-400">{fullAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-blue-500"><Phone /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Secure Line</p>
                                        <p className="font-bold text-gray-400">{primaryPhone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-blue-500"><Mail /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Digital Channel</p>
                                        <p className="font-bold text-gray-400">{email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-white/5">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <input type="text" placeholder="NAME" className="bg-black border-white/10 text-white p-4 font-bold tracking-widest uppercase focus:border-blue-500 transition-colors" />
                                <input type="email" placeholder="EMAIL" className="bg-black border-white/10 text-white p-4 font-bold tracking-widest uppercase focus:border-blue-500 transition-colors" />
                            </div>
                            <textarea placeholder="SYSTEM QUERY" rows="4" className="w-full bg-black border-white/10 text-white p-4 font-bold tracking-widest uppercase focus:border-blue-500 mb-8 transition-colors"></textarea>
                            <button className="w-full py-5 bg-white text-black font-black uppercase italic tracking-[0.2em] transform transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Initiate Protocol
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span className="text-white">© {new Date().getFullYear()} {name} DESIGN SYSTEM</span>
                            <span>| ALL RIGHTS ARCHIVED</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href={facebookLink} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                            <a href={instagramLink} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Image Modal */}
            {selectedCar && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
                    <button onClick={() => setSelectedCar(null)} className="absolute top-10 right-10 text-white hover:text-blue-500 transition-colors">
                        <X className="w-10 h-10" />
                    </button>

                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 group relative">
                                <img
                                    src={(selectedCar.imageUrls && selectedCar.imageUrls[activeImageIndex]) || selectedCar.image}
                                    alt={selectedCar.name}
                                    className="w-full h-full object-cover animate-fadeIn"
                                />
                                {(selectedCar.imageUrls || []).length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedCar.imageUrls.length - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-blue-600 rounded-full transition-all"
                                        >
                                            <ChevronLeft />
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIndex(prev => prev < selectedCar.imageUrls.length - 1 ? prev + 1 : 0)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-blue-600 rounded-full transition-all"
                                        >
                                            <ChevronRight />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {(selectedCar.imageUrls || [selectedCar.image]).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`w-28 flex-shrink-0 aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === i ? 'border-blue-500 scale-105' : 'border-white/5 opacity-50'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-10">
                                <span className="text-blue-500 font-black uppercase italic tracking-widest text-sm mb-2 block">{selectedCar.make}</span>
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{selectedCar.model}</h2>
                                <p className="text-2xl font-black text-blue-500">€{(selectedCar.price || 0).toLocaleString()}</p>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-gray-500 tracking-[0.3em] mb-4">Specifications</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { l: "PRODUCTION YEAR", v: selectedCar.year },
                                            { l: "ENERGY SOURCE", v: selectedCar.fuel },
                                            { l: "TRANSMISSION", v: selectedCar.transmission },
                                            { l: "DISTANCE COVERED", v: `${selectedCar.mileage} KM` },
                                            { l: "ENGINE UNIT", v: selectedCar.engine },
                                            { l: "POWER OUTPUT", v: `${selectedCar.horsepower} HP` }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">{stat.l}</p>
                                                <p className="text-sm font-bold uppercase">{stat.v || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase text-gray-500 tracking-[0.3em] mb-4">Machine Analysis</h4>
                                    <p className="text-gray-400 leading-relaxed font-bold uppercase tracking-wide text-xs">
                                        {getCarDescription(selectedCar)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase text-gray-500 tracking-[0.3em] mb-4">Core Features</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedCar.features || []).map((f, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/20">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button className="mt-10 w-full py-5 bg-blue-600 text-white font-black uppercase italic tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                Request Acquisition
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease forwards;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default TemplateModernDark;
