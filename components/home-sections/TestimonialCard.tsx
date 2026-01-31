type Props = {
  name: string;
  reviews: string;
  time: string;
  text: string;
  image: string;
};

export default function TestimonialCard({
  name,
  reviews,
  time,
  text,
  image,
}: Props) {
  return (
    <div className="w-[360px] h-[220px] bg-white rounded-2xl border-2 border-gray-100 px-6 py-5 mx-4 my-2">
      <div className="flex items-center gap-1 text-gray-700 text-sm mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        <span className="ml-2 text-gray-400">{time}</span>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {text}
      </p>

      <div className="flex items-center gap-3">
        <img 
          src={image} 
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">{reviews}</p>
        </div>
      </div>
    </div>
  );
}