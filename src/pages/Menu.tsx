import { useEffect, useState } from 'react';
import { productService, type Product } from '../services/products.service';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Menu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch menu', error);
            toast.error('Could not load menu items. The backend might be sleeping?');
            // Fallback data for demo purposes if backend fails
            setProducts([
                { id: '1', name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and secret sauce.', price: 12.99, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
                { id: '2', name: 'Bacon BBQ Burger', description: 'Smoky BBQ sauce, crispy bacon, onion rings, and pepper jack cheese.', price: 15.49, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5' },
                { id: '3', name: 'Mushroom Swiss', description: 'Sautéed mushrooms, swiss cheese, caramelized onions, and truffle mayo.', price: 14.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        toast.success(`Added ${product.name} to cart`);
        // Implement actual cart logic here
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2">Our Menu</h1>
                <p className="text-muted-foreground">Freshly grilled burgers made just for you.</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
