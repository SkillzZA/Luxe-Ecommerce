import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function Home() {
  // Hero section parallax effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  
  // GSAP animations for product cards
  const productsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (productsRef.current) {
      const cards = productsRef.current.querySelectorAll('.product-card');
      
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  // Animated sections with intersection observer
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  
  const [ref1, inView1] = useInView({ threshold: 0.2, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.2, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.2, triggerOnce: true });
  
  useEffect(() => {
    if (inView1) controls1.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } });
    if (inView2) controls2.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } });
    if (inView3) controls3.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } });
  }, [controls1, controls2, controls3, inView1, inView2, inView3]);

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Minimalist Watch',
      price: 149.99,
      image: '/images/product-1.jpg',
      category: 'Accessories',
    },
    {
      id: 2,
      name: 'Designer Handbag',
      price: 299.99,
      image: '/images/product-2.jpg',
      category: 'Bags',
    },
    {
      id: 3,
      name: 'Premium Sunglasses',
      price: 129.99,
      image: '/images/product-3.jpg',
      category: 'Accessories',
    },
    {
      id: 4,
      name: 'Leather Wallet',
      price: 89.99,
      image: '/images/product-4.jpg',
      category: 'Accessories',
    },
  ];

  // Collections data
  const collections = [
    {
      id: 1,
      name: 'Summer Collection',
      image: '/images/collection-1.jpg',
      description: 'Vibrant styles for the warmer days',
    },
    {
      id: 2,
      name: 'Essentials',
      image: '/images/collection-2.jpg',
      description: 'Timeless pieces for every wardrobe',
    },
    {
      id: 3,
      name: 'Limited Edition',
      image: '/images/collection-3.jpg',
      description: 'Exclusive designs in limited quantities',
    },
  ];

  return (
    <>
      <Head>
        <title>LUXE - Premium E-commerce Experience</title>
        <meta name="description" content="Discover premium products with an immersive shopping experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden pt-8">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: y1, opacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-light dark:to-dark z-10" />
            <div className="w-full h-full">
              <ImagePlaceholder 
                text="" 
                width={2000} 
                height={1200} 
                bgColor="#0369a1" 
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </motion.div>

          <div className="container-custom relative z-10 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 text-black dark:bg-gradient-to-r dark:from-cyan-400 dark:to-purple-600 dark:bg-clip-text dark:text-transparent">
                Elevate Your Style
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-800 dark:text-gray-200 max-w-lg">
                Discover premium products with an immersive shopping experience that delights at every interaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Shop Now
                  </motion.button>
                </Link>
                <Link href="shop">
                  <motion.button
                    className="btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Collections
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gray-50 dark:bg-dark/30">
          <div className="container-custom">
            <motion.div
              ref={ref1}
              initial={{ opacity: 0, y: 50 }}
              animate={controls1}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Handpicked selection of our finest products, curated for quality and style.
              </p>
            </motion.div>

            <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="product-card card-hover"
                  whileHover={{ y: -10 }}
                >
                  <div className="product-image-container mb-4 aspect-square relative overflow-hidden rounded-lg">
                    <ImagePlaceholder
                      text={product.name}
                      bgColor={product.id % 2 === 0 ? '#0ea5e9' : '#d946ef'}
                      style={{ width: '100%', height: '100%' }}
                      className="product-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 transform translate-y-4 transition-all duration-300 hover:opacity-100 hover:translate-y-0">
                      <motion.button
                        className="p-2 rounded-full bg-white text-dark shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="p-2 rounded-full bg-primary-500 text-white shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  <div className="px-2">
                    <span className="text-sm text-primary-500 font-medium">{product.category}</span>
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Products
              </motion.button>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              ref={ref2}
              initial={{ opacity: 0, y: 50 }}
              animate={controls2}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Explore Our Collections
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Curated collections designed to inspire and elevate your personal style.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  className="relative overflow-hidden rounded-2xl h-96 group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <ImagePlaceholder
                    text={collection.name}
                    bgColor={collection.id % 2 === 0 ? '#0284c7' : '#a21caf'}
                    style={{ width: '100%', height: '100%' }}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="mb-4 opacity-90">{collection.description}</p>
                    <motion.button
                      className="btn bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Collection
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-dark/30">
          <div className="container-custom">
            <motion.div
              ref={ref3}
              initial={{ opacity: 0, y: 50 }}
              animate={controls3}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Why Choose LUXE
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We're committed to providing an exceptional shopping experience from start to finish.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                  title: 'Premium Quality',
                  description: 'Carefully selected materials and expert craftsmanship ensure lasting quality.',
                },
                {
                  icon: (
                    <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Fast Shipping',
                  description: 'Quick and reliable delivery to your doorstep, with real-time tracking.',
                },
                {
                  icon: (
                    <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  title: 'Secure Payments',
                  description: 'Multiple payment options with advanced security to protect your information.',
                },
                {
                  icon: (
                    <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  title: 'Customer Support',
                  description: 'Dedicated team ready to assist you with any questions or concerns.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="card-hover text-center p-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            </svg>
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10,0 L0,0 L0,10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </div>
          
          <motion.div 
            className="container-custom relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Join Our Community
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Subscribe to our newsletter for exclusive offers, early access to new collections, and style inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-grow"
                />
                <motion.button
                  className="btn bg-white text-primary-600 hover:bg-white/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Follow Us on Instagram
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                @luxe_official
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  className="aspect-square relative overflow-hidden group"
                  whileHover={{ scale: 0.95 }}
                >
                  <ImagePlaceholder
                    text={`Instagram ${index + 1}`}
                    bgColor={index % 2 === 0 ? '#0ea5e9' : '#d946ef'}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute inset-0 bg-primary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
