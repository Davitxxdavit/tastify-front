import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthProvider';
import { CartProvider } from '../features/cart/CartProvider';
import type { CartLine } from '../features/cart/cart-logic';
import { tokenStorage } from '../lib/http/token-storage';
import { makeSession } from './fixtures';

interface RenderOptions {
    /** Initial URL. */
    route?: string;
    /** Route table; defaults to rendering `ui` at every path. */
    routes?: { path: string; element: ReactElement }[];
    authenticated?: boolean;
    cart?: CartLine[];
}

/** Renders the current location so tests can assert on navigation. */
function LocationProbe() {
    const location = useLocation();
    return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

export function renderWithProviders(ui: ReactElement | null, { route = '/', routes, authenticated = false, cart }: RenderOptions = {}) {
    if (authenticated) tokenStorage.setSession(makeSession());
    if (cart) localStorage.setItem('cart:v2', JSON.stringify(cart));

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
    });
    const user = userEvent.setup();

    const result = render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter initialEntries={[route]}>
                        <Routes>
                            {(routes ?? [{ path: '*', element: ui! }]).map(({ path, element }) => (
                                <Route key={path} path={path} element={element} />
                            ))}
                        </Routes>
                        <LocationProbe />
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>,
    );

    return { ...result, user, queryClient };
}
