"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";
import CustomerForm from "@/components/formModal/customer-form";
import { Customer } from "@/types/customer";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useImportCustomerMutation,
  useExportCustomerMutation,
} from "@/services/customer.service";
import ImportExportButton from "./ui/button-excel";
import Swal from "sweetalert2";

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<Customer>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetCustomersQuery({
    page,
    paginate: 10,
  });

  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [importCustomer] = useImportCustomerMutation();
  const [exportCustomer] = useExportCustomerMutation();

  const customers = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateCustomer({ id: editingId, payload: form }).unwrap();
      } else {
        await createCustomer(form).unwrap();
      }
      setForm({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (error) {
      console.error("Gagal simpan data:", error);
    }
  };

  const handleEdit = (c: Customer) => {
    setForm(c);
    setEditingId(c.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Pelanggan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteCustomer(id).unwrap();
        refetch();
        Swal.fire("Berhasil", "Pelanggan berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus pelanggan:", error);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus pelanggan.",
          "error"
        );
      }
    }
  };

  const handleImport = async (file: File) => {
    try {
      await importCustomer(file).unwrap();
      refetch();
      Swal.fire("Berhasil", "Import berhasil!", "success");
    } catch (error) {
      console.error("Gagal import:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat import data.", "error");
    }
  };

  const handleExport = async () => {
    if (isExporting) {
      Swal.fire(
        "Sedang Diproses",
        "Export sedang diproses, harap tunggu...",
        "info"
      );
      return;
    }

    setIsExporting(true);
    try {
      await exportCustomer({ status: true });
      Swal.fire("Berhasil", "Cek file excel di Notifikasi.", "success");
    } catch (error) {
      console.error("Gagal export:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat export data.", "error");
    } finally {
      setIsExporting(false);
    }
  };  

  const filtered = customers.filter((c) => {
    const keyword = search.toLowerCase();
    const matchNameOrEmail =
      c.first_name.toLowerCase().includes(keyword) ||
      c.email.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "Aktif" && c.status === true) ||
      (filterStatus === "Tidak Aktif" && c.status === false);
    return matchNameOrEmail && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pelanggan</h1>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama atau email pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex flex-wrap gap-2">
          <ImportExportButton
            onImport={handleImport}
            onExport={handleExport}
            isExporting={isExporting}
          />

          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
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
          <div>
            <table className="w-full text-sm" suppressHydrationWarning>
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Salutation</th>
                  <th className="px-4 py-2">Job Title</th>
                  <th className="px-4 py-2">Kontak</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Alamat</th>
                  <th className="px-4 py-2">Kode Pos</th>
                  <th className="px-4 py-2">Latitude</th>
                  <th className="px-4 py-2">Longitude</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="text-center p-4 text-muted-foreground"
                    >
                      Memuat data pelanggan...
                    </td>
                  </tr>
                ) : (
                  <>
                    {filtered.map((c, index) => (
                      <tr key={c.id} className="border-t">
                        <td className="px-4 py-2">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-4 py-2">
                          {c.first_name} {c.last_name}
                        </td>
                        <td className="px-4 py-2">{c.salutation ?? "-"}</td>
                        <td className="px-4 py-2">{c.job_title ?? "-"}</td>
                        <td className="px-4 py-2">{c.phone}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.address}</td>
                        <td className="px-4 py-2">{c.postal_code ?? "-"}</td>
                        <td className="px-4 py-2">{c.latitude ?? "-"}</td>
                        <td className="px-4 py-2">{c.longitude ?? "-"}</td>
                        <td className="px-4 py-2">
                          <Badge variant={c.status ? "success" : "destructive"}>
                            {c.status ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleEdit(c)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(c.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center p-4 text-muted-foreground"
                        >
                          Tidak ada data pelanggan.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        {/* PAGINATION */}
        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              disabled={page >= lastPage}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
            >
              Berikutnya
            </Button>
          </div>
        </div>
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
