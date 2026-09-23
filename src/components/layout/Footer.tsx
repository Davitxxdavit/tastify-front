import { Link } from "react-router-dom";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="bg-background-dark border-t border-surface-border pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-primary">restaurant_menu</span>
                            <h2 className="text-white text-xl font-serif-display font-bold">Tastify</h2>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Bringing the soul of Georgia to your table. Premium ingredients, traditional recipes, and modern service in the heart of Batumi.
                        </p>
                        <div className="flex gap-4">
                            <a className="text-gray-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                            <a className="text-gray-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">photo_camera</span></a>
                            <a className="text-gray-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <li><Link className="text-gray-400 hover:text-primary transition-colors text-sm" to="/menu">Our Menu</Link></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Special Offers</a></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Reservation</a></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Catering</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Contact Us</a></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Delivery Zone</a></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a></li>
                            <li><a className="text-gray-400 hover:text-primary transition-colors text-sm" href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                                <span>12 Rustaveli Ave,<br />Batumi, Georgia</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                <span>+995 555 12 34 56</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                <span>11:00 AM - 11:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">© {COPYRIGHT_YEAR} Tastify, Batumi. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="text-gray-600 text-xs">English</span>
                        <span className="text-gray-600 text-xs">ქართული</span>
                        <span className="text-gray-600 text-xs">Русский</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
