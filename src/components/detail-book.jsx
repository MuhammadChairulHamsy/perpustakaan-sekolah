const handleNotifyMe = async (bookId) => {
  try {
    const { error } = await supabase
      .from("wishlist")
      .insert([{ user_id: user.id, book_id: bookId }]);

    if (error) {
      if (error.code === '23505') { // Error code untuk Unique Constraint (sudah ada)
        toast.info("Anda sudah masuk dalam daftar tunggu buku ini.");
      } else {
        throw error;
      }
    } else {
      toast.success("Kami akan memberitahu Anda saat buku tersedia!");
    }
  } catch (err) {
    toast.error("Gagal mendaftar: " + err.message);
  }
};

// Di bagian render UI (tombol):
{book.stock === 0 && (
  <Button 
    variant="outline" 
    className="w-full mt-2 gap-2"
    onClick={() => handleNotifyMe(book.id)}
  >
    <BellRing className="h-4 w-4" />
    Beritahu Saya Jika Tersedia
  </Button>
)}