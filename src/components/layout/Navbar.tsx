import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems, openCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/menu', label: 'Menu' },
        { path: '/orders', label: 'Orders' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full">
            {/* Glassmorphism black navbar */}
            <div className="bg-primary/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 group">
                            <motion.div
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                                whileHover={{ rotate: 12, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Sparkles className="h-5 w-5 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold text-primary-foreground tracking-tight">
                                Kitchen Gallery
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${isActive(link.path)
                                        ? 'text-primary-foreground'
                                        : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-white/15 rounded-lg -z-10"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/profile')}
                                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="icon"
                                    className="relative bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-orange-500/30"
                                    onClick={openCart}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-primary"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </Button>
                            </motion.div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-2">
                            <Button
                                size="icon"
                                className="relative bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                onClick={openCart}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-primary-foreground hover:bg-white/10"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute w-full bg-primary/98 backdrop-blur-xl border-b border-white/10 shadow-xl"
                    >
                        <div className="container py-4 flex flex-col space-y-1 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-white/15 text-primary-foreground'
                                        : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 mt-2 border-t border-white/10">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                                    onClick={() => { setIsOpen(false); navigate('/profile'); }}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
