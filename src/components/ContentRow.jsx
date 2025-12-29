import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContentRow = ({ title, items, onSelect }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -window.innerWidth / 2 : window.innerWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12 group/row relative">
      <h2 className="text-xl font-bold mb-4 text-white pl-1">{title}</h2>
      
      {/* Botón Scroll Izquierda */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-white hover:text-black hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Contenedor Scrollable */}
      <div 
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-8 px-1 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Ocultar scrollbar nativa
      >
        {items.map((movie) => (
          <div 
            key={movie.id}
            onClick={() => onSelect(movie)}
            className="flex-none w-[160px] md:w-[200px] aspect-[2/3] bg-neutral-800 rounded-xl overflow-hidden cursor-pointer relative group transition-transform duration-300 hover:scale-105 hover:z-10 snap-start shadow-lg"
          >
            <img 
              src={movie.poster_url || movie.banner_url} 
              alt={movie.titulo}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            
            {/* Overlay Info (Solo en Hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
               <p className="text-white font-bold text-sm line-clamp-2 leading-tight">{movie.titulo}</p>
               <p className="text-neutral-400 text-[10px] mt-1">{movie.año} • {movie.categoria}</p>
            </div>

            {/* Badges Especiales */}
            {movie.es_top_10 && (
               <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                 TOP 10
               </div>
            )}
            
            {/* Si es estreno (Coming Soon) */}
            {(!movie.youtube_id && movie.trailer_id) && (
               <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white border border-white/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                 PROX
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón Scroll Derecha */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-white hover:text-black hidden md:block"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ContentRow;