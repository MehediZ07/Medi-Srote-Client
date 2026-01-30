import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#e0e0e0] text-gray-700 font-inter">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[60px]">

        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/Medi-Store.png" alt="MediStore" className="h-10 w-auto" />
          </div>
          <p className="text-[15px] leading-[1.7]">
            Your trusted online pharmacy delivering <br className="hidden sm:block" />
            authentic medicines with care and reliability.
          </p>
        </div>

        <div>
          <h4 className="text-gray-700 text-[16px] font-medium mb-5">
            Navigation
          </h4>
          <ul className="space-y-[14px]">
            <li><a href="/shop" className="hover:text-[#00B0F4]">Shop</a></li>
            <li><a href="/about" className="hover:text-[#00B0F4]">About</a></li>
            <li><a href="/privacy" className="hover:text-[#00B0F4]">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-700 text-[16px] font-medium mb-5">
            Legal
          </h4>
          <ul className="space-y-[14px]">
            <li><a href="/privacy" className="hover:text-[#00B0F4]">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-[#00B0F4]">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-700 text-[16px] font-medium mb-5">
            Contact Us
          </h4>
          <p className="text-[15px] leading-[1.8]">
            Email: <span className="text-[#1da1f2]">info@medistore.com</span>
            <br />
            Phone: <span className="text-[#1da1f2]">+880 12345 67891</span>
          </p>
        </div>

      </div>

      <div className="bg-[#f2f2f2] px-4 md:px-10 py-[18px]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#555] text-[14px] text-center md:text-left">
            © 2026 MediStore. All rights reserved.
          </p>

          <div className="flex items-center gap-[18px] text-[#333] text-[16px] font-semibold">
            <FaFacebook/>
            <FaXTwitter />
            <FaLinkedin />
          </div>
        </div>
      </div>
    </footer>
  );
}