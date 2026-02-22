import { ShippingAddress } from '../types/types';

export interface CheckoutOrder {
    searchQuery: string;
    productIndex: number;
    shippingAddress: ShippingAddress;
    shippingMethod: string;
    paymentMethod: string;
}

export interface CheckoutData {
    validOrder: CheckoutOrder;
}

export const checkoutData: CheckoutData = {
    validOrder: {
        searchQuery: 'Lenovo V14',
        productIndex: 0,
        shippingAddress: {
            name: 'Test User',
            street: 'Yokyla 11A 24',
            postalCode: '20540',
            city: 'Turku',
            phone: '0449508299'
        },
        shippingMethod: 'Matkahuolto Pakettiautomaatti, S-Market Halinen',
        paymentMethod: 'Verkkopankki'
    }
};