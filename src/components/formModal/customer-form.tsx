"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";

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
          <Label>Nama Depan</Label>
          <Input
            value={form.first_name || ""}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Nama Belakang</Label>
          <Input
            value={form.last_name || ""}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="block text-sm font-medium">Salutation</label>
          <select
            value={form.salutation ?? ""}
            onChange={(e) => setForm({ ...form, salutation: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          >
            <option value="">Pilih</option>
            <option value="MR">MR</option>
            <option value="MRS">MRS</option>
            <option value="MS">MS</option>
          </select>
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
          <Label>Nomor Telepon</Label>
          <Input
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          <Label>Kode Pos</Label>
          <Input
            value={form.postal_code || ""}
            onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
          />
        </div>
        {/* Latitude */}
        <div className="flex flex-col gap-y-1">
          <label className="block text-sm font-medium">Latitude</label>
          <input
            type="number"
            value={form.latitude ?? ""}
            onChange={(e) =>
              setForm({ ...form, latitude: parseFloat(e.target.value) })
            }
            className="w-full border rounded-md px-3 py-2 mb-3"
          />
        </div>

        {/* Longitude */}
        <div className="flex flex-col gap-y-1">
          <label className="block text-sm font-medium">Longitude</label>
          <input
            type="number"
            value={form.longitude ?? ""}
            onChange={(e) =>
              setForm({ ...form, longitude: parseFloat(e.target.value) })
            }
            className="w-full border rounded-md px-3 py-2 mb-3"
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={
              form.status === true
                ? "true"
                : form.status === false
                ? "false"
                : ""
            }
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "true" })
            }
          >
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
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
