import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const usePreferences = () => {
  const { user } = useAuth();
  
  // Estados iniciales
  const [autoplay, setAutoplay] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1. Cargar preferencias REALES desde tu tabla 'usuarios'
  useEffect(() => {
    if (!user) return;

    const fetchPrefs = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('autoplay, recommendations') //
        .eq('id', user.id)
        .single();

      if (data) {
        setAutoplay(data.autoplay ?? true); // Si es null, usa true por defecto
        setRecommendations(data.recommendations ?? true);
      }
      setLoading(false);
    };

    fetchPrefs();
  }, [user]);

  // 2. Guardar Autoplay en Supabase
  const toggleAutoplay = async () => {
    const newValue = !autoplay;
    setAutoplay(newValue); // Actualización instantánea (Optimista)
    
    await supabase
      .from('usuarios')
      .update({ autoplay: newValue })
      .eq('id', user.id);
  };

  // 3. Guardar Recomendaciones en Supabase
  const toggleRecommendations = async () => {
    const newValue = !recommendations;
    setRecommendations(newValue); // Actualización instantánea (Optimista)
    
    await supabase
      .from('usuarios')
      .update({ recommendations: newValue })
      .eq('id', user.id);
  };

  return { autoplay, toggleAutoplay, recommendations, toggleRecommendations, loading };
};