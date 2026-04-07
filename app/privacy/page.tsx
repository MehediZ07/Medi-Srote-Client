'use client';

import { motion } from 'framer-motion';

const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.', list: ['Personal information (name, email, phone number)', 'Shipping and billing addresses', 'Payment information (processed securely)', 'Medical information (prescriptions, health conditions)', 'Usage data and preferences'] },
  { title: 'How We Use Your Information', list: ['Process and fulfill your orders', 'Provide customer support', 'Send important updates about your orders', 'Improve our services and user experience', 'Comply with legal and regulatory requirements', 'Prevent fraud and ensure platform security'] },
  { title: 'Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:', list: ['With sellers to fulfill your orders', 'With payment processors for transaction processing', 'With delivery services for shipping', 'When required by law or legal process', 'To protect our rights and prevent fraud'] },
  { title: 'Data Security', content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.' },
  { title: 'Your Rights', content: 'You have the right to:', list: ['Access your personal information', 'Correct inaccurate information', 'Delete your account and data', 'Opt-out of marketing communications', 'Request data portability'] },
  { title: 'Cookies and Tracking', content: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.' },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: January 2026</p>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 space-y-8" {...fadeInUp}>
          {sections.map(s => (
            <section key={s.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{s.title}</h2>
              {s.content && <p className="text-gray-600 dark:text-gray-400 mb-4">{s.content}</p>}
              {s.list && (
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  {s.list.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <p className="text-gray-600 dark:text-gray-300">
                Email: privacy@medistore.com<br />
                Phone: +880 12345 67891<br />
                Address: 123 Healthcare Ave, Medical City, MC 12345
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
