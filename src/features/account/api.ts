import { api } from '../../lib/http/api-client';
import { parseResponse } from '../../lib/http/parse';
import {
    addressSchema,
    addressesSchema,
    profileSchema,
    type Address,
    type CreateAddressRequest,
    type Profile,
} from './types';

export const accountApi = {
    async getProfile(): Promise<Profile> {
        const { data } = await api.get<unknown>('/users/profile');
        return parseResponse(profileSchema, data, 'profile');
    },

    async getAddresses(): Promise<Address[]> {
        const { data } = await api.get<unknown>('/users/addresses');
        return parseResponse(addressesSchema, data, 'addresses');
    },

    async createAddress(body: CreateAddressRequest): Promise<Address> {
        const { data } = await api.post<unknown>('/users/addresses', body);
        return parseResponse(addressSchema, data, 'address');
    },
};
