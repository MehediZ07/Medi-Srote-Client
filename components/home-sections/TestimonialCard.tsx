import { FaStar } from 'react-icons/fa6';

type Props = { name: string; reviews: string; time: string; text: string; image: string; };

export default function TestimonialCard({ name, reviews, time, text, image }: Props) {
  return (
    <div className="w-[340px] bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm px-6 py-5 mx-3 my-2 hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-700 transition-all duration-200">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => <FaStar key={i} size={13} className="text-amber-400" />)}
        <span className="ml-2 text-gray-400 dark:text-gray-500 text-xs">{time}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 line-clamp-3">"{text}"</p>
      <div className="flex items-center gap-3">
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 dark:border-emerald-700"
          onError={(e) => { e.currentTarget.src = '/profile-icon.avif'; }} />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{reviews}</p>
        </div>
      </div>
    </div>
  );
}
