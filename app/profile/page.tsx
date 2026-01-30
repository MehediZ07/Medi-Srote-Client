'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: 'easeOut' as const,   // fixes the TypeScript error
  },
} as const;

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <ProtectedRoute>
        <div className=" flex items-center justify-center bg-gray-50">
          <div className="text-lg font-medium text-gray-600">Loading profile...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className=" bg-gradient-to-b from-[#45CBFF]/10 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto"> {/* narrower card – change to max-w-lg if you want it a bit wider */}

          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-10 text-center"
            {...fadeInUp}
          >
            My Profile
          </motion.h1>

          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100/70 overflow-hidden"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <div className="px-8 pt-10 pb-6 flex flex-col items-center bg-gradient-to-b from-gray-50/60 to-transparent">
              <div className="relative mb-5">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#45CBFF]/70 shadow-md">
                  <img
                    src={user.image || '/placeholder.png'}
                    alt={`${user.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {user.status?.toLowerCase() === 'active' && (
                  <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-600/30" />
                )}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="mt-1 text-gray-500 text-sm">{user.email}</p>
            </div>

            {/* Details section */}
            <div className="px-8 pb-10 pt-2 bg-[#45CBFF]/10">
              <div className="space-y-4 divide-y divide-gray-100">
                <InfoRow label="Role"     value={user.role}     capitalize />
                <InfoRow label="Status"   value={user.status}   capitalize />
              
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

type InfoRowProps = {
  label: string;
  value: string | number | undefined;
  capitalize?: boolean;
};

function InfoRow({ label, value, capitalize = false }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-3 first:pt-4 last:pb-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span
        className={`text-sm font-medium text-gray-900 ${capitalize ? 'capitalize' : ''}`}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}