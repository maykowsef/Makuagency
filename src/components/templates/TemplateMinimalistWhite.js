import React, { useState, useEffect } from "react";
import {
    ChevronRight,
    ArrowUpRight,
    MapPin,
    Phone,
    Mail,
    Instagram,
    Search,
    User,
    Menu,
    X,
    ShieldCheck,
    Truck,
    Clock,
    Check
} from "lucide-react";

// Note: In a real build system we'd use import heroImage from "../../assets/minimalist_heritage_hero.png";
// For this environment, we'll use a direct reference that works with the dev server setup.
const heroImageUrl = "https://bamacooley.com/wp-content/uploads/2025/11/Gemini_Generated_Image_mzv85tmzv85tmzv8.jpg";
const premiumHero = heroImageUrl;

const TemplateMinimalistWhite = ({ sellingPoint }) => {
    const overrides = sellingPoint?.overrides || {};
    const name = overrides.headerText || (typeof sellingPoint?.name === 'object' ? sellingPoint.name.text : sellingPoint?.name) || "Heritage Motors";
    const description = overrides.introDescription || "Curating Excellence in Motion";

    const addressObj = sellingPoint?.address || {};
    const city = sellingPoint?.city || addressObj.city;
    const country = sellingPoint?.country || addressObj.country;
    const street = addressObj.street || sellingPoint?.address1;

    const phones = sellingPoint?.phones || [];
    const primaryPhone = sellingPoint?.phone || (phones.length > 0 ? phones[0].number : "+1 (555) 777-8888");
    const email = sellingPoint?.email || "concierge@heritagemotors.com";
    const logoUrl = sellingPoint?.logo || (sellingPoint?.logoHistory || []).find(l => l.isCurrent)?.imageUrl || (sellingPoint?.logos || []).find(l => l.isCurrent)?.url;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Preload the hero image
        const img = new Image();
        img.src = premiumHero;
    }, []);

    const mapCar = React.useCallback((car) => {
        const attributes = car.attributes || {};
        const combined = { ...car, ...attributes };
        return {
            ...combined,
            image: (car.imageUrls && car.imageUrls[0]) || car.image || null,
            name: car.name || "Curated Selection",
            make: combined.make || "Luxury",
            model: combined.model || "Edition",
            price: parseInt(car.price) || 0,
            year: parseInt(combined.year) || 2024,
            mileage: parseInt(combined.mileage) || 0,
            fuel: combined.fuel || "Hybrid",
            transmission: combined.transmission || "Smooth Automatic",
            description: car.description || "The pinnacle of automotive refinement.",
            features: combined.features || ["Adaptive Cruise", "Massage Seats", "Panoramic Roof"],
            engine: combined.engine || "Silent V6",
            horsepower: combined.horsepower || 320,
        };
    }, []);

    const cars = React.useMemo(() => {
        const pStock = (sellingPoint?.announcementProfiles || []).flatMap(p => p.stockListings || []);
        return [...(sellingPoint?.stock || []), ...pStock].map(mapCar);
    }, [sellingPoint, mapCar]);

    const filteredCars = React.useMemo(() => {
        return cars.filter(car =>
            car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cars, searchQuery]);

    // Group cars by vehicleType (use filteredCars to respect search)
    const groupedVehicles = React.useMemo(() => {
        return filteredCars.reduce((acc, car) => {
            const type = car.vehicleType || 'Other';
            if (!acc[type]) acc[type] = [];
            acc[type].push(car);
            return acc;
        }, {});
    }, [filteredCars]);

    const vehicleCategories = React.useMemo(() => Object.keys(groupedVehicles).sort(), [groupedVehicles]);

    const getCarDescription = (car) => {
        if (!car?.description) return "Refinement in every detail.";
        if (typeof car.description === 'object') return car.description.text || "Refinement in every detail.";
        return car.description;
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-white text-[#1a1a1a] font-light selection:bg-gray-900 selection:text-white">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('home')}>
                        {logoUrl ? (
                            <img src={logoUrl} alt={name} className="h-8 object-contain" />
                        ) : (
                            <span className="text-xl font-medium tracking-[0.2em] uppercase">{name}</span>
                        )}
                    </div>

                    <nav className="hidden lg:flex items-center gap-10">
                        <button onClick={() => scrollToSection('home')} className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-colors">Home</button>
                        {vehicleCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => scrollToSection(`category-${cat.replace(/\s+/g, '-').toLowerCase()}`)}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-colors whitespace-nowrap"
                            >
                                {cat}s
                            </button>
                        ))}
                        {['Heritage', 'Services', 'Contact'].map(item => (
                            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-colors">
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-8">
                        <button className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] border-b border-gray-900 pb-1">Enquire Now</button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-32 px-10">
                    <div className="flex flex-col gap-10">
                        <button onClick={() => scrollToSection('home')} className="text-4xl font-medium tracking-tighter text-left">Home</button>
                        {vehicleCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => scrollToSection(`category-${cat.replace(/\s+/g, '-').toLowerCase()}`)}
                                className="text-4xl font-medium tracking-tighter text-left"
                            >
                                {cat}s
                            </button>
                        ))}
                        {['Heritage', 'Services', 'Contact'].map(item => (
                            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-4xl font-medium tracking-tighter text-left">
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Hero */}
            <section id="home" className="min-h-screen flex items-center pt-20">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="animate-reveal">
                        <h1 className="text-7xl md:text-9xl font-medium tracking-tight leading-[0.9] mb-8">
                            {overrides.heroTitle || description}
                        </h1>
                        <p className="text-lg text-gray-500 max-w-md mb-12 leading-relaxed">
                            {overrides.heroDescription || "Discover a curated collection of the world's most sought-after vehicles. Each piece in our inventory is selected with an uncompromising eye for quality and provenance."}
                        </p>
                        <button onClick={() => scrollToSection('collection')} className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                            View Collection <div className="w-12 h-px bg-gray-300 group-hover:w-20 transition-all duration-500"></div> <ArrowUpRight size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-2xl">
                            <img
                                src={overrides.heroImage || premiumHero}
                                alt="Hero Car"
                                className="w-full h-full object-cover transition-opacity duration-500"
                                loading="eager"
                                onError={(e) => { e.target.src = heroImageUrl; }}
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 shadow-2xl hidden md:block">
                            <span className="block text-4xl font-medium mb-2 italic">Since 1994</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{overrides.heroSubtitle || "Automotive Excellence"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Inventory Sections */}
            <div id="collection">
                <div className="container mx-auto px-6 py-20 flex justify-end">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-b border-gray-300 pb-3 w-full text-sm font-medium focus:border-gray-900 focus:outline-none transition-colors"
                        />
                        <Search className="absolute right-0 bottom-3 text-gray-300" size={16} />
                    </div>
                </div>

                {vehicleCategories.map((category) => {
                    const categoryCars = groupedVehicles[category];
                    return (
                        <section
                            key={category}
                            id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                            className="py-40 bg-[#f9f9f9] border-t border-gray-100"
                        >
                            <div className="container mx-auto px-6">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
                                    <div className="max-w-xl">
                                        <h2 className="text-5xl font-medium tracking-tight mb-6">{category}s</h2>
                                        <p className="text-gray-500 leading-relaxed">
                                            Each {category.toLowerCase()} in our collection has been hand-selected for its exceptional provenance and mechanical integrity.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                                    {categoryCars.map((car, i) => (
                                        <div key={car.id || i} className="group cursor-pointer" onClick={() => setSelectedCar(car)}>
                                            <div className="aspect-[16/10] bg-gray-200 overflow-hidden rounded-sm mb-8">
                                                <img src={car.image} alt={car.name || car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" onError={(e) => e.target.src = heroImageUrl} />
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-medium tracking-tight mb-1 truncate max-w-[200px]">{car.name || car.model}</h3>
                                                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold font-sans">
                                                        {car.year} — {car.mileage?.toLocaleString()} KM
                                                    </p>
                                                </div>
                                                <span className="text-xl font-medium italic">€{(car.price || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}

                {vehicleCategories.length === 0 && (
                    <section className="py-40 text-center border-t border-gray-100">
                        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.4em]">No matching acquisitions found</p>
                    </section>
                )}
            </div>

            {/* Heritage / Features */}
            <section id="heritage" className="py-40">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        {[
                            { title: "Authentication", icon: <ShieldCheck />, desc: "Complete vehicle history and verification for every item in our collection." },
                            { title: "Delivery", icon: <Truck />, desc: "Fully enclosed white-glove transport to your residence across the continent." },
                            { title: "Concierge", icon: <Clock />, desc: "Dedicated advisors monitoring and managing your vehicle's lifecycle." }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full text-gray-900">{item.icon}</div>
                                <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-sans">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-40 bg-gray-900 text-white">
                <div className="container mx-auto px-6 border-b border-white/10 pb-40 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                        <div>
                            <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-12">Start Your Journey.</h2>
                            <div className="space-y-12">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block">Location</span>
                                    <p className="text-xl font-medium">{street}, {city}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block">Direct Line</span>
                                    <p className="text-xl font-medium underline underline-offset-8 decoration-white/20">{primaryPhone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Full Name" className="w-full bg-transparent border-b border-white/20 pb-4 font-normal placeholder:text-white/20 focus:outline-none focus:border-white transition-colors" />
                                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 pb-4 font-normal placeholder:text-white/20 focus:outline-none focus:border-white transition-colors" />
                                <textarea placeholder="How may we assist?" rows="4" className="w-full bg-transparent border-b border-white/20 pb-4 font-normal placeholder:text-white/20 focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                                <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em]">
                                    Submit Request <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        <span>© {new Date().getFullYear()} {name} — All Rights Reserved.</span>
                        <a href={`mailto:${email}`} className="hover:text-white transition-colors">Digital Direct</a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Instagram size={20} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Follow the Heritage</span>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedCar && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col lg:flex-row animate-reveal">
                    <button onClick={() => setSelectedCar(null)} className="absolute top-10 right-10 z-10 p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="w-full lg:w-[60%] bg-[#f5f5f5] overflow-y-auto pt-24 lg:pt-0">
                        <div className="h-full flex flex-col items-center justify-center p-10 lg:p-24 relative">
                            <img
                                src={(selectedCar.imageUrls && selectedCar.imageUrls[activeImageIndex]) || selectedCar.image}
                                alt={selectedCar.name}
                                className="w-full max-w-4xl object-contain drop-shadow-2xl animate-reveal"
                            />

                            {(selectedCar.imageUrls || []).length > 1 && (
                                <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-full">
                                    {selectedCar.imageUrls.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImageIndex(i)}
                                            className={`w-32 flex-shrink-0 aspect-video rounded overflow-hidden transition-all grayscale ${activeImageIndex === i ? 'grayscale-0 ring-1 ring-gray-900 ring-offset-4' : 'opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-[40%] bg-white p-10 lg:p-24 flex flex-col justify-center overflow-y-auto">
                        <div className="max-w-md">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Ref No. {selectedCar.id}</span>
                            <h2 className="text-6xl font-medium tracking-tighter mb-2">{selectedCar.name}</h2>
                            <p className="text-2xl font-light italic mb-12">€{(selectedCar.price || 0).toLocaleString()}</p>

                            <div className="space-y-12 mb-16">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Technical Data</h4>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                        {[
                                            { l: "Year", v: selectedCar.year },
                                            { l: "Fuel", v: selectedCar.fuel },
                                            { l: "Transmission", v: selectedCar.transmission },
                                            { l: "Mileage", v: `${selectedCar.mileage?.toLocaleString()} KM` }
                                        ].map((stat, i) => (
                                            <div key={i} className="border-b border-gray-100 pb-2">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.l}</p>
                                                <p className="text-sm font-medium">{stat.v || '—'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Description</h4>
                                    <p className="text-gray-500 leading-relaxed italic">{getCarDescription(selectedCar)}</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Equipment</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(selectedCar.features || []).map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs font-medium text-gray-600">
                                                <Check size={12} className="text-gray-300" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-gray-900 text-white py-6 text-xs font-bold uppercase tracking-[0.4em] hover:bg-black transition-colors">
                                Book Private Viewing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes reveal {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-reveal {
                    animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default TemplateMinimalistWhite;
