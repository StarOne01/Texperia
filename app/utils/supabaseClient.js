import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient("https://mvhysklhzsiibjxayxmz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aHlza2xoenNpaWJqeGF5eG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzAzOTcsImV4cCI6MjA1Njc0NjM5N30.ZOTieQyRsdMjpfDq3aQIcNNVQIm2rQwY95a0sJZnnr4");
