import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useContent = () => {
  const [loading, setLoading] = useState(true);

  // 1. Obtener todo el contenido (Inicio y Buscador)
  const getAllContent = async () => {
    setLoading(true);
    // ✅ AQUÍ ESTÁ LA CLAVE: 'reparto(*)' hace el JOIN automático con tu nueva tabla
    const { data, error } = await supabase
      .from('contenido')
      .select('*, reparto(*)') 
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error cargando contenido:", error);
    
    setLoading(false);
    return data || [];
  };

  // 2. Obtener detalles de UNA sola película (Vista Details)
  const getContentDetails = async (id) => {
    const { data, error } = await supabase
      .from('contenido')
      .select('*, reparto(*)') // ✅ Traemos también el reparto aquí
      .eq('id', id)
      .single();

    if (error) console.error("Error cargando detalles:", error);
    return data;
  };

  // 3. Obtener solo los Top 10
  const getTop10 = async () => {
    const { data } = await supabase
      .from('contenido')
      .select('*, reparto(*)')
      .eq('es_top_10', true)
      .limit(10);
    return data || [];
  };

  return { getAllContent, getContentDetails, getTop10, loading };
};