import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';
import Menu from './Menu';
import { API, apiError, envelope, server } from '../test/msw';
import { menuCategories } from '../test/fixtures';
import { renderWithProviders } from '../test/render';

const dishNames = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('Menu page', () => {
    it('shows a skeleton, then categories and dishes from the API with GEL prices', async () => {
        renderWithProviders(<Menu />, { route: '/menu' });
        expect(screen.getByLabelText('Loading menu')).toBeInTheDocument();

        expect(await screen.findByRole('heading', { name: 'Appetizers', level: 2 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pastry & Dough', level: 2 })).toBeInTheDocument();
        expect(dishNames()).toHaveLength(5);
        expect(within(screen.getByRole('article', { name: 'Lobiani' })).getByText('14.00 ₾')).toBeInTheDocument();
    });

    it('restores search and category from the URL', async () => {
        renderWithProviders(<Menu />, { route: '/menu?q=khach&category=pastry-dough' });

        await screen.findByRole('heading', { name: 'Pastry & Dough', level: 2 });
        expect(screen.getByRole('searchbox', { name: 'Search dishes' })).toHaveValue('khach');
        expect(screen.getByRole('button', { name: 'Pastry & Dough', pressed: true })).toBeInTheDocument();
        expect(dishNames()).toEqual(['Adjarian Khachapuri', 'Imeruli Khachapuri']);
        expect(screen.getByRole('status')).toHaveTextContent('2 dishes found');
    });

    it('writes search and category changes to the URL', async () => {
        const { user } = renderWithProviders(<Menu />, { route: '/menu' });
        await screen.findByRole('heading', { name: 'Appetizers', level: 2 });

        await user.type(screen.getByRole('searchbox', { name: 'Search dishes' }), 'pkhali');
        expect(screen.getByTestId('location')).toHaveTextContent('/menu?q=pkhali');
        expect(dishNames()).toEqual(['Assorted Pkhali']);

        await user.clear(screen.getByRole('searchbox', { name: 'Search dishes' }));
        await user.click(screen.getByRole('button', { name: 'Appetizers' }));
        expect(screen.getByTestId('location')).toHaveTextContent('/menu?category=appetizers');
        expect(dishNames()).toEqual(['Badrijani Nigvzit', 'Assorted Pkhali']);
    });

    it('offers to reset when nothing matches', async () => {
        const { user } = renderWithProviders(<Menu />, { route: '/menu?q=pizza' });

        expect(await screen.findByRole('heading', { name: 'No dishes found' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /show the full menu/i }));
        expect(dishNames()).toHaveLength(5);
        expect(screen.getByTestId('location')).toHaveTextContent(/^\/menu$/);
    });

    it('shows an error with retry', async () => {
        let calls = 0;
        server.use(
            http.get(`${API}/menu/categories`, () => (++calls === 1 ? apiError(500, 'Internal server error', 'Internal Server Error') : envelope(menuCategories))),
        );
        const { user } = renderWithProviders(<Menu />, { route: '/menu' });

        expect(await screen.findByRole('heading', { name: "We couldn't load the menu" })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /try again/i }));
        expect(await screen.findByRole('heading', { name: 'Appetizers', level: 2 })).toBeInTheDocument();
        expect(calls).toBe(2);
    });

    it('shows an empty state when the menu has no dishes', async () => {
        server.use(http.get(`${API}/menu/categories`, () => envelope([])));
        renderWithProviders(<Menu />, { route: '/menu' });
        expect(await screen.findByRole('heading', { name: 'The menu is being prepared' })).toBeInTheDocument();
    });

    it('adds a dish with modifiers from the options dialog', async () => {
        const { user } = renderWithProviders(<Menu />, { route: '/menu' });
        await user.click(await screen.findByRole('button', { name: 'Choose options for Adjarian Khachapuri' }));

        const dialog = screen.getByRole('dialog', { name: 'Adjarian Khachapuri' });
        await user.click(within(dialog).getByRole('checkbox', { name: /extra egg/i }));
        await user.click(within(dialog).getByRole('button', { name: 'Increase quantity' }));
        await user.click(within(dialog).getByRole('button', { name: 'Add · 39.00 ₾' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        const [line] = JSON.parse(localStorage.getItem('cart:v2')!);
        expect(line).toMatchObject({ itemId: 8, quantity: 2, modifiers: [{ id: 11, name: 'Extra egg', price: 1.5 }] });
        expect(screen.getByRole('button', { name: 'View order: 2 items, 39.00 ₾' })).toBeInTheDocument();
    });
});
