"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Reconciliation {
  id: number;
  appId: string;
  differenceType: string;
  resolutionStatus: string;
  date: string;
  notes: string;
}

export default function ReconciliationTab() {
  const [recons, setRecons] = useState<Reconciliation[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<Reconciliation>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    if (
      form.appId &&
      form.differenceType &&
      form.resolutionStatus &&
      form.date &&
      form.notes
    ) {
      const newReconciliation: Reconciliation = {
        id: Date.now(),
        appId: form.appId,
        differenceType: form.differenceType,
        resolutionStatus: form.resolutionStatus,
        date: form.date,
        notes: form.notes,
      };
      setRecons([newReconciliation, ...recons]);
      setForm({});
      setIsFormOpen(false);
    }
  };

  const filtered = recons.filter((r) => {
    const keyword = search.toLowerCase();
    const matchAppId = r.appId.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      r.resolutionStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchAppId && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari ID Aplikasi..."
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
            <option value="Pending">Pending</option>
            <option value="Selesai">Selesai</option>
          </select>
          <Button onClick={() => setIsFormOpen(true)}>
            + Tambah Rekonsiliasi
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">ID Aplikasi</label>
              <Input
                placeholder="ID Aplikasi"
                value={form.appId || ""}
                onChange={(e) => setForm({ ...form, appId: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Jenis Perbedaan</label>
              <Input
                placeholder="Jenis Perbedaan"
                value={form.differenceType || ""}
                onChange={(e) =>
                  setForm({ ...form, differenceType: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status Resolusi</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
                value={form.resolutionStatus || ""}
                onChange={(e) =>
                  setForm({ ...form, resolutionStatus: e.target.value })
                }
              >
                <option value="">Pilih Status Resolusi</option>
                <option value="Pending">Pending</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Catatan</label>
              <Textarea
                placeholder="Catatan"
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">ID Aplikasi</th>
                <th className="px-4 py-2">Jenis Perbedaan</th>
                <th className="px-4 py-2">Status Resolusi</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{r.appId}</td>
                    <td className="px-4 py-2">{r.differenceType}</td>
                    <td className="px-4 py-2">{r.resolutionStatus}</td>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data rekonsiliasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
