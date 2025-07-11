"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetTaskSchedulesQuery,
  useCreateTaskScheduleMutation,
  useUpdateTaskScheduleMutation,
  useDeleteTaskScheduleMutation,
} from "@/services/coordinator/taskactivity.service";
import { TaskSchedule } from "@/types/taskactivity";
import useModal from "@/hooks/use-modal";
import TaskActivityForm from "@/components/formModal/form-task-activity";
import Swal from "sweetalert2";

export default function TaskActivityPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua"); // ← Tambahan

  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetTaskSchedulesQuery({
    page,
    paginate: 10,
  });

  const [createTaskSchedule] = useCreateTaskScheduleMutation();
  const [updateTaskSchedule] = useUpdateTaskScheduleMutation();
  const [deleteTaskSchedule] = useDeleteTaskScheduleMutation();

  const [form, setForm] = useState<Partial<TaskSchedule>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateTaskSchedule({ id: editingId, payload: form });
        Swal.fire("Berhasil!", "Task berhasil diperbarui.", "success");
      } else {
        await createTaskSchedule(form);
        Swal.fire("Berhasil!", "Task berhasil ditambahkan.", "success");
      }
      setForm({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal menyimpan task schedule:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (item: TaskSchedule) => {
    const { scheduled_at, ...rest } = item;
    const formatted = scheduled_at
      ? new Date(scheduled_at).toISOString().slice(0, 16).replace("T", " ")
      : "";

    setForm({
      ...rest,
      scheduled_at: formatted,
    });

    setEditingId(item.id);
    openModal();
  };  

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteTaskSchedule(id);
        refetch();
        Swal.fire("Berhasil!", "Task berhasil dihapus.", "success");
      } catch (err) {
        console.error("Gagal menghapus task schedule:", err);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  const taskSchedules = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  // ✅ Terapkan filter status dan search
  const filteredData = taskSchedules.filter((t) => {
    const matchSearch =
      t.customer_first_name?.toLowerCase().includes(search) ||
      t.customer_last_name?.toLowerCase().includes(search) ||
      t.sales_name?.toLowerCase().includes(search) ||
      t.coordinator_name?.toLowerCase().includes(search);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "pending" && t.status === 0) ||
      (filterStatus === "visited" && t.status === 1) ||
      (filterStatus === "cancelled" && t.status === 2);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Task Activity</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2 items-center">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          >
            <option value="semua">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="visited">Visited</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Scheduled At
                </th>
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
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={13} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center p-4">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(item.scheduled_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
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
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 0
                            ? "bg-gray-200 text-gray-700"
                            : item.status === 1
                            ? "bg-blue-200 text-blue-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {item.status === 0
                          ? "Pending"
                          : item.status === 1
                          ? "Visited"
                          : "Cancelled"}
                      </span>
                    </td>
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
          <TaskActivityForm
            form={form}
            setForm={setForm}
            onCancel={() => {
              setForm({});
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
