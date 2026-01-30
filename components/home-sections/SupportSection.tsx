"use client";

export const SupportSection = () => {
  return (
    <section className="w-full pt-24 flex justify-center">
      <div className="w-full max-w-[1200px] bg-gray-50 rounded-[32px] px-16 py-14 flex items-center gap-16">
        
        <div className="flex-1">
          <h2 className="text-[40px] leading-[52px] font-bold text-[#2B2F38] mb-8">
            Expert Support & Guidance
          </h2>

          <ul className="space-y-4 text-[#4B5563] text-[18px] leading-[28px]">
            <li className="flex items-start gap-3">
              <span className="text-[#2B2F38] mt-1">✓</span>
              Licensed Pharmacists Available
            </li>

            <li className="flex items-start gap-3">
              <span className="text-[#2B2F38] mt-1">✓</span>
              WhatsApp / Email Support
            </li>

            <li className="flex items-start gap-3">
              <span className="text-[#2B2F38] mt-1">✓</span>
              Step-by-step Ordering Guide
            </li>
          </ul>

          <button className="mt-6 h-12 px-6 py-3 bg-[#00b0f4] hover:bg-[#00a0e4] rounded-sm font-medium text-white text-lg flex items-center gap-2">
            Get Help Now 
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3124 3.41465L2.39037 11.0623" stroke="white" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5101 2.38989C7.5101 2.38989 12.6833 2.51371 13.3131 3.41313C13.9429 4.31256 12.2899 9.21617 12.2899 9.21617" stroke="white" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="relative w-[407px] h-[308px]">
          <img
            src="/Frame 2147236984.png"
            alt="Support illustration"
            className="w-full h-full object-cover rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
};