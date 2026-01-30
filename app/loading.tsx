export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#45CBFF]/10 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00B0F4] mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
}