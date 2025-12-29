import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth(); // Usamos la función login del contexto
  const [formData, setFormData] = useState({ gbaId: '', pin: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Intentamos iniciar sesión
    const result = await login(formData.gbaId, formData.pin);
    
    if (!result.success) {
      setError(result.message || 'Credenciales incorrectas');
      setLoading(false);
    }
    // Si es exitoso, el AuthContext actualizará el estado 'user' y App.jsx cambiará de vista automáticamente.
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo Animado Sutil */}
      <div className="absolute inset-0 bg-[url('https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg')] bg-cover bg-center opacity-20 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-white/20">
             <span className="font-black text-4xl text-black italic tracking-tighter">V</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">GBA ID</h1>
          <p className="text-neutral-500 text-sm">Ingresa tus credenciales de acceso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Usuario */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Usuario</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={20} />
              <input 
                name="gbaId"
                type="text" 
                placeholder="Ej. stv"
                value={formData.gbaId}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium placeholder-neutral-600"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Input PIN */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">PIN de Seguridad</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={20} />
              <input 
                name="pin"
                type="password" 
                placeholder="••••"
                maxLength={4} // Asumiendo PIN de 4 dígitos
                value={formData.pin}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all font-mono tracking-widest text-lg placeholder-neutral-600"
                required
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-200 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Botón Entrar */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-200 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                INICIAR SESIÓN <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 text-xs">
            ¿Olvidaste tu PIN? Contacta a administración.
          </p>
        </div>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-neutral-700 text-[10px] font-mono uppercase tracking-widest">
        GBA VISTA System Secure Access
      </div>

    </div>
  );
};

export default Login;