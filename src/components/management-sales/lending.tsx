"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import LendingProductForm, {
  LendingProduct,
} from "@/components/formModal/lending-product-form";


export default function LendingPage() {
  const [products, setProducts] = useState<LendingProduct[]>([]);
  const [form, setForm] = useState<Partial<LendingProduct>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = () => {
    if (editingId !== null) {
      setProducts(
        products.map((p) =>
          p.id === editingId ? ({ ...p, ...form } as LendingProduct) : p
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name || "",
        description: form.description || "",
        loanRange: form.loanRange || "",
        interestStructure: form.interestStructure || "",
        paymentTerms: form.paymentTerms || "",
        eligibilityCriteria: form.eligibilityCriteria || "",
        active: true,
      };
      setProducts([newProduct, ...products]);
    }
    setForm({});
    setEditingId(null);
    closeModal();
  };

  const handleEdit = (product: LendingProduct) => {
    setForm(product);
    setEditingId(product.id);
    openModal();
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const toggleStatus = (id: number) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const filtered = products.filter((p) => {
    const match = p.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && p.active) ||
      (filterStatus === "tidak" && !p.active);
    return match && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produk Pinjaman</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2 items-center">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak">Tidak Aktif</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Produk
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Kisaran Pinjaman</th>
                <th className="px-4 py-2">Suku Bunga</th>
                <th className="px-4 py-2">Ketentuan</th>
                <th className="px-4 py-2">Kriteria</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.description}</td>
                  <td className="px-4 py-2">{p.loanRange}</td>
                  <td className="px-4 py-2">{p.interestStructure}</td>
                  <td className="px-4 py-2">{p.paymentTerms}</td>
                  <td className="px-4 py-2">{p.eligibilityCriteria}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={p.active ? "success" : "destructive"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(p.id)}
                    >
                      {p.active ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(p)}
                    >
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
                    colSpan={8}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada produk pinjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <LendingProductForm
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
