import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Flame, ChefHat } from "lucide-react";

export default function Home() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-amber-500/5 to-transparent blur-2xl" />
            </div>

            {/* Hero Section */}
            <div className="relative container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm font-medium text-amber-600 mb-6"
                        >
                            <Flame className="h-4 w-4" />
                            #1 Rated Burgers in Town
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
                        >
                            <span className="text-foreground">Crafted for</span>
                            <br />
                            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                True Taste
                            </span>
                            <br />
                            <span className="text-foreground">Lovers</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            Premium angus beef, artisan buns, and secret sauces.
                            Every bite is a journey of flavor that you'll never forget.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link to="/menu">
                                <Button size="lg" className="rounded-full text-base px-8 h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 gap-2 w-full sm:w-auto">
                                    <span>Order Now</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/menu">
                                <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 border-2 hover:bg-muted gap-2 w-full sm:w-auto">
                                    <ChefHat className="h-5 w-5" />
                                    <span>View Full Menu</span>
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-black text-foreground">50K+</div>
                                <div className="text-sm text-muted-foreground">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-3xl font-black text-foreground">
                                    4.9 <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                                </div>
                                <div className="text-sm text-muted-foreground">Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-3xl font-black text-foreground">
                                    <Clock className="h-6 w-6 text-primary" /> 15m
                                </div>
                                <div className="text-sm text-muted-foreground">Avg. Prep Time</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative order-1 lg:order-2"
                    >
                        <div className="relative mx-auto w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/20 rounded-full blur-3xl scale-90" />

                            {/* Main burger image */}
                            <motion.img
                                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
                                alt="Delicious Burger"
                                className="relative w-full h-full object-cover rounded-full shadow-2xl border-8 border-white/50"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Floating badges */}
                            <motion.div
                                className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-white text-lg">🥬</span>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">100%</div>
                                    <div className="text-sm font-bold">Fresh</div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                    <span className="text-white text-lg">🍖</span>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Premium</div>
                                    <div className="text-sm font-bold">Angus Beef</div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute left-1/4 -bottom-2 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                                    <Flame className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Flame</div>
                                    <div className="text-sm font-bold">Grilled</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="relative bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Kitchen Gallery?</h2>
                        <p className="text-primary-foreground/70 max-w-2xl mx-auto">We're not just another burger joint. We're a flavor revolution.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "🔥", title: "Flame Grilled", desc: "Every patty is grilled over open flames for that smoky perfection" },
                            { icon: "🥩", title: "Premium Meat", desc: "100% Angus beef, never frozen, always fresh from local farms" },
                            { icon: "⚡", title: "Fast & Fresh", desc: "From our kitchen to your table in under 15 minutes" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-primary-foreground/70 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link to="/menu">
                            <Button size="lg" variant="secondary" className="rounded-full px-8 h-12 bg-white text-primary hover:bg-white/90 shadow-lg">
                                Explore Menu
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
