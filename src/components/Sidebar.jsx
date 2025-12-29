import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Tv, 
  Search, 
  Library, 
  ShieldAlert, 
  Settings, 
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, isDueño, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);

  // Cerrar menú si clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: <Home size={22} /> },
    { id: 'originals', label: 'Originals', icon: <Tv size={22} /> }, // ✅ AÑADIDO: Originals
    { id: 'news', label: 'Noticias', icon: <Radio size={22} /> },
    { id: 'search', label: 'Buscar', icon: <Search size={22} /> },
    { id: 'library', label: 'Biblioteca', icon: <Library size={22} /> },
  ];

  return (
    <div 
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen w-24 hover:w-64 flex flex-col bg-black/40 backdrop-blur-3xl border-r border-white/10 z-[900] transition-all duration-500 group overflow-visible"
    >
      
      {/* LOGO VISTA */}
      <div className="p-8 mb-4 flex items-center gap-4">
        <div className="min-w-[40px] h-[40px] bg-gradient-to-tr from-white to-neutral-400 rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
          <span className="text-black font-black text-xl italic">V</span>
        </div>
        <span className="text-xl font-extrabold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
          VISTA
        </span>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setShowMenu(false);
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-white text-black shadow-xl' 
              : 'text-neutral-500 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="min-w-[24px]">{item.icon}</div>
            <span className="font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}

        {isDueño && (
          <div className="pt-8 mt-8 border-t border-white/5">
            <p className="px-4 mb-2 text-[10px] font-black text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Admin Systems
            </p>
            <button
              onClick={() => setActiveTab('mothership')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'mothership' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                : 'text-red-500/50 hover:bg-red-500/10 hover:text-red-500'
              }`}
            >
              <div className="min-w-[24px]"><ShieldAlert size={22} /></div>
              <span className="font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                MOTHERSHIP
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* PERFIL */}
      <div className="relative p-4 border-t border-white/5 bg-white/5 mt-auto">
        
        {showMenu && (
          <div 
            ref={menuRef}
            className="absolute left-full bottom-4 ml-4 w-72 bg-[#f5f5f7] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-left-4 duration-300 z-[1000] text-black border border-white/20"
          >
            {/* Header del Menú */}
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-300 mb-2">
              <div className="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600">
                {user?.nombre?.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-bold text-sm truncate">{user?.nombre}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.id ? `GBA ID: ${String(user.id)}` : ''}</p>
                
                {/* ✅ AÑADIDO: Saldo Real */}
                <p className="text-xs font-bold text-green-600 mt-1">
                  Saldo: ${Number(user?.saldo || 0).toFixed(2)}
                </p>

              </div>
              <button 
                onClick={() => {
                  setActiveTab('settings');
                  setShowMenu(false);
                }}
                className="p-2 hover:bg-neutral-300 rounded-full transition-colors"
                title="Configuración"
              >
                <Settings size={18} className="text-neutral-600" />
              </button>
            </div>

            <div className="space-y-1">
               <button className="w-full text-left text-xs font-medium px-2 py-2 hover:bg-white rounded-lg transition-colors text-neutral-700">Ver cuenta</button>
               <div className="h-px bg-neutral-300 my-1" />
               <button onClick={logout} className="w-full text-left text-xs font-bold px-2 py-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors">Cerrar sesión</button>
            </div>

            <div className="absolute top-[80%] -left-2 w-4 h-4 bg-[#f5f5f7] rotate-45 border-b border-l border-transparent"></div>
          </div>
        )}

        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
        >
          <img 
            src={user?.avatar || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user?.nombre}`} 
            className="w-10 h-10 rounded-full border border-white/20 object-cover min-w-[40px]"
            alt="User"
          />
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden whitespace-nowrap">
            <span className="text-xs font-bold truncate text-white">{user?.nombre || 'Invitado'}</span>
            <span className="text-[10px] text-neutral-500 uppercase font-black tracking-tighter">
              {user?.nacion || 'GBA System'}
            </span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default Sidebar;