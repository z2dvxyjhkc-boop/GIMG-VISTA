import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, ZoomIn, Calendar } from 'lucide-react';

const GlobalInsight = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null); // Para el modal de lectura
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      // Traemos las noticias ordenadas por fecha (la más nueva primero)
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Cargando ediciones...</div>;

  return (
    <div className="min-h-screen text-white pb-20">
      
      {/* Header Estilo Periódico */}
      <div className="mb-12 text-center border-b border-white/10 pb-8">
        <h1 className="text-6xl font-black font-serif tracking-tighter uppercase mb-2">Global Insight</h1>
        <div className="flex justify-center items-center gap-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>The VISTA Official Press</span>
          <span>•</span>
          <span>Edición Digital</span>
          <span>•</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Grid de Ediciones */}
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {news.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedNews(item)}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Contenedor con efecto de elevación */}
              <div className="relative aspect-[3/4] bg-neutral-800 rounded-sm overflow-hidden shadow-xl group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 border-4 border-white/5">
                <img 
                  src={item.imagen_url} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  alt="Cover"
                />
                
                {/* Overlay "Leer" */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn size={18}/> LEER
                  </div>
                </div>
              </div>

              {/* Info Pie */}
              <div className="text-center">
                 <h3 className="font-bold text-lg font-serif">{item.titulo || 'Edición Especial'}</h3>
                 <p className="text-xs text-neutral-500 flex items-center justify-center gap-1 mt-1">
                    <Calendar size={10}/>
                    {new Date(item.created_at).toLocaleDateString('es-MX', { dateStyle: 'long' })}
                 </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-50">
          <p className="text-xl font-serif italic">No hay ediciones publicadas.</p>
        </div>
      )}

      {/* MODAL DE LECTURA (Zoom) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300" onClick={() => setSelectedNews(null)}>
          
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>

          {/* Imagen Full Size */}
          <img 
            src={selectedNews.imagen_url} 
            className="h-full w-auto max-w-full object-contain rounded shadow-2xl" 
            onClick={(e) => e.stopPropagation()} // Para que no se cierre si das clic a la imagen
            alt="Lectura"
          />
          
        </div>
      )}

    </div>
  );
};

export default GlobalInsight;