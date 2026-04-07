"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../../lib/api";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";

interface Category { id: string; name: string; }
interface ApiResponse<T> { data: T; }
interface CategoryCardProps { id: string; name: string; index: number; }

const fadeInUp: Variants = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const staggerContainer: Variants = { animate: { transition: { staggerChildren: 0.1 } } };

const colors = [
  { bg: 'from-emerald-50 dark:from-emerald-900/30 to-white dark:to-slate-800', border: 'border-emerald-200/60 dark:border-emerald-700/60' },
  { bg: 'from-teal-50 dark:from-teal-900/30 to-white dark:to-slate-800', border: 'border-teal-200/60 dark:border-teal-700/60' },
  { bg: 'from-green-50 dark:from-green-900/30 to-white dark:to-slate-800', border: 'border-green-200/60 dark:border-green-700/60' },
  { bg: 'from-emerald-50 dark:from-emerald-900/20 to-white dark:to-slate-800', border: 'border-emerald-200/60 dark:border-emerald-700/60' },
];

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, index }) => {
  const router = useRouter();
  const color = colors[index % colors.length];
  return (
    <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} onClick={() => router.push(`/shop?categories=${id}`)}
      className={`relative overflow-hidden rounded-xl p-6 text-center cursor-pointer bg-gradient-to-br ${color.bg} border ${color.border} shadow-sm hover:shadow-lg transition-all duration-300`}>
      <p className="relative z-10 font-medium text-gray-900 dark:text-gray-100">{name}</p>
    </motion.div>
  );
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Category[]>>("/api/categories")
      .then(r => setCategories(r.data.data))
      .catch(console.error);
  }, []);

  const useCarousel = categories.length > 6;

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" animate="animate">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">Browse by Type</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Shop by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Find what you need quickly</p>
        </motion.div>

        {useCarousel ? (
          <div className="relative">
            <button className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-10 text-emerald-400/60 hover:text-emerald-500 transition-colors" id="category-prev" aria-label="Previous">
              <IoIosArrowDropleft size={32} className="md:w-[42px] md:h-[42px]" />
            </button>
            <button className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-10 text-emerald-400/60 hover:text-emerald-500 transition-colors" id="category-next" aria-label="Next">
              <IoIosArrowDropright size={32} className="md:w-[42px] md:h-[42px]" />
            </button>
            <Swiper modules={[Navigation]} navigation={{ prevEl: "#category-prev", nextEl: "#category-next" }} spaceBetween={24} slidesPerView={2} breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 6 } }}>
              {categories.map((cat, index) => (
                <SwiperSlide key={cat.id}><CategoryCard id={cat.id} name={cat.name} index={index} /></SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {categories.map((cat, index) => <CategoryCard key={cat.id} id={cat.id} name={cat.name} index={index} />)}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Categories;
