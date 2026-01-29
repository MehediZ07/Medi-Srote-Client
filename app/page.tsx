'use client';

import { useSearchParams } from 'next/navigation';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MediStore
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted online pharmacy
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Quality Medicines</h3>
            <p className="text-gray-600">Authentic medicines from trusted manufacturers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">Professional pharmacist consultation available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
