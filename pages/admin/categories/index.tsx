import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number;
}

const AdminCategories = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/categories');
    }
    
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const token = localStorage.getItem('token'); // Get token for authenticated request
        const response = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Assuming the API /api/categories already returns product counts or we fetch it here
          // For simplicity, if productCount is not directly in data.categories, 
          // we might need another call or adjust API.
          // The original code had a N+1 problem by fetching count for each category separately.
          // It's better if the main /api/categories endpoint provides this.
          // For now, let's assume productCount might be part of the category object from API
          // or we default it.
          const processedCategories = data.categories.map((cat: any) => ({
            ...cat,
            productCount: cat.productCount || cat._count?.products || 0 // Adjust based on actual API response
          }));
          setCategories(processedCategories);
        } else {
          console.error('Failed to fetch categories:', await response.text());
          setCategories([]); // Set to empty array on error
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set to empty array on error
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchCategories();
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    setIsDeleting(true);
    setDeleteId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete category: ${errorData.message || 'Server error'}`);
        console.error('Failed to delete category:', errorData);
      }
    } catch (error) {
      alert('An error occurred while deleting the category.');
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(false);
      setDeleteId('');
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Manage Categories">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <div className="flex gap-4">
            <Link href="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
            <Link href="/admin/categories/new" className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add Category
            </Link>
          </div>
        </div>
        
        {isLoadingCategories ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product Count
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{category.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{category.productCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/categories/edit/${category.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Edit Category"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting && deleteId === category.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                          title="Delete Category"
                        >
                          {isDeleting && deleteId === category.id ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <FiTrash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-4">No categories found.</div>
            <Link href="/admin/categories/new" className="btn-primary inline-flex items-center">
              <FiPlus className="mr-2" />
              Add Your First Category
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
