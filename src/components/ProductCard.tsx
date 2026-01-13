import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="overflow-hidden h-full flex flex-col group">
                {/* Image Container with Gradient Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww'}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Premium Price Badge */}
                    <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-lg">
                        ${Number(product.price).toFixed(2)}
                    </div>

                    {/* Availability Badge */}
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold text-sm">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg font-bold line-clamp-1 tracking-tight">
                        {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm mt-1.5 leading-relaxed">
                        {product.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-grow">
                    {/* Could add tags, ratings, or cooking time here */}
                </CardContent>

                <CardFooter className="p-5 pt-0">
                    <Button
                        className="w-full gap-2 h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => onAddToCart && onAddToCart(product)}
                        disabled={!product.isAvailable}
                    >
                        {product.isAvailable ? (
                            <>
                                <ShoppingBag className="h-4 w-4" />
                                Add to Cart
                            </>
                        ) : (
                            'Out of Stock'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
