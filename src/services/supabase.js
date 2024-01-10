import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://nwaehlqdwoxorinvybhz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53YWVobHFkd294b3JpbnZ5Ymh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4NTA4NDEsImV4cCI6MjAyMDQyNjg0MX0.g_Qj8QcxrauOE6FwixNPOixXt4ZR2C76lDP-bzRnZkk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
