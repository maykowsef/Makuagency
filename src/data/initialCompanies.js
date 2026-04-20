export const initialCompanies = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Company ${i + 1}`,
    industry: i % 3 === 0 ? 'Technology' : i % 3 === 1 ? 'Retail' : 'Services',
    address: {
        street: `${100 + i} Business Ave`,
        city: i % 2 === 0 ? 'New York' : 'Los Angeles',
        country: i % 5 === 0 ? 'Canada' : 'United States',
        postalCode: `${10000 + i}`
    },
    phone: `+1 555 ${i.toString().padStart(4, '0')}`,
    email: `contact@company${i + 1}.com`,
    website: `https://company${i + 1}.com`,
    linkedSellingPoints: [1, 2, 3],
    linkedContacts: [1, 2, 3, 4]
}));
