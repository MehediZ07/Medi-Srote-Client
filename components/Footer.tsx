import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaXTwitter, FaPhone, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 dark:bg-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <img src="/Medi-Store.png" alt="MediStore" className="h-10 w-auto rounded-sm" />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted online pharmacy delivering authentic medicines with care and reliability.
          </p>
          <div className="flex items-center gap-4 mt-5 text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><FaXTwitter size={18} /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><FaLinkedin size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5">Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact'], ['/blog', 'Blog'], ['/privacy', 'Privacy']].map(([href, label]) => (
              <li key={href}><Link href={href} className="text-gray-400 hover:text-emerald-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-gray-400">
              <FaPhone size={13} className="text-emerald-500 flex-shrink-0" />
              <span>+880 12345 67891</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <FaEnvelope size={13} className="text-emerald-500 flex-shrink-0" />
              <span>info@medistore.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-800 px-4 md:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2026 MediStore. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with ❤️ for better healthcare</p>
        </div>
      </div>
    </footer>
  );
}
