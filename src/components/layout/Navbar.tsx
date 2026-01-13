import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems, openCart } = useCart();
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
                            Tastify
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-md font-medium text-muted-foreground transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link to="/menu" className="text-md font-medium text-muted-foreground transition-colors hover:text-primary">
                            Menu
                        </Link>
                        <Link to="/orders" className="text-md font-medium text-muted-foreground transition-colors hover:text-primary">
                            Orders
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                            <User className="h-5 w-5" />
                        </Button>
                        <Button variant="default" size="icon" className="relative" onClick={openCart}>
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t"
                    >
                        <div className="container py-4 flex flex-col space-y-4 px-4 bg-background">
                            <Link to="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                Home
                            </Link>
                            <Link to="/menu" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                Menu
                            </Link>
                            <Link to="/orders" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                                Orders
                            </Link>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setIsOpen(false); navigate('/profile'); }}>
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                                <Button variant="default" size="sm" onClick={() => { setIsOpen(false); openCart(); }}>
                                    Cart ({totalItems})
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
