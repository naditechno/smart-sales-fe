"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";
import CustomerForm, { Customer } from "@/components/formModal/customer-form";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = () => {
    if (editingId !== null) {
      setCustomers(
        customers.map((c) =>
          c.id === editingId ? ({ ...c, ...form } as Customer) : c
        )
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now(),
        name: form.name || "",
        contactNumber: form.contactNumber || "",
        email: form.email || "",
        address: form.address || "",
        dateOfBirth: form.dateOfBirth || "",
        idNumber: form.idNumber || "",
        status: form.status || "Aktif",
      };
      setCustomers([newCustomer, ...customers]);
    }
    setForm({});
    setEditingId(null);
    closeModal();
  };

  const handleEdit = (c: Customer) => {
    setForm(c);
    setEditingId(c.id);
    openModal();
  };

  const filtered = customers.filter((c) => {
    const keyword = search.toLowerCase();
    const matchNameOrEmail =
      c.name.toLowerCase().includes(keyword) ||
      c.email.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchNameOrEmail && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pelanggan</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama atau email pelanggan..."
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
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Daftar Hitam">Daftar Hitam</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Pelanggan
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Kontak</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Alamat</th>
                <th className="px-4 py-2">Tanggal Lahir</th>
                <th className="px-4 py-2">No. ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.contactNumber}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.address}</td>
                  <td className="px-4 py-2">{c.dateOfBirth}</td>
                  <td className="px-4 py-2">{c.idNumber}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        c.status === "Aktif"
                          ? "default"
                          : c.status === "Daftar Hitam"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => handleEdit(c)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <CustomerForm
            form={form}
            setForm={setForm}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            editingId={editingId}
          />
        </div>
      )}
    </div>
  );
}
