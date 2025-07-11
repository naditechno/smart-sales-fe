"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import Swal from "sweetalert2";
import {
  useCreateFundingProductTargetMutation,
  useDeleteFundingProductTargetMutation,
  useGetFundingProductTargetsQuery,
  useUpdateFundingProductTargetMutation,
} from "@/services/product-services/fundingtarget.service";
import { useGetFundingProductByIdQuery } from "@/services/product-services/fundingproduct.service";
import { FundingProductTarget } from "@/types/sales-manage";
import FundingTargetForm from "@/components/formModal/funding-target-form";
import { Badge } from "@/components/ui/badge";

interface TargetFundingPageProps {
  productId: number;
}

export default function TargetFundingPage({
  productId,
}: TargetFundingPageProps) {
  const [newTarget, setNewTarget] = useState<Partial<FundingProductTarget>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data: fundingProduct } = useGetFundingProductByIdQuery(productId);

  // 🛠️ Perhatikan tambahan funding_product_id di sini
  const { data, isLoading, refetch } = useGetFundingProductTargetsQuery({
    page,
    paginate: 10,
    funding_product_id: productId,
  });

  const [createTarget] = useCreateFundingProductTargetMutation();
  const [updateTarget] = useUpdateFundingProductTargetMutation();
  const [deleteTarget] = useDeleteFundingProductTargetMutation();

  const handleSubmit = async () => {
    const payload = {
      funding_product_id: productId,
      sales_category_id: newTarget.sales_category_id!,
      min_target: Number(newTarget.min_target ?? 0),
      max_target: Number(newTarget.max_target ?? 0),
      status: newTarget.status ?? true,
    };

    try {
      if (editingId !== null) {
        await updateTarget({ id: editingId, payload });
        Swal.fire("Berhasil!", "Target berhasil diperbarui.", "success");
      } else {
        await createTarget(payload);
        Swal.fire("Berhasil!", "Target berhasil ditambahkan.", "success");
      }
      setNewTarget({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal simpan target:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
    }
  };

  const handleEdit = (target: FundingProductTarget) => {
    setNewTarget(target);
    setEditingId(target.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Target?",
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
      await deleteTarget(id);
      refetch();
      Swal.fire("Terhapus!", "Target berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal hapus target:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
    }
  };

  const targets = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;
  const filtered = targets.filter((t) =>
    t.sales_category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Target Kategori Produk Funding: {fundingProduct?.name || "Memuat..."}
      </h1>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Cari kategori sales..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button
          onClick={() => {
            setNewTarget({});
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Target
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Kategori Sales</th>
                <th className="px-4 py-2">Target Min</th>
                <th className="px-4 py-2">Target Max</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filtered.map((target, i) => (
                  <tr key={target.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {target.sales_category_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rp{target.min_target.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rp{target.max_target.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={target.status ? "success" : "destructive"}>
                        {target.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(target)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(target.id)}
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
          <FundingTargetForm
            form={newTarget}
            setForm={setNewTarget}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            isEdit={!!editingId}
          />
        </div>
      )}
    </div>
  );
}
