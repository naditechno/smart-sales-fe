"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TaskAssignment {
  id: number;
  salesName: string;
  customerName: string;
  assignmentDate: string;
  status: string;
}

export default function TaskTab() {
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<TaskAssignment>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = () => {
    if (
      form.salesName &&
      form.customerName &&
      form.assignmentDate &&
      form.status
    ) {
      const newTask: TaskAssignment = {
        id: Date.now(),
        salesName: form.salesName,
        customerName: form.customerName,
        assignmentDate: form.assignmentDate,
        status: form.status,
      };
      setTasks([newTask, ...tasks]);
      setForm({});
      setIsFormOpen(false);
    }
  };

  const handleEdit = (task: TaskAssignment) => {
    alert(`Edit penugasan untuk ${task.salesName}`);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchName =
      t.salesName.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || t.status === filterStatus;
    return matchName && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama sales atau pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="Tertunda">Tertunda</option>
            <option value="Sedang Berlangsung">Sedang Berlangsung</option>
            <option value="Selesai">Selesai</option>
          </select>
          <Button onClick={() => setIsFormOpen(true)}>+ Tambah Tugas</Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Sales</label>
              <Input
                placeholder="Nama Sales"
                value={form.salesName || ""}
                onChange={(e) =>
                  setForm({ ...form, salesName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Pelanggan</label>
              <Input
                placeholder="Nama Pelanggan"
                value={form.customerName || ""}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tanggal Penugasan</label>
              <Input
                type="date"
                value={form.assignmentDate || ""}
                onChange={(e) =>
                  setForm({ ...form, assignmentDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
                value={form.status || ""}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="">Pilih Status</option>
                <option value="Tertunda">Tertunda</option>
                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Nama Sales</th>
                <th className="px-4 py-2">Pelanggan</th>
                <th className="px-4 py-2">Tanggal Penugasan</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data penugasan.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.salesName}</td>
                    <td className="px-4 py-2">{t.customerName}</td>
                    <td className="px-4 py-2">{t.assignmentDate}</td>
                    <td className="px-4 py-2">
                      <Badge>{t.status}</Badge>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(t.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
