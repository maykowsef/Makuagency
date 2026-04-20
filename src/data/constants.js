// ─── BUSINESS TYPES ───────────────────────────────────────────────────────────
export const BUSINESS_TYPES = [
    // Automotive
    'Used Car Dealer',
    'New Car Dealer',
    'Car Rental',
    'Auto Repair Shop',
    'Motorcycle Dealer',
    // Real Estate
    'Real Estate Agency',
    'Property Developer',
    'Property Management',
    'Vacation Rentals',
    // Clothing
    'Clothing Boutique',
    'Second-Hand / Thrift Store',
    'Sportswear Shop',
    'Luxury Fashion',
    'Kids Clothing Store',
    // Other
    'Restaurant',
    'Technology',
    'Retail',
    'Gym',
    'Bakery',
    'Cafe',
    'Hotel',
    'Consulting',
    'Medical',
    'Construction',
    'Education',
    'Other'
];

// ─── INDUSTRY MAP ──────────────────────────────────────────────────────────────
// Maps businessType → industry key
export const INDUSTRY_MAP = {
    // Automotive
    'Used Car Dealer':       'automotive',
    'New Car Dealer':        'automotive',
    'Car Rental':            'automotive',
    'Auto Repair Shop':      'automotive',
    'Motorcycle Dealer':     'automotive',
    'Automotive':            'automotive',
    // Real Estate
    'Real Estate Agency':    'real-estate',
    'Property Developer':    'real-estate',
    'Property Management':   'real-estate',
    'Vacation Rentals':      'real-estate',
    'Real Estate':           'real-estate',
    // Clothing
    'Clothing Boutique':     'clothing',
    'Second-Hand / Thrift Store': 'clothing',
    'Sportswear Shop':       'clothing',
    'Luxury Fashion':        'clothing',
    'Kids Clothing Store':   'clothing',
};

// ─── INDUSTRY LABELS (for navbar tabs) ────────────────────────────────────────
export const INDUSTRY_NAV_TABS = {
    automotive: ['New Cars', 'Used Cars', 'New Vans', 'Used Vans', 'Motorcycles', 'E-Bikes'],
    'real-estate': ['For Sale', 'For Rent', 'New Build', 'Commercial', 'Land', 'Vacation'],
    clothing: ['New Clothing', 'Used / Second-Hand', 'Men', 'Women', 'Kids', 'Sportswear', 'Accessories'],
};


export const COUNTRIES = [
    { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33', color: 'bg-blue-100 text-blue-800' },
    { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1', color: 'bg-red-100 text-red-800' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', phoneCode: '+216', color: 'bg-green-100 text-green-800' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44', color: 'bg-purple-100 text-purple-800' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49', color: 'bg-yellow-100 text-yellow-800' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', phoneCode: '+39', color: 'bg-pink-100 text-pink-800' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', phoneCode: '+34', color: 'bg-orange-100 text-orange-800' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1', color: 'bg-indigo-100 text-indigo-800' },
];

export const ANNOUNCEMENT_SITES = [
    { id: 'ebay', name: 'eBay', icon: '🛒' },
    { id: 'gumtree', name: 'Gumtree', icon: '🌳' },
    { id: 'motors', name: 'Motors.co.uk', icon: '🚗' },
    { id: 'facebook', name: 'Facebook Marketplace', icon: '📘' },
    { id: 'autotrader', name: 'AutoTrader', icon: '🚙' },
    { id: 'leboncoin', name: 'Leboncoin', icon: '🇫🇷' },
    { id: 'craigslist', name: 'Craigslist', icon: '📋' },
    { id: 'olx', name: 'OLX', icon: '🌐' },
    { id: 'kijiji', name: 'Kijiji', icon: '🍁' },
    { id: 'shpock', name: 'Shpock', icon: '🛍️' },
];

export const ANNOUNCEMENT_TYPES = [
    'Listing',
    'Not Announcing',
    'Profile Not Found',
    'Pending Approval',
    'Rejected',
    'Active',
    'Sold',
    'Expired'
];

export const SOCIAL_PLATFORMS = [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'twitter', name: 'Twitter (X)', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '🔗' },
    { id: 'youtube', name: 'YouTube', icon: '🎥' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻' },
];

export const FUEL_TYPES = [
    'Gasoline',
    'Diesel',
    'Electric',
    'Hybrid',
    'Plug-in Hybrid',
    'LPG',
    'Hydrogen',
    'Other'
];

export const VEHICLE_TYPES = [
    'New Car',
    'Used Car',
    'New Van',
    'Used Van',
    'New Motor',
    'Used Motor',
    'New E-bike',
    'Used E-bike'
];

// ─── REAL ESTATE CONSTANTS ────────────────────────────────────────────────────
export const PROPERTY_TYPES = [
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'villa', label: 'Villa' },
    { id: 'studio', label: 'Studio' },
    { id: 'penthouse', label: 'Penthouse' },
    { id: 'duplex', label: 'Duplex' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'commercial', label: 'Commercial Space' },
    { id: 'office', label: 'Office' },
    { id: 'land', label: 'Land / Plot' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'parking', label: 'Parking / Garage' },
];

export const PROPERTY_CONDITIONS = [
    'New Build',
    'Renovated',
    'Good Condition',
    'Needs Renovation',
    'Under Construction',
    'Off-Plan',
    'Move-In Ready',
];

export const PROPERTY_LISTING_TYPES = [
    { id: 'for-sale', label: 'For Sale' },
    { id: 'for-rent', label: 'For Rent' },
    { id: 'for-lease', label: 'For Lease' },
    { id: 'auction', label: 'Auction' },
    { id: 'vacation-rental', label: 'Vacation Rental' },
];

export const PROPERTY_AMENITIES = [
    'Parking', 'Garden', 'Swimming Pool', 'Balcony', 'Terrace',
    'Elevator', 'Air Conditioning', 'Central Heating', 'Fireplace',
    'Storage', 'Security System', 'Concierge', 'Gym', 'Furnished',
    'Sea View', 'Mountain View', 'City View', 'Disabled Access',
];

export const ENERGY_RATINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// ─── CLOTHING CONSTANTS ──────────────────────────────────────────────────────
export const CLOTHING_CATEGORIES = [
    { id: 'tops', label: 'Tops & T-Shirts' },
    { id: 'shirts', label: 'Shirts & Blouses' },
    { id: 'pants', label: 'Pants & Trousers' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'skirts', label: 'Skirts' },
    { id: 'jackets', label: 'Jackets & Coats' },
    { id: 'sweaters', label: 'Sweaters & Hoodies' },
    { id: 'suits', label: 'Suits & Blazers' },
    { id: 'activewear', label: 'Activewear & Sportswear' },
    { id: 'underwear', label: 'Underwear & Loungewear' },
    { id: 'swimwear', label: 'Swimwear' },
    { id: 'shoes', label: 'Shoes & Footwear' },
    { id: 'accessories', label: 'Accessories (Bags, Belts, Hats)' },
    { id: 'jewelry', label: 'Jewelry & Watches' },
];

export const CLOTHING_CONDITIONS = [
    { id: 'new-with-tags', label: 'New with Tags (NWT)' },
    { id: 'new-without-tags', label: 'New without Tags (NWOT)' },
    { id: 'like-new', label: 'Like New' },
    { id: 'gently-used', label: 'Gently Used' },
    { id: 'good', label: 'Good Condition' },
    { id: 'fair', label: 'Fair / Worn' },
    { id: 'vintage', label: 'Vintage' },
];

export const CLOTHING_SIZES = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL',
    // Numeric
    '34', '36', '38', '40', '42', '44', '46', '48', '50',
    // US Shoes
    'US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13',
    // EU Shoes
    'EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46',
    'One Size',
];

