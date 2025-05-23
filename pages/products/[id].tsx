import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, ProductImage } from '@prisma/client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface ProductWithDetails extends Product {
  category: {
    id: string;
    name: string;
  };
  images: ProductImage[];
}

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.mainImage);
        } else {
          throw new Error('Product data is missing');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load product data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Fallback product for development/preview
  const fallbackProduct: ProductWithDetails = {
    id: '1',
    name: 'Classic T-Shirt',
    description: 'A comfortable cotton t-shirt for everyday wear. Made from 100% organic cotton, this t-shirt is both stylish and environmentally friendly. Available in multiple colors and sizes.',
    price: 19.99,
    comparePrice: 24.99,
    mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    categoryId: '1',
    category: {
      id: '1',
      name: 'Clothing'
    },
    featured: true,
    isNew: true,
    inStock: true,
    stock: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        productId: '1',
        alt: 'Classic T-Shirt front view',
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        productId: '1',
        alt: 'Classic T-Shirt back view',
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };

  const displayProduct = product || fallbackProduct;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (displayProduct && value > displayProduct.stock) {
      setQuantity(displayProduct.stock);
    } else {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (displayProduct && quantity < displayProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const { addItem } = useCart();

  const addToCart = async () => {
    if (!displayProduct.inStock || displayProduct.stock === 0) {
      return;
    }

    setAddingToCart(true);
    
    try {
      // Convert the ProductWithDetails to the Product type expected by CartContext
      const productForCart = {
        id: displayProduct.id,
        name: displayProduct.name,
        price: displayProduct.price,
        description: displayProduct.description,
        // Add required fields from Product interface
        features: [],
        images: [displayProduct.mainImage],
        category: displayProduct.category.name,
        tags: [],
        colors: [],
        rating: 0,
        reviews: 0,
        stock: displayProduct.stock,
        sku: displayProduct.id,
      };
      
      // Add to cart using the CartContext
      addItem({
        product: productForCart,
        quantity: quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{displayProduct?.name || 'Product'} | Luxe E-Commerce</title>
        <meta name="description" content={displayProduct?.description?.substring(0, 160) || 'Product details'} />
      </Head>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <Link href={`/collections/${displayProduct.categoryId}`} className="text-primary hover:underline">
            ← Back to {displayProduct.category.name}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={selectedImage || displayProduct.mainImage}
                alt={displayProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
              {displayProduct.isNew && (
                <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {displayProduct.images.map((image) => (
                <div 
                  key={image.id}
                  className={`relative h-24 cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedImage === image.url ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || displayProduct.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{displayProduct.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">${displayProduct.price.toFixed(2)}</span>
              {displayProduct.comparePrice && (
                <span className="ml-3 text-gray-500 line-through">
                  ${displayProduct.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {displayProduct.description}
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Availability:</span>
                {displayProduct.inStock ? (
                  <span className="text-green-600">In Stock ({displayProduct.stock} available)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="font-medium mr-2">Category:</span>
                <Link href={`/collections/${displayProduct.categoryId}`} className="text-primary hover:underline">
                  {displayProduct.category.name}
                </Link>
              </div>
            </div>
            
            {displayProduct.inStock && displayProduct.stock > 0 && (
              <>
                <div className="mb-6">
                  <label htmlFor="quantity" className="block font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={displayProduct.stock}
                      className="w-16 text-center border-y border-gray-300 dark:border-gray-600 py-2 dark:bg-gray-700"
                    />
                    <button 
                      onClick={increaseQuantity}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                {addedToCart && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md"
                  >
                    Product added to cart successfully!
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
