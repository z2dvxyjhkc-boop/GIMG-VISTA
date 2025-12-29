import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useLibrary = (movie) => {
  const { user } = useAuth();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Función para verificar el estado en la base de datos
  // Usamos 'useCallback' para que esta función sea estable y reutilizable
  const checkStatus = useCallback(async () => {
    if (!user || !movie) return;
    
    const { data } = await supabase
      .from('biblioteca')
      .select('id') // Solo traemos el ID para ser rápidos
      .eq('usuario', user.nombre)
      .eq('video_id', movie.id)
      .maybeSingle(); // maybeSingle evita errores si no existe
    
    setIsInLibrary(!!data); // Si hay datos es true, si es null es false
  }, [user, movie]);

  // 2. Efecto Principal: Carga inicial + "OÍDO" GLOBAL
  useEffect(() => {
    checkStatus(); // Revisar al cargar

    // --- LA MAGIA DE SINCRONIZACIÓN ---
    // Creamos una función que vuelve a revisar el estado
    const handleGlobalUpdate = () => {
      checkStatus();
    };

    // Nos suscribimos al evento "gba-library-change"
    // Esto hace que si guardas en Detalles, el Hero escuche este evento y se actualice.
    window.addEventListener('gba-library-change', handleGlobalUpdate);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('gba-library-change', handleGlobalUpdate);
    };
  }, [checkStatus]);

  // 3. Función para Guardar / Borrar
  const toggleLibrary = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (isInLibrary) {
        // --- BORRAR ---
        await supabase
          .from('biblioteca')
          .delete()
          .eq('usuario', user.nombre)
          .eq('video_id', movie.id);
      } else {
        // --- GUARDAR ---
        await supabase
          .from('biblioteca')
          .insert([{ 
            usuario: user.nombre, 
            video_id: movie.id,
            video_data: movie 
          }]);
      }

      // 🔥 IMPORTANTE: Avisamos a toda la app que hubo un cambio
      // Esto disparará el 'handleGlobalUpdate' en el Hero (y en cualquier otro lugar)
      window.dispatchEvent(new Event('gba-library-change'));
      
      // Actualizamos inmediatamente el estado local para que se sienta rápido
      setIsInLibrary(!isInLibrary);

    } catch (error) {
      console.error("Error al actualizar biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isInLibrary, toggleLibrary, loading };
};