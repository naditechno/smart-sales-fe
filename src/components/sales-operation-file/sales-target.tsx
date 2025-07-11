"use client";

import { useEffect, useState } from "react";
import {
  useGetSalesTargetFundingsQuery,
  useDeleteSalesTargetFundingMutation,
} from "@/services/coordinator/salestarget.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import Swal from "sweetalert2";
import { SalesTargetFunding } from "@/types/sales";
import FormSalesTargetFunding from "@/components/formModal/sales-target-form";
import DetailsCell from "@/components/sales-operation-file/detailsById/DetailsCell";

export default function SalesTargetFundingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingData, setEditingData] = useState<
    SalesTargetFunding | undefined
  >();
  const [perPage] = useState(10);
  const [refreshId, setRefreshId] = useState(Date.now());

  const { isOpen, openModal, closeModal } = useModal();

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useGetSalesTargetFundingsQuery({
    page: currentPage,
    paginate: perPage,
    search,
  });

  const [deleteTarget] = useDeleteSalesTargetFundingMutation();

  const targets = result?.data || [];
  const totalPages = result?.last_page || 1;

  const handleAdd = () => {
    setEditingData(undefined);
    openModal();
  };

  const handleEdit = (item: SalesTargetFunding) => {
    setEditingData(item);
    openModal();
  };

  const handleDelete = async (item: SalesTargetFunding) => {
    const res = await Swal.fire({
      title: `Hapus target ${item.sales_name}?`,
      text: "Data tidak dapat dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (res.isConfirmed) {
      try {
        await deleteTarget(item.id).unwrap();
        Swal.fire("Berhasil", "Target berhasil dihapus", "success");
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Gagal menghapus target", "error");
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Target Sales Produk Pendanaan</h1>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Input
          placeholder="Cari nama sales..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Button onClick={handleAdd}>+ Tambah Target</Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Koordinator</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Detail Target</th>
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
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-destructive">
                    Gagal memuat data.
                  </td>
                </tr>
              ) : (
                targets.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      {(currentPage - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>{item.coordinator_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.coordinator_email}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>{item.sales_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.sales_email}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <DetailsCell id={item.id} refreshTrigger={refreshId} />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
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
        <div className="p-4 flex items-center justify-between bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="outline"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <FormSalesTargetFunding
          initialData={editingData}
          onClose={closeModal}
          onSuccess={() => {
            refetch();
            setRefreshId(Date.now());
          }}
        />
      )}
    </div>
  );
}
