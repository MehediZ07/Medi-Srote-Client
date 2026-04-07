'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaClock, FaUser, FaTag, FaMagnifyingGlass, FaArrowRight } from 'react-icons/fa6';

const POSTS = [
  {
    id: 1,
    title: 'Understanding Antibiotic Resistance: What You Need to Know',
    excerpt: 'Antibiotic resistance is one of the biggest threats to global health. Learn how to use antibiotics responsibly and protect yourself and your community.',
    category: 'Antibiotics',
    author: 'Dr. Sarah Ahmed',
    date: 'Jan 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop',
    tag: 'Health Tips',
  },
  {
    id: 2,
    title: 'The Complete Guide to Vitamins and Supplements',
    excerpt: 'Not all vitamins are created equal. Discover which supplements are actually worth taking, the right dosages, and how to avoid common mistakes.',
    category: 'Vitamins',
    author: 'Dr. Karim Hassan',
    date: 'Jan 22, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=400&fit=crop',
    tag: 'Nutrition',
  },
  {
    id: 3,
    title: 'Managing Diabetes: Lifestyle Changes That Make a Difference',
    excerpt: 'Type 2 diabetes can often be managed effectively with the right lifestyle changes. Explore diet, exercise, and medication strategies that work.',
    category: 'Diabetes Care',
    author: 'Dr. Fatima Khan',
    date: 'Jan 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    tag: 'Chronic Care',
  },
  {
    id: 4,
    title: 'Heart Health: Foods That Protect Your Cardiovascular System',
    excerpt: 'Your diet plays a crucial role in heart health. Discover the top foods that reduce inflammation, lower cholesterol, and keep your heart strong.',
    category: 'Heart Health',
    author: 'Dr. Mohammad Rahman',
    date: 'Jan 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop',
    tag: 'Nutrition',
  },
  {
    id: 5,
    title: 'Cold & Flu Season: Prevention and Treatment Guide',
    excerpt: 'As cold and flu season approaches, arm yourself with the best prevention strategies and know when to seek medical attention vs. treat at home.',
    category: 'Cold & Flu',
    author: 'Dr. Sarah Ahmed',
    date: 'Jan 5, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop',
    tag: 'Seasonal Health',
  },
  {
    id: 6,
    title: 'Skin Care Essentials: Building a Routine That Works',
    excerpt: 'A good skincare routine doesn\'t have to be complicated or expensive. Learn the essential steps and products for healthy, glowing skin.',
    category: 'Skin Care',
    author: 'Dr. Rashida Begum',
    date: 'Dec 28, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop',
    tag: 'Wellness',
  },
];

const CATEGORIES = ['All', 'Antibiotics', 'Vitamins', 'Diabetes Care', 'Heart Health', 'Cold & Flu', 'Skin Care'];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = POSTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-teal-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">Health Blog</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Health Tips & Insights</h1>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-8">
              Expert health advice, medicine guides, and wellness tips from our team of licensed pharmacists and doctors.
            </p>
            <div className="relative max-w-md mx-auto">
              <FaMagnifyingGlass size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-600'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {filtered.length > 0 && activeCategory === 'All' && !search && (
          <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="mb-10">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto overflow-hidden">
                <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">{filtered[0].tag}</span>
                  <span className="text-xs text-gray-400">Featured</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{filtered[0].title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{filtered[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                  <span className="flex items-center gap-1"><FaUser size={10} /> {filtered[0].author}</span>
                  <span className="flex items-center gap-1"><FaClock size={10} /> {filtered[0].readTime}</span>
                </div>
                <button className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:gap-3 transition-all">
                  Read Article <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((post, i) => (
            <motion.article key={post.id} {...fadeInUp} transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <FaTag size={9} /> {post.tag}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaUser size={9} /> {post.author.split(' ').slice(-1)[0]}</span>
                    <span className="flex items-center gap-1"><FaClock size={9} /> {post.readTime}</span>
                  </div>
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No articles found for "{search}"</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-emerald-600 font-medium hover:underline text-sm">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
