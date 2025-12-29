import React, { useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent';
// ✅ CORRECCIÓN: Añadí 'PlayCircle' a la importación
import { Play, Info, Star, Award, Zap, PlayCircle } from 'lucide-react';

const Originals = ({ onSelectMovie }) => {
  const { getAllContent } = useContent();
  const [originals, setOriginals] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOriginals = async () => {
      const all = await getAllContent();
      // Filtramos solo los que son CATEGORÍA 'ORIGINAL'
      const filtered = all.filter(m => m.categoria === 'ORIGINAL');
      
      if (filtered.length > 0) {
        setFeatured(filtered[0]); // El más nuevo es el destacado
        setOriginals(filtered.slice(1)); // El resto va a la lista
      }
      setLoading(false);
    };
    loadOriginals();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
           <p className="text-xs font-black tracking-[0.3em] text-neutral-500 uppercase">Cargando Experiencia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-40 animate-in fade-in duration-1000 selection:bg-blue-500 selection:text-white">
      
      {/* --- 1. BRAND HEADER --- */}
      <div className="relative pt-20 pb-10 px-12 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://wallpapers.com/images/hd/dark-abstract-background-uw711915995572o7.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        
        <div className="relative z-10 flex items-end justify-between max-w-[1800px] mx-auto">
          <div>
             <div className="flex items-center gap-3 mb-2 opacity-0 animate-in slide-in-from-left-4 duration-1000 delay-300">
                <div className="bg-white text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
                  Studio Collection
                </div>
                <div className="flex text-yellow-500 gap-1">
                  <Star size={10} fill="currentColor"/>
                  <Star size={10} fill="currentColor"/>
                  <Star size={10} fill="currentColor"/>
                  <Star size={10} fill="currentColor"/>
                  <Star size={10} fill="currentColor"/>
                </div>
             </div>
             <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-600 uppercase italic leading-[0.85]">
                GIMG<br/>
                <span className="text-stroke-white text-white/5">ORIGINALS</span>
             </h1>
          </div>
          <div className="hidden md:block text-right max-w-sm">
             <p className="text-neutral-400 text-sm font-medium leading-relaxed">
               Una colección curada de historias extraordinarias. 
               Producidas exclusivamente por GIMG Studios para VISTA.
             </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1800px] mx-auto -mt-10 relative z-20">
        
        {/* --- 2. SPOTLIGHT --- */}
        {featured && (
          <div 
            onClick={() => onSelectMovie(featured)}
            className="group relative w-full aspect-[21/9] md:aspect-[2.4/1] bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-700"
          >
            <img 
              src={featured.banner_url || featured.poster_url} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
              alt="Featured"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl flex flex-col gap-6">
               <div className="flex items-center gap-3">
                 <span className="bg-blue-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-blue-600/20">
                    Estreno Mundial
                 </span>
                 <span className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award size={14} className="text-yellow-500"/> Selección Oficial
                 </span>
               </div>
               
               <h2 className="text-5xl md:text-7xl font-black italic text-white leading-none drop-shadow-2xl">
                 {featured.titulo}
               </h2>
               
               <p className="text-lg text-neutral-300 line-clamp-2 font-medium max-w-xl">
                 {featured.descripcion}
               </p>

               <div className="flex items-center gap-4 mt-2">
                  <button className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform">
                    <Play fill="black" size={20}/> REPRODUCIR AHORA
                  </button>
                  <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                    VER DETALLES
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- 3. THE COLLECTION --- */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3">
               <Zap className="text-yellow-500" fill="currentColor"/> Catálogo Exclusivo
             </h3>
             <span className="text-neutral-500 text-xs font-mono uppercase tracking-widest">
               {originals.length} Títulos Disponibles
             </span>
          </div>

          {originals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {originals.map((movie, index) => (
                <div 
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="group relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute -left-4 -bottom-8 text-[120px] font-black text-white/5 z-0 group-hover:text-white/10 transition-colors italic leading-none select-none">
                    {index + 1}
                  </div>

                  <img 
                    src={movie.banner_url || movie.poster_url} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-10"
                    alt={movie.titulo}
                  />
                  
                  {/* Overlay Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                     <PlayCircle size={48} className="text-white scale-50 group-hover:scale-100 transition-transform duration-300 delay-100"/>
                     <div className="text-center">
                        <p className="text-white font-bold text-lg tracking-tight">{movie.titulo}</p>
                        <p className="text-neutral-400 text-xs mt-1">{movie.año} • {movie.generos?.[0]}</p>
                     </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent z-20 group-hover:opacity-0 transition-opacity">
                     <p className="text-white font-bold text-xl drop-shadow-md">{movie.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
               <p className="text-neutral-500 font-medium">Más producciones originales llegarán pronto.</p>
            </div>
          )}
        </div>

      </div>

      <div className="mt-40 text-center opacity-30">
         <div className="w-16 h-1 bg-white mx-auto mb-6 rounded-full"></div>
         <p className="text-xs font-black tracking-[0.5em] text-white uppercase">GIMG Studios</p>
      </div>

    </div>
  );
};

export default Originals;