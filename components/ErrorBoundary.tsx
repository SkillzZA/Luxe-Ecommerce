import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-primary-500 mb-4">Something went wrong</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {this.state.error?.message || 'An unexpected error has occurred'}
            </p>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please try refreshing the page or navigate back to the homepage.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
                >
                  Refresh Page
                </button>
                <Link href="/" className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors text-center">
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
