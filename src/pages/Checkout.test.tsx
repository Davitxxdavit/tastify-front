import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';
import Checkout from './Checkout';
import { API, apiError, envelope, server } from '../test/msw';
import { addresses, makeOrder } from '../test/fixtures';
import { renderWithProviders } from '../test/render';
import { addLine } from '../features/cart/cart-logic';

const cart = addLine([], {
    itemId: 8,
    name: 'Adjarian Khachapuri',
    imageUrl: null,
    unitPrice: 18,
    modifiers: [{ id: 11, name: 'Extra egg', price: 1.5 }],
});

function renderCheckout() {
    const utils = renderWithProviders(null, {
        route: '/checkout',
        authenticated: true,
        cart,
        routes: [
            { path: '/checkout', element: <Checkout /> },
            { path: '/orders/:orderId', element: <h1>Order tracking</h1> },
        ],
    });
    return utils;
}

/** Records POST /orders bodies; `respond` decides the reply. */
function captureOrders(respond: (body: unknown) => Response | Promise<Response> = () => envelope(makeOrder({ id: 'new-order' }), 201)) {
    const bodies: unknown[] = [];
    server.use(
        http.post(`${API}/orders`, async ({ request }) => {
            const body = await request.json();
            bodies.push(body);
            return respond(body);
        }),
    );
    return bodies;
}

const placeOrderButton = () => screen.getByRole('button', { name: /place order/i });

describe('Checkout', () => {
    it('preselects the default saved address and prefills the phone number', async () => {
        renderCheckout();
        expect(await screen.findByRole('radio', { name: /Rustaveli Ave 12/ })).toBeChecked();
        expect(screen.getByLabelText('Mobile number')).toHaveValue('555123456');
        expect(screen.getByRole('radio', { name: /credit \/ debit card/i })).toBeDisabled();
    });

    it('shows validation errors next to their fields and sends nothing', async () => {
        const bodies = captureOrders();
        const { user } = renderCheckout();
        await screen.findByRole('radio', { name: /Rustaveli Ave 12/ });

        const phone = screen.getByLabelText('Mobile number');
        await user.clear(phone);
        await user.type(phone, '12345');
        await user.click(screen.getByRole('radio', { name: /schedule for later/i }));
        await user.click(placeOrderButton());

        expect(await screen.findByText('Enter a Georgian mobile number, e.g. 555 12 34 56')).toBeInTheDocument();
        expect(screen.getByText('Pick a delivery date and time')).toBeInTheDocument();
        expect(phone).toHaveAttribute('aria-invalid', 'true');
        expect(phone).toHaveFocus();
        expect(bodies).toHaveLength(0);
    });

    it('posts the cart with modifiers, clears the cart and opens order tracking', async () => {
        const bodies = captureOrders();
        const { user } = renderCheckout();
        await screen.findByRole('radio', { name: /Rustaveli Ave 12/ });

        const phone = screen.getByLabelText('Mobile number');
        await user.clear(phone);
        await user.type(phone, '599 11 22 33');
        await user.type(screen.getByLabelText(/delivery instructions/i), 'Ring twice');
        await user.click(placeOrderButton());

        expect(await screen.findByRole('heading', { name: 'Order tracking' })).toBeInTheDocument();
        expect(screen.getByTestId('location')).toHaveTextContent('/orders/new-order');
        expect(bodies).toEqual([
            {
                type: 'INSTANT',
                deliveryType: 'OWN',
                addressId: addresses[0].id,
                paymentMethod: 'CASH',
                contactPhone: '+995599112233',
                notes: 'Ring twice',
                items: [{ itemId: 8, quantity: 1, price: 18, modifiers: [{ modifierId: 11, price: 1.5 }] }],
            },
        ]);
        await waitFor(() => expect(JSON.parse(localStorage.getItem('cart:v2')!)).toEqual([]));
    });

    it('maps API validation errors onto fields and keeps the cart', async () => {
        captureOrders(() =>
            apiError(400, ['contactPhone must be a Georgian mobile number (+9955XXXXXXXX)', 'items.0.quantity must not be less than 1']),
        );
        const { user } = renderCheckout();
        await screen.findByRole('radio', { name: /Rustaveli Ave 12/ });

        await user.click(placeOrderButton());

        const phone = screen.getByLabelText('Mobile number');
        await waitFor(() => expect(phone).toHaveAttribute('aria-invalid', 'true'));
        expect(screen.getByText('contactPhone must be a Georgian mobile number (+9955XXXXXXXX)')).toBeInTheDocument();
        // Not tied to a form field: shown as an alert above the submit button
        expect(screen.getByText('items.0.quantity must not be less than 1')).toHaveAttribute('role', 'alert');
        expect(screen.getByTestId('location')).toHaveTextContent('/checkout');
        expect(JSON.parse(localStorage.getItem('cart:v2')!)).toHaveLength(1);
    });

    it('sends a single order on double click and disables the button meanwhile', async () => {
        let release!: () => void;
        const gate = new Promise<void>((resolve) => (release = resolve));
        const bodies = captureOrders(async () => {
            await gate;
            return envelope(makeOrder({ id: 'new-order' }), 201);
        });
        const { user } = renderCheckout();
        await screen.findByRole('radio', { name: /Rustaveli Ave 12/ });

        await user.dblClick(placeOrderButton());
        await waitFor(() => expect(screen.getByRole('button', { name: /placing order/i })).toBeDisabled());
        release();

        await screen.findByRole('heading', { name: 'Order tracking' });
        expect(bodies).toHaveLength(1);
    });

    it('blocks the order when a cart item is no longer on the menu', async () => {
        const stale = addLine(cart, { itemId: 999, name: 'Retired dish', imageUrl: null, unitPrice: 5, modifiers: [] });
        const { user } = renderWithProviders(null, {
            route: '/checkout',
            authenticated: true,
            cart: stale,
            routes: [{ path: '/checkout', element: <Checkout /> }],
        });

        const warning = await screen.findByText(/no longer on the menu/i);
        expect(placeOrderButton()).toBeDisabled();
        await user.click(within(warning).getByRole('button', { name: /remove them/i }));
        await waitFor(() => expect(placeOrderButton()).toBeEnabled());
    });
});
