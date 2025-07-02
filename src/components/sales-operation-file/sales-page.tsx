"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateSalesMutation,
  useDeleteSalesMutation,
  useGetSalesQuery,
  useUpdateSalesMutation,
} from "@/services/coordinator/coordinatorsales.service";
import { Sales } from "@/types/sales";
import SalesForm from "../formModal/form-sales";
import useModal from "@/hooks/use-modal";

export default function SalesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetSalesQuery({ page, paginate: 10 });
  const [createSales] = useCreateSalesMutation();
  const [updateSales] = useUpdateSalesMutation();
  const [deleteSales] = useDeleteSalesMutation();

  const [newSales, setNewSales] = useState<Partial<Sales>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateSales({ id: editingId, payload: newSales });
      } else {
        await createSales(newSales);
      }
      setNewSales({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal menyimpan data sales:", err);
    }
  };

  const handleEdit = (sales: Sales) => {
    setNewSales(sales);
    setEditingId(sales.sales_id);
    openModal();
  };

  const handleDelete = async (salesId: number) => {
    if (!confirm("Yakin ingin menghapus sales ini?")) return;
    try {
      await deleteSales(salesId);
      refetch();
    } catch (err) {
      console.error("Gagal menghapus sales:", err);
    }
  };

  const salesData = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  const filteredSales = salesData.filter(
    (s) =>
      s.sales_id.toString().includes(search) ||
      s.coordinator_id.toString().includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Sales</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari ID sales / coordinator..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Button
          onClick={() => {
            setNewSales({});
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Sales
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Sales ID</th>
                <th className="px-4 py-2 font-medium">Nama Sales</th>
                <th className="px-4 py-2 font-medium">Email Sales</th>
                <th className="px-4 py-2 font-medium">Koordinator ID</th>
                <th className="px-4 py-2 font-medium">Nama koordinator</th>
                <th className="px-4 py-2 font-medium">Email koordinator</th>
                <th className="px-4 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Tidak ada data sales.
                  </td>
                </tr>
              ) : (
                filteredSales.map((item, idx) => (
                  <tr
                    key={`${item.sales_id}-${item.coordinator_id}`}
                    className="border-t"
                  >
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">{item.sales_id}</td>
                    <td className="px-4 py-2">{item.sales_name}</td>
                    <td className="px-4 py-2">{item.sales_email}</td>
                    <td className="px-4 py-2">{item.coordinator_id}</td>
                    <td className="px-4 py-2">{item.coordinator_name}</td>
                    <td className="px-4 py-2">{item.coordinator_email}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.sales_id)}
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

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <SalesForm
            form={newSales}
            setForm={setNewSales}
            onCancel={() => {
              setNewSales({});
              setEditingId(null);
              closeModal();
            }}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
