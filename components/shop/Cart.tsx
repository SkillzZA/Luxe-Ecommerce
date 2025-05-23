import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    isCartOpen, 
    toggleCart 
  } = useCart();

  // Close cart when pressing escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isCartOpen, toggleCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />
        )}
      </AnimatePresence>
      
      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-medium">Your Cart</h2>
              <button 
                onClick={toggleCart}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close cart"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Cart Items */}
            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto py-4 px-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.color}-${item.size}`}
                    className="flex gap-4 py-4 border-b dark:border-gray-700 last:border-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder 
                          width={80} 
                          height={80} 
                          text={item.product.name.charAt(0)} 
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.color && `Color: ${item.color}`}
                        {item.color && item.size && ' / '}
                        {item.size && `Size: ${item.size}`}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-2 min-w-[30px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Looks like you haven't added any items to your cart yet.</p>
                <button 
                  onClick={toggleCart}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
            
            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="border-t dark:border-gray-700 p-4">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Link 
                  href="/checkout"
                  className="w-full py-3 mt-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors block text-center"
                  onClick={toggleCart}
                >
                  Checkout
                </Link>
                <button 
                  onClick={clearCart}
                  className="w-full py-2 mt-2 text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
