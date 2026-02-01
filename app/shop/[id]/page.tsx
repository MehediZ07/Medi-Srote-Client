'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import { Medicine, Review } from '../../../types/api';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { FaCartPlus } from 'react-icons/fa6';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function MedicineDetail({ params }: Props) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      fetchMedicine(id);
      fetchReviews(id);
    };
    init();
  }, [params]);

  const fetchMedicine = async (id: string) => {
    try {
      const res = await api.get(`/api/medicines/${id}`);
      setMedicine(res.data.data || res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (id: string) => {
    try {
      const res = await api.get(`/api/reviews/medicine/${id}`);
      setReviews(res.data.data || []);
    } catch {
      setReviews([]);
    }
  };

  const addToCart = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      return router.push('/login');
    }
    if (user.role !== 'CUSTOMER') return;
    if (!medicine) return;

    setAddingToCart(true);
    addItem({
      medicineId: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity,
      stock: medicine.stock,
      image: medicine.image
    });
    toast.success('Added to cart');
    setAddingToCart(false);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-b-2 border-[#00B0F4] rounded-full"
        />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Medicine not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.button
          onClick={() => router.back()}
          className="mb-6 text-[#00B0F4] font-medium"
          {...fadeInUp}
        >
          ← Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div {...fadeInUp}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-[420px] object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{medicine.name}</h1>

            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#00B0F4]">
                ${medicine.price}
              </p>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(avgRating))}
                <span className="text-gray-500 text-sm">
                  ({reviews.length})
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {medicine.description}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{medicine.category.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <p className="font-medium">{medicine.seller.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p
                  className={`font-medium ${
                    medicine.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {medicine.stock > 0
                    ? `${medicine.stock} available`
                    : 'Out of stock'}
                </p>
              </div>
            </div>

            {medicine.stock > 0 && (!user || user?.role === 'CUSTOMER') && (
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity</span>
                <input
                  type="number"
                  min={1}
                  max={medicine.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value || 1)}
                  className="w-20 text-center border rounded-lg py-2 focus:ring-2 focus:ring-[#45CBFF]"
                />
              </div>
            )}

            {(!user || user?.role === 'CUSTOMER') && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={addToCart}
                disabled={medicine.stock === 0 || addingToCart}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] 
                           text-white font-semibold shadow-lg disabled:opacity-50
                           flex items-center justify-center gap-3"
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : medicine.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <FaCartPlus className="text-xl" />
                    Add to Cart
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>

        <motion.div {...fadeInUp} className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6">
            Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">No reviews yet</p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#45CBFF] flex items-center justify-center text-white font-bold">
                        {review.customer.name[0]}
                      </div>
                      <span className="font-medium">
                        {review.customer.name}
                      </span>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 ml-12">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
