import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { usePreferences } from '../hooks/usePreferences'; // ✅ Hook conectado a DB
import { 
  Monitor, Trash2, LogOut, 
  Edit2, Check, AlertTriangle, Sparkles 
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  // ✅ Traemos las variables directas de la base de datos
  const { autoplay, toggleAutoplay, recommendations, toggleRecommendations } = usePreferences();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.nombre || '');
  const [loadingName, setLoadingName] = useState(false);

  // Función: Cambiar nombre en Supabase
  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.nombre) {
      setIsEditingName(false);
      return;
    }
    setLoadingName(true);
    
    const { error } = await supabase
      .from('usuarios')
      .update({ nombre: newName })
      .eq('id', user.id);

    if (!error) {
      window.location.reload(); 
    }
    setLoadingName(false);
    setIsEditingName(false);
  };

  // Función: Vaciar Biblioteca
  const handleClearLibrary = async () => {
    if (confirm("¿ESTÁS SEGURO? Esto borrará todas las películas de tu biblioteca.")) {
      const { error } = await supabase
        .from('biblioteca')
        .delete()
        .eq('usuario', user.nombre);
      
      if (!error) alert("Biblioteca vaciada correctamente.");
    }
  };

  const ToggleSwitch = ({ value, onClick }) => (
    <div 
      onClick={onClick}
      className={`w-12 h-7 rounded-full flex items-center p-1 cursor-pointer transition-all ${value ? 'bg-green-500' : 'bg-neutral-300'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500 min-h-screen bg-[#f2f2f2] text-black p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-20">
        <h1 className="text-4xl font-black tracking-tight mb-8">Ajustes del Sistema</h1>

        {/* 1. PERFIL */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
          <div className="p-6 flex items-center justify-between border-b border-neutral-100">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-2xl font-bold text-neutral-600">
                    {user?.nombre?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                   {isEditingName ? (
                     <div className="flex items-center gap-2">
                       <input 
                         value={newName} 
                         onChange={(e) => setNewName(e.target.value)}
                         className="bg-neutral-100 border border-neutral-300 rounded px-2 py-1 text-sm font-bold w-32 outline-none focus:border-blue-500"
                         autoFocus
                       />
                       <button onClick={handleUpdateName} disabled={loadingName} className="bg-green-500 text-white p-1 rounded hover:bg-green-600">
                         <Check size={16}/>
                       </button>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                        <p className="font-bold text-lg">{user?.nombre}</p>
                        <Edit2 size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                     </div>
                   )}
                   <p className="text-neutral-500 text-sm">GBA ID: {String(user?.id)}</p>
                </div>
             </div>
          </div>
        </div>

        {/* 2. EXPERIENCIA (Conectado a DB) */}
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 ml-2">Experiencia</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
          
          {/* Opción 1: Autoplay */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Monitor size={20} /></div>
              <div>
                <p className="font-bold text-sm">Autoplay en Inicio</p>
                <p className="text-xs text-neutral-500">Reproducir trailers automáticamente al entrar.</p>
              </div>
            </div>
            <ToggleSwitch value={autoplay} onClick={toggleAutoplay} />
          </div>

          {/* Opción 2: Recomendaciones (La columna que viste en Supabase) */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Sparkles size={20} /></div>
              <div>
                <p className="font-bold text-sm">Recomendaciones IA</p>
                <p className="text-xs text-neutral-500">Mostrar sugerencias basadas en tu actividad.</p>
              </div>
            </div>
            <ToggleSwitch value={recommendations} onClick={toggleRecommendations} />
          </div>
        </div>

        {/* 3. ZONA DE PELIGRO */}
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 ml-2">Zona de Peligro</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
          
          <button onClick={handleClearLibrary} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors border-b border-neutral-100 text-left">
             <div className="flex items-center gap-4">
               <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={20} /></div>
               <div>
                 <p className="font-bold text-sm text-red-600">Vaciar mi Biblioteca</p>
                 <p className="text-xs text-neutral-500">Elimina todas las películas guardadas permanentemente.</p>
               </div>
             </div>
             <AlertTriangle size={16} className="text-red-300" />
          </button>

          <button onClick={logout} className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 transition-colors text-left">
             <div className="flex items-center gap-4">
               <div className="p-2 bg-neutral-200 text-neutral-600 rounded-lg"><LogOut size={20} /></div>
               <div>
                 <p className="font-bold text-sm">Cerrar Sesión</p>
                 <p className="text-xs text-neutral-500">Salir de la cuenta actual.</p>
               </div>
             </div>
          </button>
        </div>
        
        {/* Info Técnica */}
        <p className="text-center text-neutral-400 text-xs mt-8 font-mono">
          Supabase Connection: Active <br/>
          User ID: {String(user?.id)} • Autoplay: {autoplay ? 'ON' : 'OFF'}
        </p>

      </div>
    </div>
  );
};

export default Settings;