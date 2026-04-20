import React, { useState, useEffect } from "react";

const TemplateUsedCarDealer = ({ sellingPoint, onAction }) => {
    // Dynamic Overrides from Minisite configuration
    const overrides = sellingPoint?.overrides || {};

    // Default data if no sellingPoint is provided (fallback/preview mode)
    const defaultName = "LuxuryMotors";
    const name = overrides.headerText ||
        (typeof sellingPoint?.name === 'object' ? sellingPoint.name.text : sellingPoint?.name) ||
        defaultName;

    // Use default description or override
    const description = overrides.introDescription || "Experience Luxury Redefined";
    const primaryColor = overrides.primaryColor || "#ca8a04"; // Default gold/yellow color

    const addressObj = sellingPoint?.address || {};
    const street = addressObj.street || sellingPoint?.address1;
    const address2 = addressObj.address2 || sellingPoint?.address2;
    const address3 = addressObj.address3 || sellingPoint?.address3;

    const addressLines = [street, address2, address3].filter(Boolean).join(', ');
    const fullAddress = addressLines ? `${addressLines}, ${sellingPoint?.city || addressObj.city}, ${sellingPoint?.postalCode || addressObj.postalCode}, ${sellingPoint?.country || addressObj.country} ` : "123 Luxury Avenue, Beverly Hills, CA, USA";

    const phones = sellingPoint?.phones || [];
    const primaryPhone = sellingPoint?.phone || (phones.length > 0 ? phones[0].number : "+1 (555) 123-4567");

    const email = sellingPoint?.email || "info@luxurymotors.com";

    // Find Facebook URL
    const socialMedia = sellingPoint?.socialMedia || [];
    const facebookLink = socialMedia.find(s => s.platform.toLowerCase() === 'facebook')?.url || "#";

    // Logo - check if logo url exists, or find current logo in history
    const logoUrl = sellingPoint?.logo || (sellingPoint?.logoHistory || []).find(l => l.isCurrent)?.imageUrl || (sellingPoint?.logos || []).find(l => l.isCurrent)?.url;
    const logoInitial = name.charAt(0).toUpperCase();

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMenuOpen(false); // Close menu on mobile after clicking
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage, setCarsPerPage] = useState(6); // Show 6 cars per page
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        make: "",
        model: "",
        price: "",
        year: "",
        fuel: "",
        mileage: "",
        transmission: "",
    });
    const [activeSection, setActiveSection] = useState("home");

    // Use stock from sellingPoint if available, otherwise use default mock data
    // We combine top-level stock with stock from announcement profiles
    const mapCar = (car) => {
        const attributes = car.attributes || {};
        const combined = { ...car, ...attributes };
        return {
            ...combined,
            image: (car.imageUrls && car.imageUrls[0]) || car.image || null,
            name: car.name || "Premium Vehicle",
            make: combined.make || (car.name ? car.name.split(' ')[0] : "Premium"),
            model: combined.model || (car.name ? car.name.split(' ').slice(1).join(' ') : "Vehicle"),
            price: parseInt(car.price) || 0,
            year: parseInt(combined.year) || 2024,
            mileage: parseInt(combined.mileage) || 0,
            fuel: combined.fuel || "Petrol",
            transmission: combined.transmission || "Automatic",
            description: car.description || "Excellent condition, premium features.",
            features: combined.features || ["Premium Audio", "Heated Seats", "Navigation"],
            engine: combined.engine || "2.0L Turbo",
            horsepower: combined.horsepower || 250,
            rentalPrice: combined.rentalPrice || 199
        };
    };

    const pStock = (sellingPoint?.announcementProfiles || []).flatMap(p => p.stockListings || []);
    const cars = [...(sellingPoint?.stock || []), ...pStock].map(mapCar);

    const getCarDescription = (car) => {
        if (!car?.description) return "Excellent condition, premium features.";
        if (typeof car.description === 'object') return car.description.text || "Excellent condition, premium features.";
        return car.description;
    };

    const filteredCars = cars.filter((car) => {
        const matchesSearch =
            searchQuery === "" ||
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return String(car[key]).toLowerCase().includes(value.toLowerCase());
        });

        return matchesSearch && matchesFilters;
    });

    // Group cars by vehicleType (use filteredCars to respect search)
    const groupedCars = filteredCars.reduce((acc, car) => {
        const type = car.vehicleType || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(car);
        return acc;
    }, {});

    const vehicleCategories = Object.keys(groupedCars).sort();

    const howItWorks = [
        {
            step: 1,
            title: "Choose Location",
            description:
                "Select your preferred pickup location from our premium showrooms",
            icon: "📍",
        },
        {
            step: 2,
            title: "Pick Date & Time",
            description: "Choose your rental dates and preferred pickup time",
            icon: "📅",
        },
        {
            step: 3,
            title: "Select Your Car",
            description: "Browse our premium collection and choose your dream car",
            icon: "🚗",
        },
        {
            step: 4,
            title: "Secure Payment",
            description: "Complete your booking with our secure payment gateway",
            icon: "💳",
        },
    ];



    useEffect(() => {
        // Add animations on scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fadeIn");
                    }
                });
            },
            { threshold: 0.1 }
        );

        document
            .querySelectorAll(".animate-on-scroll")
            .forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans overflow-x-hidden">
            {/* Navigation */}
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            {logoUrl ? (
                                <img src={logoUrl} alt={name} className="w-12 h-12 rounded-xl object-cover" />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-bold">{logoInitial}</span>
                                </div>
                            )}
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                {name}
                            </h1>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {[
                                { id: "home", label: "Home" },
                                ...vehicleCategories.map(cat => ({
                                    id: `section-${cat.replace(/\s+/g, '-').toLowerCase()}`,
                                    label: `${cat}s`
                                })),
                                { id: "services", label: "Services" },
                                { id: "about", label: "About Us" },
                                { id: "contact", label: "Contact" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-gray-300 hover:text-white font-medium text-base transition-all duration-300 hover:scale-105 relative group whitespace-nowrap"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                                </button>
                            ))}
                        </div>

                        {/* Rent Button & Mobile Menu Button */}
                        <div className="flex items-center space-x-6">
                            <button className="hidden lg:block bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-3 rounded-full font-bold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105">
                                Buy a car{" "}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden w-12 h-12 rounded-lg bg-gray-900/80 border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                            >
                                <span className="text-2xl">{isMenuOpen ? "✕" : "☰"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Full Screen Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 top-0 bg-black/95 backdrop-blur-xl z-40 pt-24 overflow-y-auto">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col space-y-4 py-10">
                                <button
                                    onClick={() => { scrollToSection('home'); setIsMenuOpen(false); }}
                                    className="flex items-center space-x-4 text-xl font-bold text-gray-300 hover:text-white transition-all duration-300 py-3 px-6 rounded-xl hover:bg-gray-900/50"
                                >
                                    <span className="text-2xl">🏠</span>
                                    <span>Home</span>
                                </button>

                                {vehicleCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { scrollToSection(`section-${cat.replace(/\s+/g, '-').toLowerCase()}`); setIsMenuOpen(false); }}
                                        className="flex items-center space-x-4 text-xl font-bold text-gray-300 hover:text-white transition-all duration-300 py-3 px-6 rounded-xl hover:bg-gray-900/50"
                                    >
                                        <span className="text-2xl">🚗</span>
                                        <span>{cat}s</span>
                                    </button>
                                ))}

                                {[
                                    { id: "services", label: "Services", icon: "🔧" },
                                    { id: "about", label: "About Us", icon: "🏢" },
                                    { id: "contact", label: "Contact", icon: "📞" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }}
                                        className="flex items-center space-x-4 text-xl font-bold text-gray-300 hover:text-white transition-all duration-300 py-3 px-6 rounded-xl hover:bg-gray-900/50"
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}

                                <button className="mt-8 bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-4 rounded-xl text-xl font-bold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300">
                                    Book a Car Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section
                id="home"
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center animate-pulse-slow"
                    style={{
                        backgroundImage:
                            `url("${overrides.heroImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80"}")`,
                        animation: "pulse 4s infinite",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
                </div>

                <div className="max-w-3xl mx-auto text-center transition-all duration-1000 opacity-100 translate-y-0">
                    <div className="animate-fadeInUp">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                                {overrides.heroTitle || "Drive Your Dreams"}
                            </span>
                            <br />
                            <span className="text-white">{overrides.heroSubtitle || description}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animate-slideIn">
                            {overrides.heroDescription || "Discover the finest collection of premium vehicles, where performance meets elegance. Your journey to extraordinary begins here."}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center animate-fadeIn delay-300">
                            <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                                Explore Collection
                            </button>
                            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                                Book Test Drive
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-16 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            Find Your Dream Car
                        </h2>

                        {/* Search by Name */}
                        <div className="mb-8 animate-on-scroll">
                            <input
                                type="text"
                                placeholder="Search by car name, make, or model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Advanced Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-on-scroll">
                            {[
                                {
                                    key: "make",
                                    label: "Make",
                                    options: [
                                        "Mercedes-Benz",
                                        "BMW",
                                        "Audi",
                                        "Porsche",
                                        "Land Rover",
                                        "Tesla",
                                    ],
                                },
                                {
                                    key: "model",
                                    label: "Model",
                                    options: [
                                        "S-Class",
                                        "7 Series",
                                        "RS7",
                                        "911",
                                        "Range Rover",
                                        "Model S",
                                    ],
                                },
                                {
                                    key: "year",
                                    label: "Year",
                                    options: ["2023", "2022", "2021", "2020"],
                                },
                                {
                                    key: "fuel",
                                    label: "Fuel Type",
                                    options: ["Petrol", "Diesel", "Hybrid", "Electric"],
                                },
                                {
                                    key: "transmission",
                                    label: "Transmission",
                                    options: ["Automatic", "Manual", "PDK Automatic"],
                                },
                                {
                                    key: "price",
                                    label: "Price Range",
                                    options: [
                                        "Under $50k",
                                        "$50k - $100k",
                                        "$100k - $150k",
                                        "Over $150k",
                                    ],
                                },
                                {
                                    key: "mileage",
                                    label: "Mileage",
                                    options: ["Under 10k", "10k - 30k", "30k - 50k", "Over 50k"],
                                },
                            ].map((filter) => (
                                <select
                                    key={filter.key}
                                    value={filters[filter.key]}
                                    onChange={(e) =>
                                        setFilters({ ...filters, [filter.key]: e.target.value })
                                    }
                                    className="px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                                >
                                    <option value="">All {filter.label}</option>
                                    {filter.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Showroom Sections */}
            {vehicleCategories.map((category) => {
                const categoryCars = groupedCars[category];
                return (
                    <section
                        key={category}
                        id={`section-${category.replace(/\s+/g, '-').toLowerCase()}`}
                        className="py-20 bg-gradient-to-b from-gray-900 to-black border-t border-white/5"
                    >
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-on-scroll">
                                    {category}s
                                </h2>
                                <p className="text-gray-400 text-lg animate-on-scroll">
                                    Explore our premium selection of {category.toLowerCase()}s
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryCars.map((car, index) => (
                                    <div
                                        key={car.id}
                                        className="group relative bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll"
                                        onClick={() => {
                                            setSelectedCar(car);
                                            setActiveImageIndex(0);
                                        }}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={car.image}
                                                alt={car.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'}
                                            />
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                                                ${(car.price || 0).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">{car.name}</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="text-gray-400">
                                                    Year: <span className="text-white">{car.year}</span>
                                                </div>
                                                <div className="text-gray-400">
                                                    Fuel: <span className="text-white">{car.fuel}</span>
                                                </div>
                                                <div className="text-gray-400">
                                                    Mileage:{" "}
                                                    <span className="text-white">
                                                        {(car.mileage || 0).toLocaleString()} km
                                                    </span>
                                                </div>
                                                <div className="text-gray-400">
                                                    Trans:{" "}
                                                    <span className="text-white text-[10px]">{car.transmission}</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {vehicleCategories.length === 0 && (
                <section className="py-20 text-center text-gray-500 italic">
                    <p>New inventory arriving soon. Please check back later.</p>
                </section>
            )}

            {/* How It Works - Rental Process */}
            <section
                id="rent"
                className="py-20 bg-gradient-to-b from-black to-gray-900"
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-on-scroll">
                            How It Works
                        </h2>
                        <p className="text-gray-400 text-lg animate-on-scroll">
                            Rent your dream car in 4 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <div
                                key={step.step}
                                className="relative group animate-on-scroll"
                                style={{ animationDelay: `${index * 150} ms` }}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <div className="text-3xl font-bold text-yellow-500 mb-2">
                                        0{step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section
                id="services"
                className="py-20 bg-gradient-to-b from-gray-900 to-black"
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-on-scroll">
                            Our Premium Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Car Customization",
                                description:
                                    "Personalize your vehicle with exclusive packages and custom modifications",
                                icon: "🎨",
                            },
                            {
                                title: "Premium Maintenance",
                                description:
                                    "Expert care and maintenance by certified luxury car specialists",
                                icon: "🔧",
                            },
                            {
                                title: "Concierge Service",
                                description:
                                    "24/7 personal concierge for all your luxury automotive needs",
                                icon: "🌟",
                            },
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-800/30 to-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/30 transition-all duration-500 animate-on-scroll"
                                style={{ animationDelay: `${index * 200} ms` }}
                            >
                                <div className="text-5xl mb-4">{service.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                                <p className="text-gray-400">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section
                id="about"
                className="py-20 bg-gradient-to-b from-black to-gray-900"
            >
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center animate-on-scroll">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            About {name}
                        </h2>
                        <p className="text-xl text-gray-300 mb-6">
                            Founded with a passion for excellence, {name} redefines the
                            premium automotive experience. We curate the world's finest
                            vehicles, offering unparalleled quality and service.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {[
                                { value: "250+", label: "Premium Vehicles" },
                                { value: "15+", label: "Years Experience" },
                                { value: "98%", label: "Client Satisfaction" },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="animate-on-scroll"
                                    style={{ animationDelay: `${index * 100} ms` }}
                                >
                                    <div className="text-4xl font-bold text-yellow-500">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 mt-2">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section
                id="contact"
                className="py-20 bg-gradient-to-b from-gray-900 to-black"
            >
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto animate-on-scroll">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                            Contact Us
                        </h2>
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    rows="4"
                                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 resize-none"
                                ></textarea>
                                <button className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black border-t border-white/10">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="animate-on-scroll">
                            <div className="flex items-center space-x-2 mb-6">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={name} className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-lg font-bold">
                                        {logoInitial}
                                    </div>
                                )}
                                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    {name}
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Where luxury meets performance. Experience automotive
                                excellence.
                            </p>
                        </div>

                        {[
                            {
                                title: "Quick Links",
                                links: [
                                    { label: "Showroom", url: "#showroom" },
                                    { label: "Rental Services", url: "#rent" },
                                    { label: "Customization", url: "#services" },
                                    { label: "Maintenance", url: "#services" },
                                    { label: "Facebook Page", url: facebookLink, isExternal: true },
                                ],
                            },
                        ].map((column, index) => (
                            <div
                                key={index}
                                className="animate-on-scroll"
                                style={{ animationDelay: `${index * 100} ms` }}
                            >
                                <h3 className="text-xl font-bold mb-6">{column.title}</h3>
                                <ul className="space-y-3">
                                    {column.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a
                                                href={link.url}
                                                target={link.isExternal ? "_blank" : "_self"}
                                                rel={link.isExternal ? "noopener noreferrer" : ""}
                                                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="animate-on-scroll">
                            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
                            <ul className="space-y-3">
                                <li className="text-gray-400">📞 {primaryPhone}</li>
                                <li className="text-gray-400">📧 {email}</li>
                                <li className="text-gray-400">📍 {fullAddress}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 animate-on-scroll">
                        <p>
                            &copy; {new Date().getFullYear()} {name}. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Car Details Modal */}
            {selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fadeIn">
                    <div className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-white/20">
                        <button
                            onClick={() => setSelectedCar(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/80 transition-all duration-300"
                        >
                            ✕
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-[400px] lg:h-full bg-gray-800">
                                <img
                                    src={(selectedCar.imageUrls && selectedCar.imageUrls[activeImageIndex]) || selectedCar.image}
                                    alt={selectedCar.name}
                                    className="w-full h-full object-cover animate-fadeIn"
                                />
                                {/* Image Count Badge */}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                                    <span className="text-yellow-500">📷</span>
                                    <span>{activeImageIndex + 1} / {(selectedCar.imageUrls || [selectedCar.image]).length} Images</span>
                                </div>

                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 rounded-full font-bold shadow-lg">
                                    ${(selectedCar.price || 0).toLocaleString()}
                                </div>

                                {/* Thumbnails Row */}
                                {(selectedCar.imageUrls || []).length > 1 && (
                                    <div className="absolute bottom-4 right-4 flex gap-2 pb-2 px-2 overflow-x-auto max-w-[200px] scrollbar-hide">
                                        {selectedCar.imageUrls.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveImageIndex(idx);
                                                }}
                                                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-yellow-500 scale-105 shadow-lg' : 'border-white/20 opacity-70 hover:opacity-100'}`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex flex-col">
                                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {selectedCar.name}
                                </h2>
                                <p className="text-gray-400 mb-6">{getCarDescription(selectedCar)}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Year:</span>
                                            <span className="font-semibold">{selectedCar.year || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Fuel Type:</span>
                                            <span className="font-semibold">{selectedCar.fuel || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Transmission:</span>
                                            <span className="font-semibold">
                                                {selectedCar.transmission || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Mileage:</span>
                                            <span className="font-semibold">
                                                {(selectedCar.mileage || 0).toLocaleString()} km
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Engine:</span>
                                            <span className="font-semibold">
                                                {selectedCar.engine || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Horsepower:</span>
                                            <span className="font-semibold">
                                                {selectedCar.horsepower || 'N/A'} HP
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-lg font-bold mb-3">Features</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedCar.features || []).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                    <button
                                        onClick={() => onAction && onAction('lead', { interest: `${selectedCar.year} ${selectedCar.name}`, type: 'Test Drive' })}
                                        className="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group">
                                        <span>Book Test Drive</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                    <button className="flex-1 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group">
                                        <span>Rent Now</span>
                                        <span className="text-yellow-500">${selectedCar.rentalPrice || 0}</span>
                                        <span className="text-gray-400 text-sm font-normal">/ day</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
@keyframes fadeInUp {
          from {
        opacity: 0;
        transform: translateY(30px);
    }
          to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
          from {
        opacity: 0;
    }
          to {
        opacity: 1;
    }
}

@keyframes slideIn {
          from {
        opacity: 0;
        transform: translateX(-20px);
    }
          to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@keyframes pulse-slow {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.9;
    }
}

.animate-fadeInUp {
    animation: fadeInUp 1s ease-out;
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

.animate-slideIn {
    animation: slideIn 0.8s ease-out 0.3s both;
}

.animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s ease infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

.delay-300 {
    animation-delay: 300ms;
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-on-scroll.animate-fadeIn {
    opacity: 1;
    transform: translateY(0);
}
`}</style>
        </div>
    );
};

export default TemplateUsedCarDealer;
