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


interface Category {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
}

interface CategoryCardProps {
  id: string;
  name: string;
  index: number;
}


const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};


const grassColors = [
  {
    bg: "from-[#45CBFF]/30 via-[#7AD9FF]/20 to-white",
    glow: "bg-[#45CBFF]/40",
    icon: "bg-[#45CBFF]/50",
    border: "border-[#45CBFF]/40"
  },
  {
    bg: "from-[#2FBFFF]/30 via-[#6ED4FF]/20 to-white",
    glow: "bg-[#2FBFFF]/40",
    icon: "bg-[#2FBFFF]/50",
    border: "border-[#2FBFFF]/40"
  },
  {
    bg: "from-[#5AD3FF]/30 via-[#8FE4FF]/20 to-white",
    glow: "bg-[#5AD3FF]/40",
    icon: "bg-[#5AD3FF]/50",
    border: "border-[#5AD3FF]/40"
  },
  {
    bg: "from-[#38C7FF]/30 via-[#74DBFF]/20 to-white",
    glow: "bg-[#38C7FF]/40",
    icon: "bg-[#38C7FF]/50",
    border: "border-[#38C7FF]/40"
  }
];


const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, index }) => {
  const router = useRouter();
  const color = grassColors[index % grassColors.length];

  const handleClick = () => {
    router.push(`/shop?categories=${id}`);
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-xl p-6 text-center cursor-pointer
        bg-gradient-to-br ${color.bg}
        border ${color.border}
        shadow-sm hover:shadow-lg
        transition-all duration-300
      `}
    >
      <div
        className={`
          absolute -top-10 -left-10 w-32 h-32
          rounded-full blur-3xl
          ${color.glow}
        `}
      />

      <p className="relative z-10 font-medium text-gray-900">
        {name}
      </p>
    </motion.div>
  );
};


const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<Category[]>>(
        "/api/categories"
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const useCarousel = categories.length > 6;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600">
            Find what you need quickly
          </p>
        </motion.div>

        {useCarousel ? (
          <div className="relative">
            <button
              className="
                absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-10
                text-[#45CBFF]/50 hover:text-[#45CBFF]/90
                transition-colors
              "
              id="category-prev"
              aria-label="Previous"
            >
              <IoIosArrowDropleft size={32} className="md:w-[42px] md:h-[42px]" />
            </button>

            <button
              className="
                absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-10
                text-[#45CBFF]/50 hover:text-[#45CBFF]/90
                transition-colors
              "
              id="category-next"
              aria-label="Next"
            >
              <IoIosArrowDropright size={32} className="md:w-[42px] md:h-[42px]" />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: "#category-prev",
                nextEl: "#category-next"
              }}
              spaceBetween={24}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 6 }
              }}
            >
              {categories.map((cat, index) => (
                <SwiperSlide key={cat.id}>
                  <CategoryCard
                    id={cat.id}
                    name={cat.name}
                    index={index}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Categories;
