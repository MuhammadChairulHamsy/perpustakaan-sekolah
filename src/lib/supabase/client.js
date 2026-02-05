import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const cookieStorage = {
  getItem: (key) => {
    const arr = document.cookie.split("; ");
    for (let i = 0; i < arr.length; i++) {
      const pair = arr[i].split("=");
      if (pair[0] === key) return decodeURIComponent(pair[1]);
    }
    return window.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

    (window, localStorage.setItem(key, value));
  },
  removeItem: (key) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

// 2. Gunakan di dalam createClient
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: cookieStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  },
);
