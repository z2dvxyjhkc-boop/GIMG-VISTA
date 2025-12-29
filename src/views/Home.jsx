import React, { useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent';
import { useLibrary } from '../hooks/useLibrary';
import ContentRow from '../components/ContentRow';
import { Play, Plus, Check, Info } from 'lucide-react';

// --- HERO SECTION ---
const HeroSection = ({ movie, onPlay, onSelectMovie }) => {
  const { isInLibrary, toggleLibrary, loading } = useLibrary(movie);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(false);
    const timer = setTimeout(() => setShowVideo(true), 3000); 
    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return null;

  return (
    // ✅ CAMBIO: Quitamos los márgenes negativos (-mt, -ml) y el calc().
    // Ahora es w-full y h-[85vh] nativo.
    <div className="relative w-full h-[90vh] overflow-hidden mb-8 group bg-[#0a0a0a] shadow-2xl">
      
      {/* Imagen Fondo */}
      <img src={movie.banner_url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`} alt="Hero" />
      
      {/* Video Fondo */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
         <div className="w-full h-full pointer-events-none scale-[1.35]"> 
            <iframe className="w-full h-full object-cover" src={`https://www.youtube.com/embed/${movie.youtube_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.youtube_id}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1`} title="Hero" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
         </div>
      </div>

      {/* Degradados */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none" />
      
      {/* Info del Hero */}
      <div className="absolute bottom-24 left-16 max-w-3xl pointer-events-auto z-20 animate-in slide-in-from-bottom-10 fade-in duration-1000">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-4 inline-block text-white border border-white/20">N.º 1 en VISTA hoy</span>
        <h1 className="text-7xl font-black italic tracking-tighter mb-4 uppercase text-white drop-shadow-2xl cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelectMovie(movie)}>{movie.titulo}</h1>
        <p className="text-xl text-neutral-200 mb-8 line-clamp-2 font-medium drop-shadow-md max-w-2xl">{movie.descripcion}</p>
        <div className="flex gap-4">
          <button onClick={() => onPlay(movie.youtube_id)} className="bg-white text-black px-10 py-5 rounded-xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"><Play fill="black" size={24} /> REPRODUCIR</button>
          <button onClick={toggleLibrary} disabled={loading} className={`backdrop-blur-xl border p-5 rounded-xl transition-all ${isInLibrary ? 'bg-green-500 text-white border-green-400 hover:bg-green-600' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>{isInLibrary ? <Check size={24} /> : <Plus size={24} />}</button>
          <button onClick={() => onSelectMovie(movie)} className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-xl hover:bg-white/20 transition-all text-white"><Info size={24} /></button>
        </div>
      </div>
    </div>
  );
};

// --- HOME PRINCIPAL ---
const Home = ({ onSelectMovie, onPlay }) => {
  const { getAllContent, getTop10, loading } = useContent();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [top10, setTop10] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const all = await getAllContent();
      const top = await getTop10();
      setTop10(top);
      
      const heroContent = all.filter(m => m.en_hero === true);
      setFeaturedMovies(heroContent.length > 0 ? heroContent : (top.length > 0 ? top.slice(0, 5) : all.slice(0, 5)));

      const groups = {};
      all.forEach(movie => {
        if (movie.generos && movie.generos.length > 0) {
          movie.generos.forEach(genero => {
            if (!groups[genero]) groups[genero] = [];
            groups[genero].push(movie);
          });
        } else {
          if (!groups['General']) groups['General'] = [];
          groups['General'].push(movie);
        }
      });
      setMoviesByGenre(groups);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length), 12000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  if (loading) return <div className="p-20 text-neutral-500 animate-pulse font-bold text-center">Cargando VISTA...</div>;

  return (
    <div className="animate-in fade-in duration-1000 pb-20">
      
      {/* 1. HERO ROTATIVO */}
      {featuredMovies.length > 0 && (
        <HeroSection key={featuredMovies[currentIndex].id} movie={featuredMovies[currentIndex]} onPlay={onPlay} onSelectMovie={onSelectMovie} />
      )}

      {/* Puntos Carrusel */}
      <div className="flex justify-center gap-2 -mt-20 mb-10 relative z-30">
        {featuredMovies.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* 2. CONTENIDO (Con Padding lateral) */}
      <div className="px-12 space-y-12"> 
        {top10.length > 0 && (
          <ContentRow title="Top 10: Lo más visto en GIMG" items={top10} onSelect={onSelectMovie} />
        )}

        {Object.entries(moviesByGenre).map(([genero, peliculas]) => (
          peliculas.length > 0 && (
            <ContentRow key={genero} title={genero} items={peliculas} onSelect={onSelectMovie} />
          )
        ))}
      </div>

    </div>
  );
};

export default Home;