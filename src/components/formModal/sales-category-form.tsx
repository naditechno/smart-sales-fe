"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SalesCategory } from "@/types/salescategory";

interface SalesCategoryFormProps {
  form: Partial<SalesCategory>;
  setForm: (data: Partial<SalesCategory>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editingId: number | null;
}

export default function SalesCategoryForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  editingId,
}: SalesCategoryFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Kategori Penjualan" : "Tambah Kategori Penjualan"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Nama</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Deskripsi</Label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status === true ? "true" : "false"}
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
