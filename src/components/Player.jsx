import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Player = ({ videoId, onClose }) => {
  // Bloquear scroll del body cuando el player está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] bg-black animate-in fade-in duration-300 flex items-center justify-center">
      
      {/* Botón Cerrar (Arriba derecha) */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-2 bg-black/50 rounded-full"
      >
        <X size={40} />
      </button>

      {/* Contenedor Video (16:9) */}
      <div className="w-full h-full max-w-[90%] max-h-[90%] aspect-video bg-black relative shadow-2xl">
        <iframe 
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=0`} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
};

export default Player;