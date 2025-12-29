import React from 'react';

const CastMember = ({ actor }) => {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[100px] text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-colors bg-neutral-800 shadow-lg">
        <img 
          src={actor.foto_url || "https://ui-avatars.com/api/?background=333&color=fff&name=?"} 
          alt={actor.nombre_real}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-0.5">
        <p className="text-white text-xs font-bold line-clamp-1">{actor.nombre_real}</p>
        <p className="text-neutral-500 text-[10px] uppercase tracking-wide line-clamp-1">{actor.nombre_personaje}</p>
      </div>
    </div>
  );
};

export default CastMember;