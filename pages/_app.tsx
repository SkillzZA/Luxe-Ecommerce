import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import CustomCursor from '@/components/ui/CustomCursor';
import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Cart from '@/components/shop/Cart';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [cursorActive, setCursorActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseDown = () => setCursorActive(true);
    const handleMouseUp = () => setCursorActive(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isLoading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-light dark:bg-dark">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
        <p className="mt-4 text-xl font-medium text-gradient">LUXE</p>
      </div>
    </div>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CustomCursor active={cursorActive} />
            <Navbar />
            <Cart />
            <AnimatePresence mode="wait">
              <PageTransition key={router.pathname}>
                <Component {...pageProps} />
              </PageTransition>
            </AnimatePresence>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
