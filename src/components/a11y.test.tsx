import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { OfflineBanner } from './OfflineBanner';
import { useCart } from '../features/cart/useCart';
import { addLine } from '../features/cart/cart-logic';
import { renderWithProviders } from '../test/render';

function CartHarness() {
    const { openCart } = useCart();
    return (
        <>
            <button type="button" onClick={openCart}>
                Open cart
            </button>
            <CartDrawer />
        </>
    );
}

const cart = addLine([], { itemId: 1, name: 'Badrijani Nigvzit', imageUrl: null, unitPrice: 12, modifiers: [] });

describe('Cart drawer keyboard support', () => {
    it('traps focus inside, closes on Escape and restores focus', async () => {
        const { user } = renderWithProviders(<CartHarness />, { cart });
        const opener = screen.getByRole('button', { name: 'Open cart' });
        await user.click(opener);

        const dialog = screen.getByRole('dialog', { name: 'Your Cart' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(within(dialog).getByRole('button', { name: 'Close cart' })).toHaveFocus();

        // Shift+Tab from the first control wraps to the last one
        await user.tab({ shift: true });
        expect(within(dialog).getByRole('button', { name: 'Proceed to Checkout' })).toHaveFocus();
        await user.tab();
        expect(within(dialog).getByRole('button', { name: 'Close cart' })).toHaveFocus();

        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(opener).toHaveFocus();
    });

    it('labels quantity controls with the dish name', async () => {
        const { user } = renderWithProviders(<CartHarness />, { cart });
        await user.click(screen.getByRole('button', { name: 'Open cart' }));

        await user.click(screen.getByRole('button', { name: 'Increase Badrijani Nigvzit' }));
        expect(within(screen.getByRole('group', { name: 'Quantity of Badrijani Nigvzit' })).getByText('2')).toBeInTheDocument();
    });
});

describe('Offline banner', () => {
    afterEach(() => vi.restoreAllMocks());

    it('appears when the browser goes offline and hides when back online', async () => {
        const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        renderWithProviders(<OfflineBanner />);
        expect(screen.queryByText(/you're offline/i)).not.toBeInTheDocument();

        onLine.mockReturnValue(false);
        act(() => window.dispatchEvent(new Event('offline')));
        expect(screen.getByText(/you're offline/i)).toBeInTheDocument();

        onLine.mockReturnValue(true);
        act(() => window.dispatchEvent(new Event('online')));
        await waitFor(() => expect(screen.queryByText(/you're offline/i)).not.toBeInTheDocument());
    });
});
