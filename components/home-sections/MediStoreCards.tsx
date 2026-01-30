'use client';

export default function MediStoreCards() {
  return (
    <section className="pt-24 max-w-[1200px] mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Why Choose MediStore?</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
        <div className="flex flex-col gap-6 lg:gap-4 lg:w-1/3">
          <div className="flex-1 p-6 rounded-xl shadow-lg bg-[#FBFBFB] flex flex-col gap-3">
            <div className="p-3 bg-blue-50 rounded-md w-max">
              <img src="/rocket-01.png" alt="Rocket Icon" className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold">Fast & Reliable Delivery</h3>
            <p className="text-gray-600 text-[16px]">
              Get your medicines delivered quickly to your doorstep
            </p>
          </div>

          <div className="flex-1 p-6 rounded-xl shadow-lg bg-[#FBFBFB] flex flex-col gap-3">
            <div className="p-3 bg-blue-50 rounded-md w-max">
              <img src="/auto-conversations.png" alt="Auto Icon" className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold">24/7 Customer Support</h3>
            <p className="text-gray-600 text-[16px]">
              Round-the-clock assistance for all your healthcare needs
            </p>
          </div>
        </div>

        <div className="relative flex-1 rounded-xl shadow-lg bg-[#FBFBFB] flex flex-col gap-2 p-6">
          <div className="p-3 bg-blue-50 rounded-md w-max">
            <img src="/money-bag-02.png" alt="Money Icon" className="w-6 h-6" />
          </div>
          <h3 className="text-[24px] md:text-[30px] font-semibold">
            Affordable Prices & Insurance Coverage
          </h3>
          <p className="text-gray-600 text-[16px] md:text-[20px]">
            Best prices on authentic medicines with insurance support
          </p>

          <div className="mt-6 md:mt-[55px] ml-0 md:ml-24">
            <img
              src="/Mask group.png"
              alt="background"
              className="mt-4 w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-4 lg:w-1/3">
          <div className="flex-1 p-6 rounded-xl shadow-lg bg-[#FBFBFB] flex flex-col gap-3">
            <div className="p-3 bg-blue-50 rounded-md w-max">
              <img src="/product-loading.png" alt="Product Icon" className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold">Verified & Authentic</h3>
            <p className="text-gray-600 text-[16px]">
              100% genuine medicines from licensed pharmacies
            </p>
          </div>

          <div className="flex-1 p-6 rounded-xl shadow-lg bg-[#FBFBFB] flex flex-col gap-3">
            <div className="p-3 bg-blue-50 rounded-md w-max">
              <img src="/global.png" alt="Global Icon" className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold">Easy Online Ordering</h3>
            <p className="text-gray-600 text-[16px]">
              Simple prescription upload and hassle-free checkout
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
