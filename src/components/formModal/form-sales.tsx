"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sales } from "@/types/sales";
import { useState } from "react";

interface SalesFormProps {
  form: Partial<Sales>;
  setForm: (form: Partial<Sales>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function SalesForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: SalesFormProps) {
  const [isEdit] = useState(!!form.sales_id);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Sales" : "Tambah Sales"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Sales ID</Label>
          <Input
            type="number"
            value={form.sales_id ?? ""}
            onChange={(e) =>
              setForm({ ...form, sales_id: Number(e.target.value) })
            }
            placeholder="Masukkan ID Sales"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Coordinator ID</Label>
          <Input
            type="number"
            value={form.coordinator_id ?? ""}
            onChange={(e) =>
              setForm({ ...form, coordinator_id: Number(e.target.value) })
            }
            placeholder="Masukkan ID Koordinator"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>{isEdit ? "Perbarui" : "Simpan"}</Button>
      </div>
    </div>
  );
}
