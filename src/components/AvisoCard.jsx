import React, { useState } from 'react';
import { Share2, Bookmark } from 'lucide-react';

const AvisoCard = ({ aviso }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[450px] w-full perspective-1000 group cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* PARTE FRONTAL: El póster de la noticia */}
        <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={aviso.newspaper || aviso.image} 
            className="w-full h-full object-cover"
            alt={aviso.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 p-8 w-full">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 mb-3 inline-block">
              {aviso.category || 'Global Insight'}
            </span>
            <h3 className="text-2xl font-black italic tracking-tighter leading-none mb-2 uppercase">
              {aviso.title}
            </h3>
            <p className="text-sm text-neutral-400 line-clamp-2 font-medium">
              {aviso.excerpt || aviso.desc}
            </p>
          </div>
        </div>

        {/* PARTE TRASERA: Información detallada */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] bg-neutral-900 border border-white/20 p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-xl italic">G</div>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Bookmark size={18} /></button>
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Share2 size={18} /></button>
              </div>
            </div>
            <h4 className="text-xl font-bold mb-4">{aviso.title}</h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {aviso.full_text || aviso.desc || "No hay descripción adicional disponible para esta edición."}
            </p>
          </div>
          
          <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
            Leer Edición Completa
          </button>
        </div>

      </div>
    </div>
  );
};

export default AvisoCard;