// components/funding/FundingProductForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FundingProductFormProps {
  form: Partial<FundingProduct>;
  setForm: (form: Partial<FundingProduct>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export interface FundingProduct {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestStructure: string;
  eligibilityCriteria: string;
  active: boolean;
}

export default function FundingProductForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: FundingProductFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tambah Produk Pendanaan</h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama Produk</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Jumlah Minimum</Label>
          <Input
            type="number"
            value={form.minAmount || ""}
            onChange={(e) => setForm({ ...form, minAmount: +e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Jumlah Maksimum</Label>
          <Input
            type="number"
            value={form.maxAmount || ""}
            onChange={(e) => setForm({ ...form, maxAmount: +e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Struktur Suku Bunga/Biaya</Label>
          <Input
            value={form.interestStructure || ""}
            onChange={(e) =>
              setForm({ ...form, interestStructure: e.target.value })
            }
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Kriteria Kelayakan</Label>
          <Input
            value={form.eligibilityCriteria || ""}
            onChange={(e) =>
              setForm({ ...form, eligibilityCriteria: e.target.value })
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
