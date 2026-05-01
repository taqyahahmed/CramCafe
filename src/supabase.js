import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xcuhxdaewzcyljrxbwru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjdWh4ZGFld3pjeWxqcnhid3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzUwNDAsImV4cCI6MjA5MzE1MTA0MH0.MiuMr_Zm9PWpf9XtTLS1S61mkqgoxZShkUmteMZW6B0';

export const supabase = createClient(supabaseUrl, supabaseKey);