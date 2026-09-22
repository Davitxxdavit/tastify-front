import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';
import { OfflineBanner } from '../OfflineBanner';

export function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <OfflineBanner />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            {/* Top-center keeps toasts clear of the floating cart and chat buttons */}
            <Toaster position="top-center" toastOptions={{ style: { background: '#0a0a0a', color: '#fff', border: '1px solid #1a1a1a' } }} />
        </div>
    );
}
