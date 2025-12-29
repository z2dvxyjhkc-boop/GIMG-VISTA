import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeTab }) => {
  const { user } = useAuth(); // Obtenemos tu sesión (stv)

  // Mapeo de títulos según la pestaña activa
  const titles = {
    home: 'Inicio',
    news: 'Global Insight',
    library: 'Mi Biblioteca',
    search: 'Explorar',
    mothership: 'Mothership Control'
  };

  return (
    <header className="fixed top-0 right-0 left-24 h-24 flex items-center justify-between px-12 z-[800] bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none">
      
      {/* 1. TÍTULO DINÁMICO (Apple Style) */}
      <div className="pointer-events-auto">
        <h2 className="text-3xl font-black tracking-tighter italic animate-in slide-in-from-left-4 duration-500">
          {titles[activeTab] || 'VISTA'}
        </h2>
      </div>

      {/* 2. BARRA DE BÚSQUEDA Y USUARIO */}
      <div className="flex items-center gap-8 pointer-events-auto">
        
        {/* Buscador minimalista */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-white/5 border border-white/10 py-2.5 pl-12 pr-6 rounded-full text-sm outline-none focus:bg-white/10 focus:ring-4 ring-white/5 transition-all w-64"
          />
        </div>

        {/* Notificaciones */}
        <button className="text-neutral-400 hover:text-white transition-colors relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-black"></span>
        </button>

        {/* PERFIL: Minotar + Info */}
        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">GBA ID</p>
            <p className="text-xs font-bold text-white tracking-tight">{user?.nombre || 'Invitado'}</p>
          </div>
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/40 transition-all active:scale-90">
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=Guest"} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;