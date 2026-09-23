// API payloads shaped exactly like testify-back responses (decimals as strings,
// ISO dates, relations included), used by MSW handlers and tests.

const ts = '2026-09-20T10:00:00.000Z';

export const DEMO_USER = {
    id: 'user-1',
    name: 'Demo Customer',
    email: 'demo@tastify.ge',
    phone: '+995555123456',
    type: 'user' as const,
};

export function makeSession(suffix = '1') {
    return { accessToken: `access-${suffix}`, refreshToken: `refresh-${suffix}`, user: DEMO_USER };
}

const modifier = (id: number, itemId: number, name: string, price: string) => ({
    id,
    itemId,
    name,
    price,
    createdAt: ts,
    updatedAt: ts,
});

const item = (id: number, categoryId: number, name: string, price: string, description: string, modifiers: ReturnType<typeof modifier>[] = []) => ({
    id,
    categoryId,
    name,
    description,
    price,
    imageUrl: null,
    isActive: true,
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
    modifiers,
});

export const menuCategories = [
    {
        id: 1,
        name: 'Appetizers',
        imageUrl: null,
        sortOrder: 1,
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
        items: [
            item(1, 1, 'Badrijani Nigvzit', '12.00', 'Fried eggplant rolls with walnut paste'),
            item(2, 1, 'Assorted Pkhali', '14.00', 'Spinach, beet and bean pâtés', [modifier(1, 2, 'Mchadi (cornbread)', '3.00')]),
        ],
    },
    {
        id: 3,
        name: 'Pastry & Dough',
        imageUrl: null,
        sortOrder: 3,
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
        items: [
            item(8, 3, 'Adjarian Khachapuri', '18.00', 'Boat-shaped bread with sulguni, butter and egg', [
                modifier(11, 8, 'Extra egg', '1.50'),
                modifier(12, 8, 'Extra butter', '1.00'),
            ]),
            item(9, 3, 'Imeruli Khachapuri', '16.00', 'Round cheese bread'),
            item(10, 3, 'Lobiani', '14.00', 'Bread filled with spiced beans'),
        ],
    },
];

export const addresses = [
    {
        id: '3f0e8a52-0c1d-4c4e-9a8b-2f6f3c1b7d10',
        userId: DEMO_USER.id,
        street: 'Rustaveli Ave 12, apt 7',
        city: 'Batumi',
        postalCode: null,
        country: 'Georgia',
        latitude: null,
        longitude: null,
        isDefault: true,
        createdAt: ts,
        updatedAt: ts,
    },
];

export function makeOrder(overrides: Partial<Record<string, unknown>> = {}) {
    const id = (overrides.id as string) ?? 'a1b2c3d4-0000-4000-8000-000000000001';
    return {
        id,
        userId: DEMO_USER.id,
        status: 'PENDING',
        type: 'INSTANT',
        scheduledFor: null,
        paymentStatus: 'PENDING',
        paymentMethod: 'CASH',
        deliveryType: 'OWN',
        totalPrice: '19.5',
        addressId: addresses[0].id,
        contactPhone: '+995555123456',
        notes: null,
        createdAt: ts,
        updatedAt: ts,
        user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email, phone: DEMO_USER.phone },
        address: addresses[0],
        items: [
            {
                id: 'line-1',
                orderId: id,
                itemId: 8,
                quantity: 1,
                price: '18',
                createdAt: ts,
                item: { id: 8, name: 'Adjarian Khachapuri', imageUrl: null, price: '18', categoryId: 3 },
                modifiers: [
                    { id: 'lm-1', orderItemId: 'line-1', modifierId: 11, price: '1.5', createdAt: ts, modifier: { id: 11, name: 'Extra egg', price: '1.5' } },
                ],
            },
        ],
        payments: [],
        statusHistory: [{ id: 'h-1', orderId: id, status: 'PENDING', changedAt: ts, changedBy: null, notes: null }],
        ...overrides,
    };
}

export function makeChatMessage(overrides: Partial<Record<string, unknown>> = {}) {
    return {
        id: 'msg-1',
        orderId: makeOrder().id,
        userId: null,
        staffId: 'staff-1',
        message: 'Your order is being prepared',
        sentAt: ts,
        user: null,
        staff: { id: 'staff-1', name: 'Kitchen Staff' },
        ...overrides,
    };
}
