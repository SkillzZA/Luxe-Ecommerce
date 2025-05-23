import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiFilter, FiX, FiGrid, FiList, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { useCart } from '@/context/CartContext';
import { Product as ProductType } from '@/data/products';

// Define the ProductImage interface to match the database schema
interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

// Define the database Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  mainImage: string;
  categoryId: string;
  featured: boolean;
  isNew: boolean;
  inStock: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  images?: ProductImage[];
  isOnSale?: boolean;
}

// Create a type that combines both Product interfaces for compatibility
type CombinedProduct = Product & Partial<ProductType>;

// Define the Category interface
interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  productsCount?: number;
}

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState<CombinedProduct[]>([]);
  const [products, setProducts] = useState<CombinedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  });
  
  const { addItem, toggleCart } = useCart();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const data = await productsResponse.json();
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products when category or other filters change
  useEffect(() => {
    if (products.length === 0) return;
    
    let filtered = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => {
        // Handle different possible category structures
        if (typeof product.category === 'string') {
          return product.category === activeCategory;
        } else if (product.category && typeof product.category === 'object') {
          // Use type assertion to safely access category properties
          const categoryObj = product.category as { id?: string; name?: string };
          return categoryObj.id === activeCategory;
        }
        return false;
      });
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = filtered.filter(product => product.isNew).concat(
          filtered.filter(product => !product.isNew)
        );
        break;
      case 'featured':
      default:
        filtered = filtered.filter(product => product.featured).concat(
          filtered.filter(product => !product.featured)
        );
        break;
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, sortBy, priceRange]);
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleAddToCart = (product: CombinedProduct) => {
    // Convert CombinedProduct to the Product type expected by CartContext
    const cartProduct = product as unknown as ProductType;
    addItem({
      product: cartProduct,
      quantity: 1,
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container-custom pt-24 pb-20">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>
      
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <FiList />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <motion.div 
          className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-xl font-medium">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiX />
            </button>
          </div>
          
          {/* Categories */}
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>Categories</span>
              {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.categories && (
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`block w-full text-left px-2 py-1 rounded-md ${
                    activeCategory === 'all' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' : ''
                  }`}
                >
                  All Products
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.slug ?? category.id)}
                    className={`block w-full text-left px-2 py-1 rounded-md ${
                      activeCategory === category.slug || activeCategory === category.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' : ''
                    }`}
                  >
                    {category.name} ({category.productsCount || filteredProducts.filter(p => {
                      if (p.category && typeof p.category === 'object') {
                        const cat = p.category as { id?: string };
                        return cat.id === category.id;
                      }
                      return p.categoryId === category.id;
                    }).length})
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Price Range */}
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>Price Range</span>
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.price && (
              <div className="mt-2">
                <div className="flex justify-between mb-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <FiList />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Product Count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
          
          {filteredProducts.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
            >
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
                    <Link href={`/shop/${product.id}`}>
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        {product.mainImage ? (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            unoptimized
                          />
                        ) : product.images && product.images.length > 0 && product.images[0].url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            unoptimized
                          />
                        ) : (
                          <ImagePlaceholder 
                            width={500} 
                            height={500} 
                            text={product.name.charAt(0)} 
                          />
                        )}
                      </div>
                    </Link>
                    
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    
                    {product.isOnSale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="text-lg font-medium hover:text-primary-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => {
                          // Default rating to 4 stars if not available
                          const rating = 4;
                          return (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (25)
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      {product.comparePrice ? (
                        <div className="flex items-center">
                          <span className="text-lg font-medium">${product.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-medium">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {viewMode === 'list' && (
                      <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => { handleAddToCart(product); toggleCart(); }}
                        className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
                      >
                        Add to Cart
                      </button>
                      
                      <Link href={`/shop/${product.id}`} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                        <span className="sr-only">View Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters or search criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, 500]);
                  setSortBy('featured');
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
