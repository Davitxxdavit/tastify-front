import { motion } from 'framer-motion';
import type { Category } from '../services/categories.service';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategory === null
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
            >
                All Items
            </motion.button>
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    {category.name}
                </motion.button>
            ))}
        </div>
    );
}
