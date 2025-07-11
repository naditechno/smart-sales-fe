"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FundingProductCategory } from "@/types/sales-manage";

interface FundingCategoryFormProps {
  form: Partial<FundingProductCategory>;
  setForm: (form: Partial<FundingProductCategory>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
}

export default function FundingCategoryForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isEdit,
}: FundingCategoryFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit" : "Tambah"} Kategori Produk
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama Kategori</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Kontribusi (%)</Label>
          <Input
            type="number"
            value={form.contribution ?? ""}
            onChange={(e) =>
              setForm({ ...form, contribution: Number(e.target.value) })
            }
          />
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
