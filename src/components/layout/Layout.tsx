import { Suspense, useEffect, useRef } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';
import { OfflineBanner } from '../OfflineBanner';

// Document titles (announced by screen readers on navigation)
const PAGE_TITLES: [pattern: string, title: string][] = [
    ['/', 'Georgian food delivery in Batumi'],
    ['/menu', 'Menu'],
    ['/about', 'About us'],
    ['/contact', 'Contact'],
    ['/faq', 'Delivery & FAQ'],
    ['/checkout', 'Checkout'],
    ['/orders/:orderId', 'Order tracking'],
    ['/orders', 'My orders'],
    ['/profile', 'Profile'],
    ['/login', 'Sign in'],
    ['/register', 'Create account'],
];

export function Layout() {
    const { pathname, state } = useLocation();
    const mainRef = useRef<HTMLElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const title = PAGE_TITLES.find(([pattern]) => matchPath(pattern, pathname))?.[1] ?? 'Page not found';
        document.title = `${title} · Tastify`;
    }, [pathname]);

    // On client-side navigation, start at the top and move focus to the new
    // page content so keyboard and screen reader users aren't left on the old link.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        window.scrollTo(0, 0);
        const focusSearch = (state as { focusSearch?: boolean } | null)?.focusSearch;
        if (!focusSearch) mainRef.current?.focus({ preventScroll: true });
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- only on page change

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
            >
                Skip to content
            </a>
            <OfflineBanner />
            <Navbar />
            <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
                {/* Pages are lazy-loaded; keep the navbar in place while a chunk loads */}
                <Suspense fallback={<PageFallback />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
            {/* Top-center keeps toasts clear of the floating cart and chat buttons */}
            <Toaster position="top-center" toastOptions={{ style: { background: '#0a0a0a', color: '#fff', border: '1px solid #1a1a1a' } }} />
        </div>
    );
}

function PageFallback() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center" role="status">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-bright border-t-transparent" aria-hidden />
            <span className="sr-only">Loading page…</span>
        </div>
    );
}
