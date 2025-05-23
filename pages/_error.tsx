import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

const Error: NextPage<ErrorProps> = ({ statusCode, message }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">
          {statusCode ? `${statusCode}` : 'Error'}
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          {message || 
            (statusCode === 404
              ? 'The page you are looking for does not exist.'
              : 'An unexpected error has occurred.')}
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You will be redirected to the homepage in {countdown} seconds.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            Go Home Now
          </button>
        </div>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
