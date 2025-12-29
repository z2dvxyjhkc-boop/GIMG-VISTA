import { createClient } from '@supabase/supabase-js';

// Leemos las variables del archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos la conexión segura
export const supabase = createClient(supabaseUrl, supabaseKey);