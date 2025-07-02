"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Prospect {
  id: number;
  customerName: string;
  sales: string;
  coordinator: string;
  interestedProduct: string;
  status: string;
  lastActivity: string;
  nextFollowUp: string;
  notes: string;
}

export default function ReviewTab() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<Prospect>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = () => {
    if (editingId !== null) {
      setProspects(
        prospects.map((p) =>
          p.id === editingId ? ({ ...p, ...form } as Prospect) : p
        )
      );
    } else {
      const newProspect: Prospect = {
        id: Date.now(),
        customerName: form.customerName || "",
        sales: form.sales || "",
        coordinator: form.coordinator || "",
        interestedProduct: form.interestedProduct || "",
        status: form.status || "Dikunjungi",
        lastActivity: form.lastActivity || "",
        nextFollowUp: form.nextFollowUp || "",
        notes: form.notes || "",
      };
      setProspects([newProspect, ...prospects]);
    }
    setForm({});
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (p: Prospect) => {
    setForm(p);
    setEditingId(p.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setProspects(prospects.filter((p) => p.id !== id));
  };

  const filtered = prospects.filter((p) => {
    const match = p.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      p.status.toLowerCase() === filterStatus.toLowerCase();
    return match && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="Dikunjungi">Dikunjungi</SelectItem>
              <SelectItem value="Menunggu Respons">Menunggu Respons</SelectItem>
              <SelectItem value="Diterima">Diterima</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              setIsFormOpen(true);
            }}
          >
            + Tambah Catatan
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Nama Sales</label>
              <Input
                placeholder="Nama Sales"
                value={form.sales || ""}
                onChange={(e) => setForm({ ...form, sales: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Koordinator</label>
              <Input
                placeholder="Koordinator"
                value={form.coordinator || ""}
                onChange={(e) =>
                  setForm({ ...form, coordinator: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status Prospek</label>
              <Input
                placeholder="Status Prospek"
                value={form.status || ""}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Catatan</label>
              <Input
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
            <Button onClick={handleSubmit}>Simpan</Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Nama Pelanggan</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Koordinator</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Catatan</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.customerName}</td>
                  <td className="px-4 py-2">{p.sales}</td>
                  <td className="px-4 py-2">{p.coordinator}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.notes}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" onClick={() => handleEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada prospek.
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
