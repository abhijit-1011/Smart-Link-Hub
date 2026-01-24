// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔴 REPLACE THESE WITH YOUR REAL VALUES
const SUPABASE_URL = "https://nyghnjxdokohsolgxcml.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z2huanhkb2tvaHNvbGd4Y21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzQ5MDMsImV4cCI6MjA4NDcxMDkwM30.ADyNSHr2fGpkktVJq0SXgnOm_X_gbA8P6Z5WmxUbsAo";

// Create Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// 👇 Expose anon key for Edge Function calls
supabase.anonKey = SUPABASE_ANON_KEY;
