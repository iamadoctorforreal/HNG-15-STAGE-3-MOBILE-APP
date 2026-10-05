import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Exact same Supabase project URL and anon public key as web application
const SUPABASE_URL = 'https://wuqfacjwfkijewdqvous.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tyrvBnehbylnKU-9d-TKWQ__dgjTjHz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
