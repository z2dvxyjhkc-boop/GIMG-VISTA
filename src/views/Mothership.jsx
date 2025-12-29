import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Youtube, Star, Trash2, Edit3, Monitor, RefreshCw, PlusCircle, X, Film, Newspaper, Image as ImageIcon } from 'lucide-react';

const Mothership = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [newsList, setNewsList] = useState([]); // Lista de noticias
  const [editingId, setEditingId] = useState(null);
  
  // ✅ NUEVO: Control de Pestañas (Contenido vs Noticias)
  const [activeSection, setActiveSection] = useState('content'); 

  // Estado del Reparto
  const [castList, setCastList] = useState([]); 

  // --- FORMULARIOS ---
  const initialFormContent = {
    titulo: '',
    descripcion: '',
    youtube_id: '',
    trailer_id: '',
    categoria: 'PELICULA',
    año: new Date().getFullYear().toString(),
    duracion: '1h 30m',
    calificacion: 'B15',
    generos: '',
    banner_url: '',
    poster_url: '',
    es_top_10: false,
    en_hero: false
  };

  const initialFormNews = {
    titulo: '',
    imagen_url: ''
  };

  const [formData, setFormData] = useState(initialFormContent);
  const [formNews, setFormNews] = useState(initialFormNews);

  // --- CARGA DE DATOS ---
  useEffect(() => { 
    if (activeSection === 'content') fetchContent();
    if (activeSection === 'news') fetchNews();
  }, [activeSection]);

  const fetchContent = async () => {
    const { data } = await supabase.from('contenido').select('*, reparto(*)').order('created_at', { ascending: false });
    if (data) setContentList(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase.from('noticias').select('*').order('created_at', { ascending: false });
    if (data) setNewsList(data);
  };

  // --- HANDLERS CONTENIDO ---
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Gestión de Reparto
  const addActor = () => setCastList([...castList, { id: Date.now(), nombre_real: '', nombre_personaje: '', foto_url: '' }]);
  const updateActor = (id, field, value) => setCastList(castList.map(actor => actor.id === id ? { ...actor, [field]: value } : actor));
  const removeActor = (id) => setCastList(castList.filter(actor => actor.id !== id));

  // Editar Contenido
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      titulo: item.titulo,
      descripcion: item.descripcion,
      youtube_id: item.youtube_id || '', // Puede estar vacío
      trailer_id: item.trailer_id || '',
      categoria: item.categoria,
      año: item.año || '',
      duracion: item.duracion || '',
      calificacion: item.calificacion || '',
      generos: item.generos ? item.generos.join(', ') : '',
      banner_url: item.banner_url || '',
      poster_url: item.poster_url || '',
      es_top_10: item.es_top_10 || false,
      en_hero: item.en_hero || false
    });
    setCastList(item.reparto || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus({ type: 'info', msg: `Editando: ${item.titulo}` });
  };

  // --- HANDLERS NOTICIAS (GLOBAL INSIGHT) ---
  const handleNewsChange = (e) => {
    setFormNews({ ...formNews, [e.target.name]: e.target.value });
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { error } = await supabase.from('noticias').insert([formNews]);
        if (error) throw error;
        setStatus({ type: 'success', msg: '¡Noticia publicada!' });
        setFormNews(initialFormNews);
        fetchNews();
    } catch (error) {
        setStatus({ type: 'error', msg: 'Error al subir noticia' });
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("¿Borrar esta noticia?")) return;
    await supabase.from('noticias').delete().eq('id', id);
    fetchNews();
  };

  // --- GUARDAR CONTENIDO (PRINCIPAL) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ✅ LÓGICA INTELIGENTE DE IMAGEN: Si no hay youtube_id, intenta usar el trailer_id para la miniatura
      const idForImage = formData.youtube_id || formData.trailer_id;
      const defaultBanner = idForImage ? `https://img.youtube.com/vi/${idForImage}/maxresdefault.jpg` : '';
      
      const finalBanner = formData.banner_url || defaultBanner;
      
      const generosArray = formData.generos.split(',').map(g => g.trim()).filter(g => g !== '');

      const contentData = {
        ...formData,
        banner_url: finalBanner,
        poster_url: formData.poster_url || finalBanner,
        generos: generosArray 
      };

      let contentId = editingId;

      if (editingId) {
        const { error } = await supabase.from('contenido').update(contentData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('contenido').insert([contentData]).select().single();
        if (error) throw error;
        contentId = data.id;
      }

      // Guardar Reparto
      if (contentId) {
         await supabase.from('reparto').delete().eq('contenido_id', contentId);
         if (castList.length > 0) {
            const castToInsert = castList.map(actor => ({
               contenido_id: contentId,
               nombre_real: actor.nombre_real,
               nombre_personaje: actor.nombre_personaje,
               foto_url: actor.foto_url
            }));
            await supabase.from('reparto').insert(castToInsert);
         }
      }

      setStatus({ type: 'success', msg: '¡Guardado correctamente!' });
      fetchContent();
      if (!editingId) {
        setEditingId(null);
        setFormData(initialFormContent);
        setCastList([]);
      }
      
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Error al guardar. Revisa la consola.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Borrar definitivamente?")) return;
    await supabase.from('reparto').delete().eq('contenido_id', id);
    const { error } = await supabase.from('contenido').delete().eq('id', id);
    if (!error) {
      fetchContent();
      if (editingId === id) {
          setEditingId(null);
          setFormData(initialFormContent);
          setCastList([]);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormContent);
    setCastList([]);
    setStatus(null);
  };

  return (
    <div className="animate-in zoom-in-95 duration-500 pb-40">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Monitor className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">Mothership</h1>
            <p className="text-red-500 font-bold tracking-widest text-xs uppercase">Panel de Control v4.0</p>
          </div>
        </div>

        {/* ✅ SELECTOR DE SECCIÓN */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
                onClick={() => setActiveSection('content')}
                className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeSection === 'content' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
                <Film size={16}/> Películas
            </button>
            <button 
                onClick={() => setActiveSection('news')}
                className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeSection === 'news' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
                <Newspaper size={16}/> Global Insight
            </button>
        </div>
      </div>

      {/* ---------------- SECCIÓN PELÍCULAS ---------------- */}
      {activeSection === 'content' && (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* EDITOR */}
        <div className="xl:col-span-1">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl sticky top-32">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {editingId ? <><Edit3 className="text-yellow-500"/> Editando</> : <><PlusCircle className="text-green-500"/> Nuevo</>}
              </h2>
              {editingId && <button onClick={resetForm} className="text-xs bg-white/10 px-3 py-1 rounded-full"><X size={12}/> Cancelar</button>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Info Básica */}
              <div className="space-y-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">General</p>
                <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" className="w-full bg-transparent border-b border-white/10 p-2 font-bold outline-none focus:border-red-500" required />
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Sinopsis..." rows="2" className="w-full bg-transparent border-b border-white/10 p-2 text-sm resize-none outline-none focus:border-red-500" />
                <div className="grid grid-cols-2 gap-3">
                   <select name="categoria" value={formData.categoria} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-sm [&>option]:bg-black outline-none focus:border-red-500">
                    <option value="PELICULA">Película</option>
                    <option value="SERIE">Serie</option>
                    <option value="ORIGINAL">GIMG Original</option>
                  </select>
                  <input name="generos" value={formData.generos} onChange={handleChange} placeholder="Acción, Drama..." className="bg-transparent border-b border-white/10 p-2 text-sm outline-none focus:border-red-500" />
                </div>
              </div>

              {/* Multimedia */}
              <div className="space-y-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">IDs y Media</p>
                <div className="grid grid-cols-2 gap-3">
                    {/* ✅ SIN REQUIRED: Ahora puedes dejarlo vacío para "Coming Soon" */}
                    <input name="youtube_id" value={formData.youtube_id} onChange={handleChange} placeholder="YT Película" className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-sm outline-none focus:border-red-500" />
                    <input name="trailer_id" value={formData.trailer_id} onChange={handleChange} placeholder="YT Trailer" className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-sm outline-none focus:border-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input name="banner_url" value={formData.banner_url} onChange={handleChange} placeholder="Banner URL" className="bg-transparent border-b border-white/10 p-2 text-xs outline-none focus:border-red-500" />
                  <input name="poster_url" value={formData.poster_url} onChange={handleChange} placeholder="Poster URL" className="bg-transparent border-b border-white/10 p-2 text-xs outline-none focus:border-red-500" />
                </div>
              </div>

              {/* Datos Técnicos */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                  <input name="año" value={formData.año} onChange={handleChange} placeholder="Año" className="bg-transparent border-b border-white/10 p-2 text-center text-sm outline-none focus:border-red-500" />
                  <input name="duracion" value={formData.duracion} onChange={handleChange} placeholder="1h 30m" className="bg-transparent border-b border-white/10 p-2 text-center text-sm outline-none focus:border-red-500" />
                  <input name="calificacion" value={formData.calificacion} onChange={handleChange} placeholder="B15" className="bg-transparent border-b border-white/10 p-2 text-center text-sm outline-none focus:border-red-500" />
              </div>

              {/* Reparto */}
              <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Reparto ({castList.length})</p>
                  <button type="button" onClick={addActor} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1"><PlusCircle size={10}/> Añadir</button>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {castList.map((actor) => (
                    <div key={actor.id} className="flex gap-2 items-start bg-white/5 p-2 rounded-lg">
                      <div className="w-8 h-8 bg-neutral-700 rounded-full overflow-hidden flex-shrink-0">
                         {actor.foto_url && <img src={actor.foto_url} className="w-full h-full object-cover"/>}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input placeholder="Nombre Real" value={actor.nombre_real} onChange={(e) => updateActor(actor.id, 'nombre_real', e.target.value)} className="w-full bg-transparent border-b border-white/5 text-xs font-bold outline-none placeholder-neutral-600"/>
                        <input placeholder="Personaje" value={actor.nombre_personaje} onChange={(e) => updateActor(actor.id, 'nombre_personaje', e.target.value)} className="w-full bg-transparent border-b border-white/5 text-[10px] text-neutral-400 outline-none placeholder-neutral-600"/>
                        <input placeholder="URL Foto" value={actor.foto_url} onChange={(e) => updateActor(actor.id, 'foto_url', e.target.value)} className="w-full bg-transparent border-b border-white/5 text-[10px] text-blue-400 outline-none placeholder-neutral-600"/>
                      </div>
                      <button type="button" onClick={() => removeActor(actor.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><X size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer ${formData.en_hero ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'}`}>
                   <input type="checkbox" name="en_hero" checked={formData.en_hero} onChange={handleChange} className="hidden" />
                   <span className="text-[10px] font-black uppercase">En Hero</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer ${formData.es_top_10 ? 'bg-yellow-600 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
                   <input type="checkbox" name="es_top_10" checked={formData.es_top_10} onChange={handleChange} className="hidden" />
                   <span className="text-[10px] font-black uppercase">Top 10</span>
                </label>
              </div>

              {status && <div className={`p-2 rounded text-xs text-center font-bold ${status.type === 'error' ? 'text-red-300 bg-red-900/20' : 'text-green-300 bg-green-900/20'}`}>{status.msg}</div>}

              <button type="submit" disabled={loading} className={`w-full py-3 font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-yellow-500 text-black' : 'bg-white text-black'}`}>
                <Save size={18}/> {editingId ? 'Guardar Cambios' : 'Publicar'}
              </button>

            </form>
          </div>
        </div>

        {/* LISTA DE CONTENIDO */}
        <div className="xl:col-span-2">
           <h2 className="text-2xl font-bold mb-6 text-neutral-500">Catálogo Global</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentList.map((item) => (
              <div key={item.id} className="flex gap-4 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl hover:border-white/30 transition-all">
                <div className="w-20 h-28 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.poster_url || item.banner_url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white line-clamp-1">{item.titulo}</h3>
                    {item.en_hero && <span className="text-[8px] bg-blue-600 px-1 rounded uppercase font-bold">Hero</span>}
                  </div>
                  <p className="text-neutral-500 text-xs mt-1 line-clamp-1">{item.generos && item.generos.length > 0 ? item.generos.join(', ') : 'Sin género'}</p>
                  <p className="text-neutral-600 text-[10px] mt-2">
                    {item.youtube_id ? '✅ Disponible' : '🕒 Próximamente'}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(item)} className="bg-white/10 hover:bg-white text-white hover:text-black px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1"><Edit3 size={12}/> Editar</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-all"><Trash2 size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
           </div>
        </div>
      </div>
      )}

      {/* ---------------- SECCIÓN GLOBAL INSIGHT (NOTICIAS) ---------------- */}
      {activeSection === 'news' && (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* EDITOR NOTICIAS */}
          <div className="xl:col-span-1">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl sticky top-32">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                    <Newspaper className="text-blue-500"/> Nueva Noticia
                </h2>
                <form onSubmit={handleSaveNews} className="space-y-4">
                    <div className="space-y-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Imagen del Periódico</p>
                        <input name="titulo" value={formNews.titulo} onChange={handleNewsChange} placeholder="Título o Fecha (Opcional)" className="w-full bg-transparent border-b border-white/10 p-2 font-bold outline-none focus:border-blue-500" />
                        <div className="flex items-center gap-2">
                            <ImageIcon size={18} className="text-neutral-500"/>
                            <input name="imagen_url" value={formNews.imagen_url} onChange={handleNewsChange} placeholder="URL de la Imagen" className="w-full bg-transparent border-b border-white/10 p-2 text-sm outline-none focus:border-blue-500" required />
                        </div>
                    </div>
                    
                    {/* Previsualización */}
                    {formNews.imagen_url && (
                        <div className="w-full h-40 bg-black/40 rounded-xl overflow-hidden border border-white/10">
                            <img src={formNews.imagen_url} className="w-full h-full object-cover" alt="Preview"/>
                        </div>
                    )}

                    {status && <div className={`p-2 rounded text-xs text-center font-bold ${status.type === 'error' ? 'text-red-300 bg-red-900/20' : 'text-green-300 bg-green-900/20'}`}>{status.msg}</div>}

                    <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black font-black uppercase rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
                        <Save size={18}/> Publicar Noticia
                    </button>
                </form>
              </div>
          </div>

          {/* LISTA DE NOTICIAS */}
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-neutral-500">Ediciones Publicadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {newsList.map(news => (
                    <div key={news.id} className="group relative aspect-[3/4] bg-neutral-800 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                        <img src={news.imagen_url} className="w-full h-full object-cover" alt={news.titulo}/>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                            <button onClick={() => handleDeleteNews(news.id)} className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform">
                                <Trash2 size={20}/>
                            </button>
                        </div>
                        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
                            <p className="text-xs font-bold text-white truncate">{news.titulo || 'Sin título'}</p>
                            <p className="text-[10px] text-neutral-400">{new Date(news.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {newsList.length === 0 && <p className="text-neutral-500 col-span-3 text-center py-10">No hay noticias publicadas.</p>}
            </div>
          </div>
      </div>
      )}

    </div>
  );
};

export default Mothership;