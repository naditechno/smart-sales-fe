"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentsQuery,
  useUpdateAssignmentMutation,
} from "@/services/coordinator/assignment.service";
import { Assignment } from "@/types/assignment";
import AssignmentForm from "@/components/formModal/form-assignment";
import useModal from "@/hooks/use-modal";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Swal from "sweetalert2";

export default function AssignmentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetAssignmentsQuery({
    page,
    paginate: 10,
  });

  const [createAssignment, { isLoading: isLoadingCreate }] =
    useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isLoadingUpdate }] =
    useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const [formData, setFormData] = useState<Partial<Assignment>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateAssignment({ id: editingId, payload: formData }).unwrap();
        await Swal.fire(
          "Berhasil",
          "Assignment berhasil diperbarui.",
          "success"
        );
      } else {
        await createAssignment(formData).unwrap();
        await Swal.fire(
          "Berhasil",
          "Assignment berhasil ditambahkan.",
          "success"
        );
      }

      setFormData({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err: unknown) {
      const error = err as FetchBaseQueryError & {
        data?: {
          message?: string;
          errors?: Record<string, string[]>;
        };
      };

      if (error?.status === 422) {
        const errorObj = error.data?.errors;
        const defaultMsg = error.data?.message || "Validasi gagal.";
        let detailedErrors = "";

        if (errorObj && typeof errorObj === "object") {
          detailedErrors = Object.entries(errorObj)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join("<br>");
        }

        await Swal.fire({
          icon: "error",
          title: "Validasi Gagal",
          html: detailedErrors || defaultMsg,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan data assignment.",
        });
      }
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setFormData(assignment);
    setEditingId(assignment.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAssignment(id);
      refetch();
      await Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
    } catch (err) {
      await Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat menghapus data.",
        "error"
      );
      console.log(err);
    }
  };

  const assignments = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  // ✅ Filtering dengan status dan keyword
  const filtered = assignments.filter((a) => {
    const searchLower = search.toLowerCase();

    const matchSearch =
      a.customer_first_name?.toLowerCase().includes(searchLower) ||
      a.customer_last_name?.toLowerCase().includes(searchLower) ||
      a.sales_name?.toLowerCase().includes(searchLower) ||
      a.coordinator_name?.toLowerCase().includes(searchLower);

    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "pending" && a.status === 0) ||
      (filterStatus === "in_progress" && a.status === 1) ||
      (filterStatus === "completed" && a.status === 2);

    return matchSearch && matchStatus;
  });  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Assignment</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama customer / sales / coordinator..."
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
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Button
            onClick={() => {
              setFormData({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Assignment
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Aksi</th>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Nama Customer
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Nama Sales
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Email Sales
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Nama koordinator
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Email koordinator
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Tanggal Penugasan
                </th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Tidak ada data assignment.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 space-x-2">
                      <div className="flex gap-2 items-center">
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
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {`${item.customer_first_name} ${item.customer_last_name}`}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.sales_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.sales_email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.coordinator_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.coordinator_email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.assignment_date
                        ? new Date(item.assignment_date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.status === 0 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
                          Pending
                        </span>
                      )}
                      {item.status === 1 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-200 text-blue-700">
                          In Progress
                        </span>
                      )}
                      {item.status === 2 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-200 text-green-700">
                          Completed
                        </span>
                      )}
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
          <AssignmentForm
            form={formData}
            setForm={setFormData}
            onCancel={() => {
              setFormData({});
              setEditingId(null);
              closeModal();
            }}
            onSubmit={handleSubmit}
            isLoading={isLoadingCreate || isLoadingUpdate}
          />
        </div>
      )}
    </div>
  );
}

