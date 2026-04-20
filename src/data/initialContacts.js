export const initialContacts = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: `Contact Person ${i + 1}`,
    role: i % 3 === 0 ? 'CEO' : i % 3 === 1 ? 'Marketing Manager' : 'Administrator',
    companyId: (i % 25) + 1,
    email: `contact${i + 1}@example.com`,
    phone: `+1 555 01${i.toString().padStart(2, '0')}`,
    address: { street: 'Main St', city: 'NY', state: 'NY', zip: '10001', country: 'USA' },
    social: { linkedin: '', facebook: '', instagram: '' },
    description: 'Mock description for development preview.',
    linkedEntities: [],
    avatar: `https://ui-avatars.com/api/?name=Contact+${i + 1}&background=random`,
    psychofile: {
        mbti: i % 2 === 0 ? 'ENTJ' : 'INFP',
        type: i % 4 === 0 ? 'Driver (D)' : i % 4 === 1 ? 'Expressive (I)' : 'Amiable (S)',
        color: i % 3 === 0 ? 'Red' : i % 3 === 1 ? 'Yellow' : 'Blue',
        traits: ['Trait 1', 'Trait 2'],
        howToConvince: 'Be direct and show value.'
    }
}));
