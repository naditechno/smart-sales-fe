"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import Swal from "sweetalert2";
import {
  useCreateFundingProductCategoryMutation,
  useDeleteFundingProductCategoryMutation,
  useGetFundingProductCategoriesQuery,
  useUpdateFundingProductCategoryMutation,
} from "@/services/product-services/fundingproductcategory.service";
import { FundingProductCategory } from "@/types/sales-manage";
import FundingCategoryForm from "@/components/formModal/funding-product-category-form";

export default function FundingCategoryPage() {
  const [newCategory, setNewCategory] = useState<
    Partial<FundingProductCategory>
  >({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetFundingProductCategoriesQuery({
    page,
    paginate: 10,
  });

  const [createCategory] = useCreateFundingProductCategoryMutation();
  const [updateCategory] = useUpdateFundingProductCategoryMutation();
  const [deleteCategory] = useDeleteFundingProductCategoryMutation();

  const handleSubmit = async () => {
    const payload = {
      name: newCategory.name ?? "",
      description: newCategory.description ?? "",
      contribution: Number(newCategory.contribution ?? 0),
    };

    try {
      if (editingId !== null) {
        await updateCategory({ id: editingId, payload });
        Swal.fire("Berhasil!", "Kategori berhasil diperbarui.", "success");
      } else {
        await createCategory(payload);
        Swal.fire("Berhasil!", "Kategori berhasil ditambahkan.", "success");
      }
      setNewCategory({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal simpan kategori:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
    }
  };

  const handleEdit = (cat: FundingProductCategory) => {
    setNewCategory(cat);
    setEditingId(cat.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Kategori?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);
      refetch();
      Swal.fire("Terhapus!", "Kategori berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal hapus kategori:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
    }
  };

  const categories = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kategori Produk Funding</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Cari nama kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button
          onClick={() => {
            setNewCategory({});
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Kontribusi</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filtered.map((cat, i) => (
                  <tr key={cat.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{cat.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {cat.description}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {cat.contribution}%
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center  space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(cat)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex justify-between items-center bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FundingCategoryForm
            form={newCategory}
            setForm={setNewCategory}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            isEdit={!!editingId}
          />
        </div>
      )}
    </div>
  );
}