export const CLOTHING_GENDERS = [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'boys', label: 'Boys' },
    { id: 'girls', label: 'Girls' },
    { id: 'baby', label: 'Baby / Infant' },
];

export const CLOTHING_MATERIALS = [
    'Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Cashmere',
    'Denim', 'Leather', 'Faux Leather', 'Nylon', 'Spandex',
    'Velvet', 'Chiffon', 'Satin', 'Fleece', 'Canvas', 'Other',
];

export const CLOTHING_BRANDS_POPULAR = [
    'Zara', 'H&M', 'Nike', 'Adidas', 'Uniqlo', 'Gucci', 'Prada',
    'Louis Vuitton', 'Levi\'s', 'Ralph Lauren', 'Tommy Hilfiger',
    'Calvin Klein', 'The North Face', 'Puma', 'New Balance',
    'Balenciaga', 'Versace', 'Burberry', 'Other',
];

// ─── INDUSTRY-SPECIFIC ANNOUNCEMENT SITES ────────────────────────────────────
export const INDUSTRY_ANNOUNCEMENT_SITES = {
    automotive: [
        { id: 'autotrader', name: 'AutoTrader', icon: '🚙' },
        { id: 'motors', name: 'Motors.co.uk', icon: '🚗' },
        { id: 'cargurus', name: 'CarGurus', icon: '🏎️' },
        { id: 'cars-com', name: 'Cars.com', icon: '🚘' },
        { id: 'leboncoin', name: 'Leboncoin', icon: '🇫🇷' },
        { id: 'mobile-de', name: 'Mobile.de', icon: '🇩🇪' },
        { id: 'ebay', name: 'eBay Motors', icon: '🛒' },
        { id: 'facebook', name: 'Facebook Marketplace', icon: '📘' },
        { id: 'craigslist', name: 'Craigslist', icon: '📋' },
    ],
    'real-estate': [
        { id: 'zillow', name: 'Zillow', icon: '🏠' },
        { id: 'realtor', name: 'Realtor.com', icon: '🏡' },
        { id: 'rightmove', name: 'Rightmove', icon: '🇬🇧' },
        { id: 'zoopla', name: 'Zoopla', icon: '🔍' },
        { id: 'seloger', name: 'SeLoger', icon: '🇫🇷' },
        { id: 'idealista', name: 'Idealista', icon: '🇪🇸' },
        { id: 'immobilienscout', name: 'ImmobilienScout24', icon: '🇩🇪' },
        { id: 'facebook', name: 'Facebook Marketplace', icon: '📘' },
        { id: 'leboncoin', name: 'Leboncoin', icon: '🇫🇷' },
        { id: 'airbnb', name: 'Airbnb', icon: '🏨' },
    ],
    clothing: [
        { id: 'vinted', name: 'Vinted', icon: '👗' },
        { id: 'depop', name: 'Depop', icon: '🛍️' },
        { id: 'poshmark', name: 'Poshmark', icon: '👠' },
        { id: 'thredup', name: 'ThredUp', icon: '♻️' },
        { id: 'vestiaire', name: 'Vestiaire Collective', icon: '👜' },
        { id: 'grailed', name: 'Grailed', icon: '🧥' },
        { id: 'ebay', name: 'eBay', icon: '🛒' },
        { id: 'facebook', name: 'Facebook Marketplace', icon: '📘' },
        { id: 'etsy', name: 'Etsy', icon: '🎨' },
        { id: 'mercari', name: 'Mercari', icon: '📦' },
    ],
};

