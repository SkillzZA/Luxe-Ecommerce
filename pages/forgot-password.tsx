import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import PageTransition from '@/components/animations/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real application, this would call an API endpoint
      // For demo purposes, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container-custom min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {isSubmitted ? 'Check your email' : 'Reset your password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isSubmitted 
                ? 'We\'ve sent a password reset link to your email address.' 
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </p>
          </div>
          
          {!isSubmitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex justify-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-800 dark:text-green-200">
                <p>If an account exists with the email <strong>{email}</strong>, you will receive a password reset link shortly.</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive an email? Check your spam folder or try again with a different email address.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary w-full"
              >
                Try again
              </button>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500">
              <FiArrowLeft className="mr-2" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
