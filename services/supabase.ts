// Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// TODO: Replace with actual Supabase URL and anon key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vkavxaldrtrhcptkgkxc.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXZ4YWxkcnRyaGNwdGtna3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTgyMDcsImV4cCI6MjA3NDczNDIwN30.aZoXlSiDfM7molpsUW4EP7TJik1wo546YXdwk2RoNcI';

const isWeb = Platform.OS === 'web';

// Use AsyncStorage for native, localStorage for web
const storage = isWeb ? undefined : AsyncStorage;

// No-op lock for web to avoid navigator.locks issues in some browsers
const lock = isWeb
  ? async <T>(name: string, acquireTimeout: number, fn: () => Promise<T>): Promise<T> => fn()
  : undefined;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    lock,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});