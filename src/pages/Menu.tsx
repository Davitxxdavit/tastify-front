import { useEffect, useState } from 'react';
import { productService, type Product } from '../services/products.service';
import { categoriesService, type Category } from '../services/categories.service';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { Input } from '../components/ui/Input';

export default function Menu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchProductsByCategory(selectedCategory);
        } else {
            fetchProducts();
        }
    }, [selectedCategory]);

    const fetchData = async () => {
        await Promise.all([fetchCategories(), fetchProducts()]);
    };

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch menu', error);
            toast.error('Could not load menu items.');
            // Fallback data
            setProducts([
                { id: '1', name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and secret sauce.', price: 12.99, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
                { id: '2', name: 'Bacon BBQ Burger', description: 'Smoky BBQ sauce, crispy bacon, onion rings, and pepper jack cheese.', price: 15.49, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5' },
                { id: '3', name: 'Mushroom Swiss', description: 'Sautéed mushrooms, swiss cheese, caramelized onions, and truffle mayo.', price: 14.50, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async (categoryId: string) => {
        try {
            setLoading(true);
            const data = await productService.getByCategory(categoryId);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products by category', error);
            toast.error('Could not filter menu items.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        addItem(product);
        toast.success(`Added ${product.name} to cart`);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && products.length === 0) {
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

            {/* Search Bar */}
            <div className="mb-6 max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="mb-8">
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
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

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No items found matching your search.</p>
                </div>
            )}
        </div>
    );
}
