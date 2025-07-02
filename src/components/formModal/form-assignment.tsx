"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/types/assignment";

interface AssignmentFormProps {
  form: Partial<Assignment>;
  setForm: (form: Partial<Assignment>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean; // Tambahkan prop ini
}

export default function AssignmentForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false, // Default false
}: AssignmentFormProps) {
  const isEdit = !!form.id;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Assignment" : "Tambah Assignment"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Customer ID</Label>
          <Input
            type="number"
            value={form.customer_id ?? ""}
            onChange={(e) =>
              setForm({ ...form, customer_id: Number(e.target.value) })
            }
            placeholder="Masukkan ID Customer"
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
          <Label>Tanggal Penugasan</Label>
          <Input
            type="date"
            value={form.assignment_date ?? ""}
            onChange={(e) =>
              setForm({ ...form, assignment_date: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            value={form.status ?? ""}
            onChange={(e) =>
              setForm({ ...form, status: Number(e.target.value) })
            }
            className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <option value="" disabled>
              Pilih Status
            </option>
            <option value={0}>Pending</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
