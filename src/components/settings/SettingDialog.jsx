import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

export const SettingDialog = ({ open, onOpenChange, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: profiles.full_name || "",
        email: profiles.email || "",
        role: profiles.role || "",
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        role: "",
      });
    }
  }, [user, open]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Tambah User Baru"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Perbarui informasi User"
              : "Tambahkan user baru ke perpustakaan"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email anda"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Masukkan role anda"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="cursor-pointer">
              {user ? "Simpan Perubahan" : "Tambah user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
