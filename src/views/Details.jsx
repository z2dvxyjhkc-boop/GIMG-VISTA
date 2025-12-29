import React, { useEffect, useState } from 'react';
import { Play, Plus, Check, X, Monitor, Mic, Subtitles, Film, Clock } from 'lucide-react'; // ✅ Añadimos Clock para "Próximamente"
import { useContent } from '../hooks/useContent';
import CastMember from '../components/CastMember';
import { useLibrary } from '../hooks/useLibrary';

const Details = ({ movie, onClose, onPlay }) => {
  const { getContentDetails } = useContent();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isInLibrary, toggleLibrary, loading: listLoading } = useLibrary(movie);

  useEffect(() => {
    const load = async () => {
      const fullData = await getContentDetails(movie.id);
      setDetails(fullData || movie);
      setLoading(false);
    };
    load();
  }, [movie]);

  const displayData = details || movie;
  const castList = displayData.reparto || []; 

  // 🧠 LÓGICA DE ESTRENO:
  // Si NO hay ID de película (youtube_id vacío) PERO sí hay trailer... es un "Próximamente"
  const isComingSoon = !displayData.youtube_id || displayData.youtube_id.trim() === '';
  const hasTrailer = displayData.trailer_id && displayData.trailer_id.trim() !== '';

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0a0a0a] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500 custom-scrollbar">
      
      <button onClick={onClose} className="fixed top-8 right-8 z-50 bg-neutral-800/50 backdrop-blur-xl p-3 rounded-full hover:bg-white hover:text-black transition-all">
        <X size={24} />
      </button>

      {/* Hero Header */}
      <div className="relative w-full h-[85vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10" />
        
        {/* Si es Coming Soon, oscurecemos un poco más la imagen para dar misterio */}
        <img 
          src={displayData.banner_url || displayData.poster_url} 
          className={`w-full h-full object-cover ${isComingSoon ? 'opacity-40 grayscale-[30%]' : 'opacity-60'}`}
          alt="Banner"
        />

        <div className="absolute bottom-0 left-0 w-full p-16 z-20 flex flex-col gap-6 max-w-4xl">
          
          {/* Badge de Estado */}
          <div className="flex gap-3 mb-2">
               {isComingSoon ? (
                 <span className="bg-yellow-500 text-black px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                    <Clock size={12} /> Próximamente
                 </span>
               ) : (
                 <>
                   <span className="border border-white/30 text-white/80 px-1.5 py-0.5 text-[10px] font-bold rounded bg-black/20 backdrop-blur-md">4K UHD</span>
                   <span className="border border-white/30 text-white/80 px-1.5 py-0.5 text-[10px] font-bold rounded bg-black/20 backdrop-blur-md">ATMOS</span>
                 </>
               )}
          </div>

          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
            {displayData.titulo}
          </h1>

          {/* Datos Técnicos */}
          <div className="flex items-center gap-4 text-sm font-bold text-neutral-300">
            <span>{displayData.año || '2025'}</span>
            <span>•</span>
            <span>{displayData.duracion || 'TBA'}</span>
            <span>•</span>
            <span className="border border-neutral-500 px-1 rounded text-xs">{displayData.calificacion || 'B15'}</span>
            {displayData.generos?.map(g => <span key={g} className="text-neutral-500">• {g}</span>)}
          </div>

          <p className="text-xl text-neutral-200 leading-relaxed font-medium max-w-2xl">
            {displayData.descripcion}
          </p>

          {/* 🔥 BOTONES INTELIGENTES 🔥 */}
          <div className="flex gap-4 mt-4">
            
            {isComingSoon ? (
               // OPCIÓN A: MODO "COMING SOON" (Solo Trailer)
               hasTrailer ? (
                 <button 
                   onClick={() => onPlay(displayData.trailer_id)}
                   className="bg-white text-black px-10 py-4 rounded-xl font-black flex items-center gap-3 hover:scale-105 transition-transform"
                 >
                   <Film fill="black" size={20} /> VER TRAILER OFICIAL
                 </button>
               ) : (
                 <button disabled className="bg-white/20 text-white/50 px-10 py-4 rounded-xl font-black cursor-not-allowed border border-white/10">
                   NO DISPONIBLE AÚN
                 </button>
               )
            ) : (
               // OPCIÓN B: MODO "DISPONIBLE" (Película + Trailer opcional)
               <>
                 <button 
                   onClick={() => onPlay(displayData.youtube_id)}
                   className="bg-white text-black px-10 py-4 rounded-xl font-black flex items-center gap-3 hover:scale-105 transition-transform"
                 >
                   <Play fill="black" size={20} /> REPRODUCIR
                 </button>

                 {hasTrailer && (
                   <button 
                     onClick={() => onPlay(displayData.trailer_id)}
                     className="bg-white/10 text-white border border-white/20 px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-all"
                   >
                     <Film size={20} /> TRAILER
                   </button>
                 )}
               </>
            )}
            
            {/* El botón de Biblioteca siempre disponible para "Pre-Guardar" */}
            <button 
              onClick={toggleLibrary} 
              disabled={listLoading}
              className={`backdrop-blur-md border p-4 rounded-xl transition-all ${
                isInLibrary 
                  ? 'bg-white text-black border-white hover:bg-neutral-200' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white hover:text-black'
              }`}
            >
              {isInLibrary ? <Check size={24} /> : <Plus size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="px-16 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16 text-neutral-400">
        
        <div className="lg:col-span-3">
          <h3 className="text-white font-bold text-xl mb-8">Reparto y equipo</h3>
          <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
            {castList.length > 0 ? (
              castList.map(actor => (
                <CastMember key={actor.id} actor={actor} />
              ))
            ) : (
              <div className="text-sm italic opacity-50">No hay información del reparto disponible.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
            <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Información</h4>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Estatus</p>
                {/* ✅ AQUÍ MOSTRAMOS EL ESTADO EN TEXTO TAMBIÉN */}
                <p className={`font-bold ${isComingSoon ? 'text-yellow-500' : 'text-green-500'}`}>
                  {isComingSoon ? 'Próximamente en VISTA' : 'Disponible Ahora'}
                </p>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Estudio</p>
                <p className="text-white">GIMG Studios Original</p>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Géneros</p>
                <p className="text-white">{displayData.generos?.join(', ') || 'General'}</p>
            </div>
        </div>

        <div className="col-span-2 space-y-6">
             <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <Monitor size={16}/> Idiomas
             </h4>
             <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-white font-bold"><Mic size={14}/> Audio Original</div>
                    <p>Español (Latinoamérica) (Dolby Atmos), Inglés</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-white font-bold"><Subtitles size={14}/> Subtítulos</div>
                    <p>Español, Inglés (CC), Francés</p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Details;