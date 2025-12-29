import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('gba_user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Función de Login con Minecraft ID + PIN
  const login = async (nombre, pin) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('nombre', nombre)
        .eq('pin', pin)
        .maybeSingle(); // Evita errores si no hay coincidencia

      if (error) throw error;

      if (data) {
        const userData = {
          id: data.id,
          nombre: data.nombre,
          rol: data.rol,
          nacion: data.nacion || 'Global',
          avatar: `https://minotar.net/helm/${encodeURIComponent(data.nombre)}/100.png`
        };
        
        setUser(userData);
        localStorage.setItem('gba_user_data', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: "Usuario o PIN incorrectos." };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gba_user_data');
    location.reload(); // Refresca para limpiar estados
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isDueño: user?.rol === 'Dueño' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);