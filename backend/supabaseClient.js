import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL ="https://qjswceraujklitpvkibd.supabase.co";
const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3djZXJhdWprbGl0cHZraWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5Mjc3NCwiZXhwIjoyMDc1NTY4Nzc0fQ.rk2dnDGG0Iz-Lm5_NECNdQvrlzyeNypAPNl4Mg5uf9A";


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);