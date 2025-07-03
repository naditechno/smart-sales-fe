"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetProspectsQuery,
  useCreateProspectMutation,
  useUpdateProspectMutation,
  useDeleteProspectMutation,
  // useApproveProspectMutation,
  // useRejectProspectMutation,
} from "@/services/coordinator/prospect.service";
import useModal from "@/hooks/use-modal";
import ProspectForm from "@/components/formModal/form-prospect";
import { Prospect } from "@/types/prospect";
import Swal from "sweetalert2";

export default function ProspectAssignmentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetProspectsQuery({
    page,
    paginate: 10,
  });

  const [createProspect] = useCreateProspectMutation();
  const [updateProspect] = useUpdateProspectMutation();
  const [deleteProspect] = useDeleteProspectMutation();
  // const [approveProspect] = useApproveProspectMutation();
  // const [rejectProspect] = useRejectProspectMutation();

  const [newProspect, setNewProspect] = useState<Partial<Prospect>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      let response;

      if (editingId !== null) {
        response = await updateProspect({
          id: editingId,
          payload: newProspect,
        });
      } else {
        response = await createProspect(newProspect);
      }

      // Cek jika ada error dari response
      if ("error" in response) {
        const error = response.error;

        if (
          typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object"
        ) {
          const errData = error.data as { message?: string };
          Swal.fire(
            "Gagal",
            errData.message || "Terjadi kesalahan validasi.",
            "error"
          );
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
        }

        return; // hentikan proses jika error
      }

      // Jika tidak error, tampilkan berhasil
      Swal.fire(
        "Berhasil",
        editingId !== null
          ? "Prospek berhasil diperbarui."
          : "Prospek berhasil ditambahkan.",
        "success"
      );

      setNewProspect({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      Swal.fire("Gagal", "Terjadi kesalahan sistem.", "error");
    }
  };    

  const handleEdit = (prospect: Prospect) => {
    setNewProspect(prospect);
    setEditingId(prospect.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data prospek yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProspect(id);
      Swal.fire("Berhasil", "Prospek berhasil dihapus.", "success");
      refetch();
    } catch (err) {
      console.error("Gagal menghapus prospek:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };  

  // const handleApprove = async (id: number) => {
  //   try {
  //     await approveProspect(id);
  //     refetch();
  //   } catch (err) {
  //     console.error("Gagal menyetujui prospek:", err);
  //   }
  // };

  // const handleReject = async (id: number) => {
  //   try {
  //     await rejectProspect(id);
  //     refetch();
  //   } catch (err) {
  //     console.error("Gagal menolak prospek:", err);
  //   }
  // };

  const prospectData = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  const filteredProspects = prospectData.filter((p) =>
    p.id.toString().includes(search)
  );

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-gray-100 text-gray-600">
            Pending
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-blue-100 text-blue-600">
            Visited
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-yellow-100 text-yellow-600">
            Waiting
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-green-100 text-green-600">
            Accepted
          </span>
        );
      case 4:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-red-100 text-red-600">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-lg text-sm bg-muted text-muted-foreground">
            Tidak diketahui
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Prospek</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari ID prospek..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Button
          onClick={() => {
            setNewProspect({});
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Prospek
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Produk</th>
                <th className="px-4 py-2 font-medium">Deskripsi</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada prospek.
                  </td>
                </tr>
              ) : (
                filteredProspects.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">
                      {item.product_type ===
                        "App\\Models\\Product\\FundingProduct" ||
                      item.product_type === "AppModelsProductFundingProduct"
                        ? "Funding Product"
                        : item.product_type ===
                            "App\\Models\\Product\\LendingProduct" ||
                          item.product_type === "AppModelsProductLendingProduct"
                        ? "Lending Product"
                        : "-"}
                    </td>

                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{renderStatus(item.status)}</td>
                    <td className="px-4 py-2 space-x-2 space-y-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(item.id)}
                      >
                        Reject
                      </Button> */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
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

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <ProspectForm
            form={newProspect}
            setForm={setNewProspect}
            onCancel={() => {
              setNewProspect({});
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
