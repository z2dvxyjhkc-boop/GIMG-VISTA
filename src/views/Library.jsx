import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, Trash2 } from 'lucide-react';

const Library = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) return;

      // 1. Buscamos en la tabla correcta 'biblioteca'
      const { data, error } = await supabase
        .from('biblioteca')
        .select('video_data') // Solo nos interesa la columna con el JSON de la peli
        .eq('usuario', user.nombre); // ✅ IMPORTANTE: Buscamos por tu nombre de usuario ('stv')

      if (error) {
        console.error("Error al cargar biblioteca:", error);
      }

      if (data) {
        // 2. Extraemos los datos limpios (el JSON guardado)
        // data es: [{ video_data: {titulo: "...", ...} }, { video_data: {...} }]
        // Lo convertimos a: [{titulo: "...", ...}, {...}]
        const cleanMovies = data.map(item => item.video_data);
        setLibrary(cleanMovies);
      }
      setLoading(false);
    };

    fetchLibrary();
  }, [user]);

  // Función auxiliar para borrar desde la vista de biblioteca (opcional pero útil)
  const removeFromLibrary = async (movieId) => {
    const { error } = await supabase
      .from('biblioteca')
      .delete()
      .eq('usuario', user.nombre)
      .eq('video_id', movieId);

    if (!error) {
      setLibrary(prev => prev.filter(movie => movie.id !== movieId));
    }
  };

  if (loading) return <div className="p-20 text-neutral-500 animate-pulse font-bold text-center">Cargando tu colección...</div>;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
      <h1 className="text-6xl font-black italic tracking-tighter mb-2 text-white">MI BIBLIOTECA</h1>
      <p className="text-neutral-500 uppercase tracking-widest font-black text-xs mb-10">
        Colección Personal de {user?.nombre}
      </p>

      {library.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {library.map((movie) => (
            <div key={movie.id} className="group relative aspect-[2/3] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/5 hover:border-white/20 transition-all">
              
              <img 
                src={movie.poster_url || movie.banner_url} 
                alt={movie.titulo}
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 group-hover:opacity-100"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              {/* Info y Botón de Borrar rápido */}
              <div className="absolute bottom-0 p-4 w-full">
                <p className="text-white font-bold text-sm line-clamp-1">{movie.titulo}</p>
                <div className="flex justify-between items-end mt-1">
                   <p className="text-neutral-400 text-[10px] uppercase tracking-wider">{movie.categoria}</p>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation(); // Evita que se abra el modal si hubiera click en la tarjeta
                       removeFromLibrary(movie.id);
                     }}
                     className="text-neutral-500 hover:text-red-500 transition-colors"
                     title="Quitar de mi lista"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 border border-white/10 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-neutral-500">
          <PlayCircle size={48} className="mb-4 opacity-50" />
          <p className="font-bold text-xl">Tu biblioteca está vacía.</p>
          <p className="text-sm mt-2 opacity-60">Usa el botón (+) en las películas para guardarlas aquí.</p>
        </div>
      )}
    </div>
  );
};

export default Library;