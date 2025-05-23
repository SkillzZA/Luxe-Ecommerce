import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';

interface CategoryToEdit {
  id: string;
  name: string;
  description: string;
}

const EditCategory = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/categories');
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('token');
        // Assuming API endpoint for fetching a single category is /api/categories/[id]
        const response = await fetch(`/api/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        const data = await response.json();
        // Assuming the API returns the category object directly or nested under a key like 'category'
        const categoryData = data.category || data;
        setFormData({
          name: categoryData.name,
          description: categoryData.description,
        });
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Failed to load category data');
      }
    };
    if (isAuthenticated && user?.role === 'ADMIN' && id) {
      fetchData();
    }
  }, [id, isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (!formData.name.trim()) {
        throw new Error('Category name is required');
      }

      const token = localStorage.getItem('token');
      // Assuming API endpoint for updating a category is PUT /api/categories/[id]
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update category');
      }
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <AdminLayout title="Edit Category">
        <div className="container mx-auto px-4 pb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Category</h1>
            <Link href="/admin/categories" className="btn-secondary flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Categories
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Category">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <Link href="/admin/categories" className="btn-secondary flex items-center">
            <FiArrowLeft className="mr-2" />
            Back to Categories
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Update Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory; 