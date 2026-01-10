import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const Books = () => {
  const [book, setBook] = useState();

  useEffect(() => {
    const [data, error] = createClient({
      
    })
  })

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-2">Books</h1>
      <p className="text-muted-foreground">
        Kelola koleksi buku perpustakaan Anda
      </p>
    </div>
  );
};

export default Books;
