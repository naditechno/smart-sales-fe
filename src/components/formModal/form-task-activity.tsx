"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { TaskSchedule } from "@/types/taskactivity";
import { useGetCoordinatorAssignmentsQuery } from "@/services/reference.service";

interface TaskActivityFormProps {
  form: Partial<TaskSchedule>;
  setForm: (data: Partial<TaskSchedule>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function TaskActivityForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: TaskActivityFormProps) {
  const { data: assignments = [], isLoading } =
    useGetCoordinatorAssignmentsQuery();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {form.id ? "Edit Task Activity" : "Tambah Task Activity"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assignment Select */}
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Assignment</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.assignment_id || ""}
            onChange={(e) =>
              setForm({ ...form, assignment_id: Number(e.target.value) })
            }
            disabled={isLoading}
          >
            <option value="">Pilih Assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} - {a.assignment_date} -{" "}
                {a.status === 0
                  ? "Pending"
                  : a.status === 1
                  ? "In Progress"
                  : "Completed"}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduled At */}
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Scheduled At</Label>
          <Input
            type="datetime-local"
            value={
              form.scheduled_at
                ? form.scheduled_at.replace(" ", "T")
                : ""
            }
            onChange={(e) => {
              const raw = e.target.value; // "2025-07-06T17:00"
              const formatted = raw.replace("T", " "); // jadi "2025-07-06 17:00"
              setForm({ ...form, scheduled_at: formatted });
            }}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status?.toString() || "0"}
            onChange={(e) =>
              setForm({ ...form, status: parseInt(e.target.value) })
            }
          >
            <option value="0">Pending</option>
            <option value="1">Visited</option>
            <option value="2">Cancelled</option>
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
