"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";
import { WilayahKerja } from "@/types/wilayah-kerja";
import {
  useGetWilayahKerjaQuery,
  useCreateWilayahKerjaMutation,
  useUpdateWilayahKerjaMutation,
  useDeleteWilayahKerjaMutation,
} from "@/services/master/wilayahkerja.service";
import WilayahKerjaForm from "../formModal/wilayah-kerja-form";

export default function WilayahKerjaPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<WilayahKerja>>({ status: true });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetWilayahKerjaQuery({
    page,
    paginate: 10,
  });
  const [createWilayahKerja] = useCreateWilayahKerjaMutation();
  const [updateWilayahKerja] = useUpdateWilayahKerjaMutation();
  const [deleteWilayahKerja] = useDeleteWilayahKerjaMutation();

  const wilayahList = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateWilayahKerja({ id: editingId, payload: form }).unwrap();
        Swal.fire(
          "Berhasil!",
          "Data wilayah kerja berhasil diperbarui.",
          "success"
        );
      } else {
        await createWilayahKerja(form).unwrap();
        Swal.fire(
          "Berhasil!",
          "Data wilayah kerja berhasil ditambahkan.",
          "success"
        );
      }
      setForm({ status: true });
      setEditingId(null);
      closeModal();
      refetch();
    } catch (error) {
      console.error("Gagal simpan data:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (item: WilayahKerja) => {
    setForm(item);
    setEditingId(item.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteWilayahKerja(id).unwrap();
        refetch();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  const filtered = wilayahList.filter((item) => {
    const keyword = search.toLowerCase();
    const matchName = item.name.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "Aktif" && item.status === true) ||
      (filterStatus === "Tidak Aktif" && item.status === false);
    return matchName && matchStatus;
  });
  const limitWords = (text: string, maxWords = 7) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Wilayah Kerja</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama wilayah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2">
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
              setForm({ status: true });
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Wilayah
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
                        {(page - 1) * perPage + index + 1}
                      </td>
                      <td className="px-4 py-2">{item.code}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {limitWords(item.description)}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={item.status ? "success" : "destructive"}
                        >
                          {item.status ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
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
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center p-4 text-muted-foreground"
                      >
                        Tidak ada data wilayah kerja.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </CardContent>

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
          <WilayahKerjaForm
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
