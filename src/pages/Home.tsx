import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 py-24 md:py-32 lg:px-6">
                <div className="flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
                    >
                        Taste the Magic
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 max-w-2xl text-lg text-muted-foreground"
                    >
                        The best burgers in town, delivered hot and fresh to your table.
                        Experience the crunch, the juice, and the flavor.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex gap-4"
                    >
                        <Button size="lg" className="rounded-full text-lg">Order Now</Button>
                        <Button size="lg" variant="outline" className="rounded-full text-lg">View Menu</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
