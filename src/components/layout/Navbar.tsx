import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems, openCart } = useCart();

    // Kitchen Gallery Nav Items
    const navLinks = [
        { path: '/menu', label: 'Menu' },
        { path: '/about', label: 'About Us' },
        { path: '/faq', label: 'Delivery Zone' },
        { path: '/contact', label: 'Reservations' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background-dark/90 border-b border-accent-dark">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>restaurant_menu</span>
                    </div>
                    <div>
                        <h1 className="text-white text-xl font-serif-display font-bold tracking-tight">Kitchen Gallery</h1>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Batumi</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.path}
                            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Switcher - Visual Only for now */}
                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <button className="text-white hover:text-primary transition-colors">EN</button>
                        <span className="text-gray-700">|</span>
                        <button className="hover:text-primary transition-colors">GE</button>
                        <span className="text-gray-700">|</span>
                        <button className="hover:text-primary transition-colors">RU</button>
                    </div>
                    <div className="h-4 w-px bg-accent-dark hidden sm:block"></div>

                    <button className="text-gray-300 hover:text-white transition-colors relative">
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    <button
                        className="text-gray-300 hover:text-white transition-colors relative"
                        onClick={openCart}
                    >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <Link to="/login" className="hidden md:flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                        Login
                    </Link>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background-dark border-t border-accent-dark"
                    >
                        <div className="px-6 py-4 flex flex-col gap-4">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.path}
                                    className="text-gray-300 hover:text-white font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex gap-4 pt-4 border-t border-accent-dark">
                                <Link to="/login" className="flex-1 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
