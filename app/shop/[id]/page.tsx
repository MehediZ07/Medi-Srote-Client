'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Medicine, Review } from '../../../types/api';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';

interface Props {
  params: Promise<{ id: string }>;
}

export default function MedicineDetail({ params }: Props) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [medicineId, setMedicineId] = useState<string>('');
  
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params;
      setMedicineId(resolvedParams.id);
      fetchMedicine(resolvedParams.id);
      fetchReviews(resolvedParams.id);
    };
    
    initializePage();
  }, [params]);

  const fetchMedicine = async (id: string) => {
    try {
      console.log('Fetching medicine with ID:', id);
      const response = await api.get(`/api/medicines/${id}`);
      console.log('Medicine API response:', response.data);
      
      const medicineData = response.data.data || response.data;
      console.log('Medicine data:', medicineData);
      
      setMedicine(medicineData);
    } catch (error) {
      console.error('Error fetching medicine:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (id: string) => {
    try {
      console.log('Fetching reviews for medicine ID:', id);
      const response = await api.get(`/api/reviews/medicine/${id}`);
      console.log('Reviews API response:', response.data);
      
      const reviewsData = response.data.data || response.data || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const addToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'CUSTOMER') {
      alert('Only customers can add items to cart');
      return;
    }

    if (!medicine) {
      alert('Medicine data not available');
      return;
    }

    setAddingToCart(true);
    try {
      addItem({
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity,
        stock: medicine.stock,
        image: medicine.image
      });
      
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Medicine not found</h1>
          <button 
            onClick={() => router.push('/shop')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="h-96 bg-gray-200 rounded-lg mb-4">
            {medicine.image && (
              <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover rounded-lg" />
            )}
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{medicine.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">${medicine.price}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">{renderStars(Math.round(averageRating))}</div>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{medicine.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Category:</span> {medicine.category.name}</p>
              <p><span className="font-medium">Seller:</span> {medicine.seller.name}</p>
              <p><span className="font-medium">Stock:</span> {medicine.stock > 0 ? `${medicine.stock} available` : 'Out of stock'}</p>
            </div>
          </div>
          
          {medicine.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label className="font-semibold">Quantity:</label>
              <input 
                type="number" 
                min="1" 
                max={medicine.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 p-2 border rounded"
              />
            </div>
          )}
          
          <button 
            onClick={addToCart}
            disabled={medicine.stock === 0 || addingToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {addingToCart ? 'Adding...' : medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Reviews ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{review.customer.name}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}