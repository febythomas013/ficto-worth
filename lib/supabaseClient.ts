import { createClient } from '@supabase/supabase-js'

// Replace with your actual keys from Supabase → Project → Settings → API
const supabaseUrl = 'https://ghxpgkzffyemugaokzig.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeHBna3pmZnllbXVnYW9remlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDU3MTgsImV4cCI6MjA2NTEyMTcxOH0.pARfkGLntYs3ox_WGnWYgQZbkgkbjLVQuoe0eUuDKvg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
