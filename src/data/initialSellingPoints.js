export const initialSellingPoints = [
    {
        id: 1,
        name: 'Bistro Le Paris',
        companyId: 1,
        businessType: 'Restaurant',
        industry: 'restaurant',
        siret: '123 456 789 00012',
        address: {
            street: '15 Rue de la République',
            address2: '',
            city: 'Paris',
            country: 'France',
            postalCode: '75001'
        },
        phones: [{ id: 1, number: '+33 1 42 86 82 00', type: 'Work' }],
        email: 'contact@bistroparis.fr',
        createdBy: { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff' },
        announcementProfiles: [
            {
                id: 201,
                siteId: 'leboncoin',
                url: 'https://leboncoin.fr/u/bistro-paris',
                targetListings: 5,
                stockListings: [
                    {
                        id: 101,
                        url: 'https://leboncoin.fr/ad/12345',
                        imageUrls: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20']
                    }
                ]
            }
        ],
        socialMedia: [
            { id: 301, platform: 'facebook', url: 'https://facebook.com/bistroparis', followers: '1.2k', isPrimary: true }
        ],
        notes: [],
        description: 'Authentic French bistro in the heart of Paris.',
        createdAt: '2024-01-15',
        lastModified: '2024-01-20'
    },
    {
        id: 999,
        name: 'Elite Motors',
        companyId: 2,
        businessType: 'Used Car Dealer',
        industry: 'automotive',
        siret: '987 654 321 00022',
        address: {
            street: '123 Luxury Avenue',
            address2: '',
            city: 'Beverly Hills',
            country: 'USA',
            postalCode: '90210'
        },
        phones: [{ id: 1, number: '+1 555 123 4567', type: 'Work' }],
        email: 'sales@elitemotors.com',
        website: 'mysitedomaine/usedcardealer/999',
        createdBy: { name: 'Makrem', avatar: 'https://ui-avatars.com/api/?name=Makrem&background=000&color=fff' },
        notes: [],
        description: 'Premium used car dealership specializing in luxury vehicles.',
        createdAt: '2024-02-01',
        lastModified: '2024-02-01'
    }
];
