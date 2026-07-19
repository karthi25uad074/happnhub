const SUPABASE_URL = "https://kedvqtogjbqsdzuhclte.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZHZxdG9namJxc2R6dWhjbHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NTQ0MjMsImV4cCI6MjEwMDAzMDQyM30.zk1N2ejJ3JkzP6a7y77Q0oMjxtOtUbhCxBd3CCNpr9g";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);