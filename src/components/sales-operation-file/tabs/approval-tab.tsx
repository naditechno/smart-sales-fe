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

interface Approval {
  id: number;
  customerName: string;
  product: string;
  sales: string;
  coordinator: string;
  approvalStage: string;
  bankSubmissionDate: string;
  disbursementDate: string;
  verificationStatus: string;
  costCalculationStatus: string;
}

export default function ApprovalTab() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("semua");
  const [form, setForm] = useState<Partial<Approval>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = () => {
    if (editingId !== null) {
      setApprovals(
        approvals.map((a) =>
          a.id === editingId ? ({ ...a, ...form } as Approval) : a
        )
      );
    } else {
      const newApproval: Approval = {
        id: Date.now(),
        customerName: form.customerName || "",
        product: form.product || "",
        sales: form.sales || "",
        coordinator: form.coordinator || "",
        approvalStage: form.approvalStage || "Pengajuan Bank Tertunda",
        bankSubmissionDate: form.bankSubmissionDate || "",
        disbursementDate: form.disbursementDate || "",
        verificationStatus: form.verificationStatus || "Terverifikasi",
        costCalculationStatus: form.costCalculationStatus || "Belum Dihitung",
      };
      setApprovals([newApproval, ...approvals]);
    }
    setForm({});
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (a: Approval) => {
    setForm(a);
    setEditingId(a.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  const filtered = approvals.filter((a) => {
    const match = a.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStage =
      filterStage === "semua" ||
      a.approvalStage.toLowerCase() === filterStage.toLowerCase();
    return match && matchStage;
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
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter Tahap Persetujuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tahap</SelectItem>
              <SelectItem value="Pengajuan Bank Tertunda">
                Pengajuan Bank Tertunda
              </SelectItem>
              <SelectItem value="Pencairan Tertunda">
                Pencairan Tertunda
              </SelectItem>
              <SelectItem value="Verifikasi Pelanggan Tertunda">
                Verifikasi Pelanggan Tertunda
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              setIsFormOpen(true);
            }}
          >
            + Tambah Persetujuan
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
              <label className="text-sm font-medium">Produk</label>
              <Input
                placeholder="Produk"
                value={form.product || ""}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sales</label>
              <Input
                placeholder="Sales"
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
              <label className="text-sm font-medium">
                Tanggal Pengajuan ke Bank
              </label>
              <Input
                type="date"
                value={form.bankSubmissionDate || ""}
                onChange={(e) =>
                  setForm({ ...form, bankSubmissionDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tanggal Pencairan</label>
              <Input
                type="date"
                value={form.disbursementDate || ""}
                onChange={(e) =>
                  setForm({ ...form, disbursementDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status Verifikasi</label>
              <Select
                value={form.verificationStatus || ""}
                onValueChange={(value) =>
                  setForm({ ...form, verificationStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status Verifikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terverifikasi">Terverifikasi</SelectItem>
                  <SelectItem value="Tidak Terverifikasi">
                    Tidak Terverifikasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Status Perhitungan Biaya
              </label>
              <Select
                value={form.costCalculationStatus || ""}
                onValueChange={(value) =>
                  setForm({ ...form, costCalculationStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status Perhitungan Biaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Belum Dihitung">Belum Dihitung</SelectItem>
                  <SelectItem value="Sudah Dihitung">Sudah Dihitung</SelectItem>
                </SelectContent>
              </Select>
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
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Koordinator</th>
                <th className="px-4 py-2">Tahap Persetujuan</th>
                <th className="px-4 py-2">Pengajuan Bank</th>
                <th className="px-4 py-2">Pencairan</th>
                <th className="px-4 py-2">Verifikasi</th>
                <th className="px-4 py-2">Biaya</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data persetujuan.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-4 py-2">{a.customerName}</td>
                    <td className="px-4 py-2">{a.product}</td>
                    <td className="px-4 py-2">{a.sales}</td>
                    <td className="px-4 py-2">{a.coordinator}</td>
                    <td className="px-4 py-2">{a.approvalStage}</td>
                    <td className="px-4 py-2">{a.bankSubmissionDate}</td>
                    <td className="px-4 py-2">{a.disbursementDate}</td>
                    <td className="px-4 py-2">{a.verificationStatus}</td>
                    <td className="px-4 py-2">{a.costCalculationStatus}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Button size="sm" onClick={() => handleEdit(a)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(a.id)}
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
