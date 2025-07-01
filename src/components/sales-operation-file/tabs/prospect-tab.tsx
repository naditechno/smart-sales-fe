"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export default function ProspectTab() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const [form, setForm] = useState<Partial<Prospect>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const handleEdit = (p: Prospect) => {
    setForm(p);
    setEditingId(p.id);
    setIsOpen(true);
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
              setIsOpen(true);
            }}
          >
            + Tambah Prospek
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Nama Pelanggan
              </label>
              <Input
                value={form.customerName || ""}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Nama Sales
              </label>
              <Input
                value={form.sales || ""}
                onChange={(e) => setForm({ ...form, sales: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Koordinator
              </label>
              <Input
                value={form.coordinator || ""}
                onChange={(e) =>
                  setForm({ ...form, coordinator: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Produk</label>
              <Input
                value={form.interestedProduct || ""}
                onChange={(e) =>
                  setForm({ ...form, interestedProduct: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <Select
                value={form.status || "Dikunjungi"}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dikunjungi">Dikunjungi</SelectItem>
                  <SelectItem value="Menunggu Respons">
                    Menunggu Respons
                  </SelectItem>
                  <SelectItem value="Diterima">Diterima</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Aktivitas Terakhir
              </label>
              <Input
                type="date"
                value={form.lastActivity || ""}
                onChange={(e) =>
                  setForm({ ...form, lastActivity: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Tindak Lanjut Berikutnya
              </label>
              <Input
                type="date"
                value={form.nextFollowUp || ""}
                onChange={(e) =>
                  setForm({ ...form, nextFollowUp: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-sm font-medium">Catatan</label>
              <Input
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aktivitas Terakhir</th>
                <th className="px-4 py-2">Tindak Lanjut</th>
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
                  <td className="px-4 py-2">{p.interestedProduct}</td>
                  <td className="px-4 py-2">
                    <Badge>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-2">{p.lastActivity}</td>
                  <td className="px-4 py-2">{p.nextFollowUp}</td>
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
                    colSpan={9}
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
