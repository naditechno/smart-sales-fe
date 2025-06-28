"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FundingProductForm, {
  FundingProduct,
} from "@/components/formModal/funding-product-form";
import useModal from "@/hooks/use-modal";

export default function FundingPage() {
  const [products, setProducts] = useState<FundingProduct[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<FundingProduct>>({});
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const { isOpen, openModal, closeModal } = useModal();

  const handleCreate = () => {
    if (editingProductId !== null) {
      setProducts(
        products.map((p) =>
          p.id === editingProductId
            ? ({ ...p, ...newProduct } as FundingProduct)
            : p
        )
      );
    } else {
      const product = {
        id: Date.now(),
        name: newProduct.name || "",
        description: newProduct.description || "",
        minAmount: Number(newProduct.minAmount),
        maxAmount: Number(newProduct.maxAmount),
        interestStructure: newProduct.interestStructure || "",
        eligibilityCriteria: newProduct.eligibilityCriteria || "",
        active: true,
      };
      setProducts([product, ...products]);
    }
    setNewProduct({});
    setEditingProductId(null);
    closeModal();
  };

  const toggleStatus = (id: number) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleEdit = (product: FundingProduct) => {
    setNewProduct(product);
    setEditingProductId(product.id);
    openModal();
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && p.active) ||
      (filterStatus === "tidak" && !p.active);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produk Pendanaan</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex items-center gap-2">
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
              setNewProduct({});
              setEditingProductId(null);
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
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-4 py-2 font-medium">Deskripsi</th>
                <th className="px-4 py-2 font-medium">Min-Max</th>
                <th className="px-4 py-2 font-medium">Suku Bunga</th>
                <th className="px-4 py-2 font-medium">Kriteria</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">
                    Rp{product.minAmount} - Rp{product.maxAmount}
                  </td>
                  <td className="px-4 py-2">{product.interestStructure}</td>
                  <td className="px-4 py-2">{product.eligibilityCriteria}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={product.active ? "success" : "destructive"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(product.id)}
                    >
                      {product.active ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FundingProductForm
            form={newProduct}
            setForm={setNewProduct}
            onCancel={closeModal}
            onSubmit={handleCreate}
          />
        </div>
      )}
    </div>
  );
}
