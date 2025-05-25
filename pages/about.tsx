import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Sample team members data
const teamMembers = [
  { id: 1, name: 'Mark William', role: 'Product', gender: 'men', photoId: 11 },
  { id: 2, name: 'Sarah Williams', role: 'Support', gender: 'women', photoId: 12 },
  { id: 3, name: 'Michael Williams', role: 'Design', gender: 'men', photoId: 13 },
  { id: 4, name: 'Emma William', role: 'Development', gender: 'women', photoId: 14 },
];

const AboutPage = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <>
      <Head>
        <title>About Us | Luxe E-Commerce</title>
        <meta name="description" content="Learn more about our company and our mission to provide high-quality products." />
      </Head>
      
      <div className="container mx-auto px-4 pt-24 py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            About Us
          </motion.h1>
          
          <motion.div 
            className="relative w-full h-96 mb-12 rounded-xl overflow-hidden shadow-2xl bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <motion.div 
                className="p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2">Luxe Team</h2>
                <p className="text-sm">Passionate about delivering exceptional experiences</p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Story</h2>
              <p>
                Founded in 2020, Luxe E-Commerce aims to provide high-quality products and exceptional customer service. From a small online store, we've grown into a comprehensive platform with a diverse product range.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Our Mission</h2>
              <p>
                We believe shopping should be enjoyable. Our mission is to create a seamless online experience where customers easily find what they need at competitive prices, with reliable delivery and support.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Our Values</h2>
            <motion.ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                [
                  { title: "Quality", description: "Carefully selected products that meet high standards." },
                  { title: "Customer Satisfaction", description: "Your happiness is our priority." },
                  { title: "Integrity", description: "Honest and transparent business practices." },
                  { title: "Innovation", description: "Continuously improving our platform for a better experience." },
                  { title: "Sustainability", description: "Committed to reducing our environmental impact." }
                ].map((value, index) => (
                  <motion.li 
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" as const,
                      delay: index * 0.1 
                    }}
                  >
                    <strong className="text-blue-600 dark:text-blue-400 block mb-2">{value.title}</strong>
                    {value.description}
                  </motion.li>
                ))
              }
            </motion.ul>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400">Our Team</h2>
            <p className="text-center mb-6">
              Our dedicated team is passionate about e-commerce and customer service, committed to delivering an exceptional shopping experience.
            </p>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id}
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="w-20 h-20 mx-auto rounded-full mb-2 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl"
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg shadow-lg text-white text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold mb-4">Join Us</h2>
            <p className="mb-6">
              Welcome to the Luxe community! Whether you're a first-time visitor or a loyal customer, we appreciate your support and look forward to serving you.
            </p>
            <motion.button 
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;
