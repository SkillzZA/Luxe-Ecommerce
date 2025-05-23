import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft, FiClock, FiPackage, FiTruck, FiCheck, FiX, FiMapPin, FiCreditCard } from 'react-icons/fi';
import Image from 'next/image';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    mainImage: string;
  };
}

interface ShippingAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      if (id && isAuthenticated) {
        try {
          setIsLoadingOrder(true);
          const response = await fetch(`/api/orders/${id}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              setError('Order not found');
            } else {
              setError('Failed to fetch order details');
            }
            return;
          }
          
          const data = await response.json();
          setOrder(data);
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('An error occurred while fetching order details');
        } finally {
          setIsLoadingOrder(false);
        }
      }
    };

    if (id && isAuthenticated) {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated, isLoading, router]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FiClock className="h-6 w-6" />;
      case 'PROCESSING':
        return <FiPackage className="h-6 w-6" />;
      case 'SHIPPED':
        return <FiTruck className="h-6 w-6" />;
      case 'DELIVERED':
        return <FiCheck className="h-6 w-6" />;
      case 'CANCELLED':
        return <FiX className="h-6 w-6" />;
      default:
        return <FiClock className="h-6 w-6" />;
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading || (isLoadingOrder && !error)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
          <Link href="/orders" className="btn-primary">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg mb-6">
            Order data is not available
          </div>
          <Link href="/orders" className="btn-primary">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusStep = getStatusStep(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const orderTime = new Date(order.createdAt).toLocaleTimeString();

  return (
    <>
      <Head>
        <title>Order #{order.id.substring(0, 8)} | Luxe E-Commerce</title>
        <meta name="description" content={`Order details for order #${order.id.substring(0, 8)}`} />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-primary-500 hover:text-primary-600">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Placed on {orderDate} at {orderTime}
            </p>
          </div>
          
          {order.status !== 'CANCELLED' && (
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full ${
                order.status === 'DELIVERED' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : order.status === 'SHIPPED'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : order.status === 'PROCESSING'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </span>
            </div>
          )}

          {order.status === 'CANCELLED' && (
            <div className="mt-4 md:mt-0">
              <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                <FiX className="mr-1" /> CANCELLED
              </span>
            </div>
          )}
        </div>

        {order.status !== 'CANCELLED' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            
            <div className="relative">
              {/* Progress bar */}
              <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 ${
                    statusStep === -1 ? 'w-0' : statusStep === 0 ? 'w-1/4' : statusStep === 1 ? 'w-2/4' : statusStep === 2 ? 'w-3/4' : 'w-full'
                  }`}
                ></div>
              </div>
              
              {/* Status steps */}
              <div className="flex justify-between">
                <div className={`text-center ${statusStep >= 0 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center ${
                    statusStep >= 0 ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <FiClock className={statusStep >= 0 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Pending</p>
                </div>
                
                <div className={`text-center ${statusStep >= 1 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center ${
                    statusStep >= 1 ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <FiPackage className={statusStep >= 1 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Processing</p>
                </div>
                
                <div className={`text-center ${statusStep >= 2 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center ${
                    statusStep >= 2 ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <FiTruck className={statusStep >= 2 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Shipped</p>
                  {order.trackingNumber && statusStep >= 2 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                
                <div className={`text-center ${statusStep >= 3 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center ${
                    statusStep >= 3 ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <FiCheck className={statusStep >= 3 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Delivered</p>
                  {order.estimatedDelivery && statusStep < 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Est: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <li key={item.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        {item.product.mainImage ? (
                          <Image
                            src={item.product.mainImage}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link href={`/products/${item.productId}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400">
                            {item.name}
                          </Link>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <Link href={`/products/${item.productId}`} className="text-xs text-primary-500 hover:text-primary-600">
                              Buy Again
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Subtotal</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p>Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FiMapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>
              
              {order.shippingAddress ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="mb-1">{order.shippingAddress.street}</p>
                  <p className="mb-1">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No shipping address available</p>
              )}
            </div>
            
            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FiCreditCard className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Payment Information</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="text-sm text-gray-900 dark:text-white">{order.paymentMethod}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Need Help? */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
              <div className="space-y-3">
                <Link href="/contact" className="block text-sm text-primary-500 hover:text-primary-600">
                  Contact Customer Support
                </Link>
                <Link href="/faq" className="block text-sm text-primary-500 hover:text-primary-600">
                  Return Policy
                </Link>
                <Link href="/faq" className="block text-sm text-primary-500 hover:text-primary-600">
                  Shipping Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
