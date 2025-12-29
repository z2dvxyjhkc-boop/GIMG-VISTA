import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importación de Componentes
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Details from './views/Details';
import Player from './components/Player';

// Importación de Vistas
import Home from './views/Home';
import GlobalInsight from './views/GlobalInsight'; // Noticias
import Library from './views/Library';
import Search from './views/Search';
import Mothership from './views/Mothership';
import Settings from './views/Settings';
import Originals from './views/Originals'; // ✅ Importamos Originals

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  
  const { loading, user, isDueño } = useAuth();

  // Pantalla de Carga Inicial
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 animate-pulse">
            GBA VISTA SYSTEM
          </p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostramos Login
  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white">
      
      {/* 1. SIDEBAR (Navegación) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. AREA PRINCIPAL */}
      <main className="flex-1 ml-24 min-h-screen relative">
        
        {/* Fondo Global */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 w-full min-h-screen">
          
          {/* --- VISTA: INICIO --- */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Home 
                onSelectMovie={setSelectedMovie} 
                onPlay={(id) => setPlayingVideo(id)} 
              />
            </div>
          )}

          {/* --- VISTA: ORIGINALS (NUEVO) --- */}
          {activeTab === 'originals' && (
             <Originals onSelectMovie={setSelectedMovie} />
          )}

          {/* --- VISTA: NOTICIAS (Global Insight) --- */}
          {activeTab === 'news' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-700 p-12">
              <GlobalInsight />
            </div>
          )}

          {/* --- VISTA: BIBLIOTECA --- */}
          {activeTab === 'library' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 p-12 pt-20">
              <Library />
            </div>
          )}

          {/* --- VISTA: BUSCAR --- */}
          {activeTab === 'search' && (
            <div className="animate-in fade-in duration-500">
              <Search onSelectMovie={setSelectedMovie} />
            </div>
          )}

          {/* --- VISTA: AJUSTES --- */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               {/* Fondo claro para ajustes */}
               <div className="absolute inset-0 bg-[#f2f2f2] z-50">
                  <Settings />
               </div>
            </div>
          )}

          {/* --- VISTA: ADMIN (Mothership) --- */}
          {activeTab === 'mothership' && isDueño && (
            <div className="animate-in zoom-in-90 duration-500 p-12">
              <Mothership />
            </div>
          )}

        </div>
      </main>

      {/* 3. MODALES Y REPRODUCTORES (Siempre encima) */}
      
      {/* Detalles de Película */}
      {selectedMovie && (
        <Details 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onPlay={(id) => setPlayingVideo(id)} 
        />
      )}

      {/* Reproductor de Video */}
      {playingVideo && (
        <Player 
          videoId={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
      
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;