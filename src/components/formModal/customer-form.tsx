"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface Customer {
  id: number;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  idNumber: string;
  status: "Aktif" | "Tidak Aktif" | "Daftar Hitam";
}

interface CustomerFormProps {
  form: Partial<Customer>;
  setForm: (data: Partial<Customer>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editingId: number | null;
}

export default function CustomerForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  editingId,
}: CustomerFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Nomor Kontak</Label>
          <Input
            value={form.contactNumber || ""}
            onChange={(e) =>
              setForm({ ...form, contactNumber: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Lahir</Label>
          <Input
            type="date"
            value={form.dateOfBirth || ""}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Alamat</Label>
          <Input
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Nomor ID</Label>
          <Input
            value={form.idNumber || ""}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status || "Aktif"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Customer["status"] })
            }
          >
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Daftar Hitam">Daftar Hitam</option>
          </select>
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>Simpan</Button>
      </div>
    </div>
  );
}
