import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Cliente principal — mantiene la sesión del usuario logueado
export const supabase = createClient(supabaseUrl, supabaseKey)

// Cliente secundario sin persistencia de sesión.
// Usado para crear usuarios desde el admin SIN reemplazar la sesión activa.
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
