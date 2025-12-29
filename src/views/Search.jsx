import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search as SearchIcon, X, Film } from 'lucide-react';

const Search = ({ onSelectMovie }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Búsqueda en tiempo real (con un pequeño delay para no saturar)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        
        // Buscamos coincidencias en Título y Categoría (ilike es "case insensitive")
        const { data, error } = await supabase
          .from('contenido')
          .select('*')
          .ilike('titulo', `%${query}%`)
          .order('created_at', { ascending: false })
          .limit(20);

        if (data) setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500); // Espera 500ms después de que dejas de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="min-h-screen pt-4 px-4 pb-20">
      
      {/* Barra de Búsqueda */}
      <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-50 py-4 mb-8 border-b border-white/5">
        <div className="max-w-3xl mx-auto relative group">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Películas, series, géneros..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-5 pl-14 pr-12 text-xl text-white placeholder-neutral-600 outline-none focus:bg-neutral-800 focus:border-white/30 transition-all font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
         <div className="text-center py-20 text-neutral-600 animate-pulse font-bold">Buscando en la base de datos...</div>
      ) : results.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in slide-in-from-bottom-4">
          {results.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => onSelectMovie(movie)}
              className="group cursor-pointer"
            >
              <div className="aspect-[2/3] bg-neutral-800 rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-white/30 transition-all relative">
                <img 
                  src={movie.poster_url || movie.banner_url} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  alt={movie.titulo}
                />
                {/* Badge HD */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  HD
                </div>
              </div>
              <h3 className="font-bold text-sm text-neutral-300 group-hover:text-white transition-colors line-clamp-1">{movie.titulo}</h3>
              <p className="text-xs text-neutral-500">{movie.año} • {movie.categoria}</p>
            </div>
          ))}
        </div>
      ) : query.length > 1 ? (
        <div className="text-center py-20 opacity-40">
           <Film size={48} className="mx-auto mb-4"/>
           <p className="text-xl font-bold">No encontramos "{query}"</p>
           <p className="text-sm mt-2">Intenta con otro título.</p>
        </div>
      ) : (
        // Estado vacío (Sugerencias)
        <div className="text-center py-32 opacity-30 select-none">
           <p className="text-4xl font-black tracking-tighter mb-4 text-neutral-600">¿QUÉ VEMOS HOY?</p>
           <p className="text-sm">Escribe el nombre de tu película favorita.</p>
        </div>
      )}

    </div>
  );
};

export default Search;