import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import type { Product } from '../services/products.service';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden h-full flex flex-col group">
                <div className="relative aspect-video overflow-hidden bg-muted">
                    {/* Placeholder for real image since backend might not send one yet */}
                    <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww'}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xs font-bold backdrop-blur">
                        ${Number(product.price).toFixed(2)}
                    </div>
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm mt-1 h-10">
                        {product.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                    {/* Tags or extra info could go here */}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button
                        className="w-full gap-2"
                        onClick={() => onAddToCart && onAddToCart(product)}
                        disabled={!product.isAvailable}
                    >
                        {product.isAvailable ? (
                            <>
                                <Plus className="h-4 w-4" /> Add to Cart
                            </>
                        ) : (
                            'Sold Out'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
