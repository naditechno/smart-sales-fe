"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";
import BankForm from "../formModal/bank-form";
import { Bank } from "@/types/bank";
import {
  useGetBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} from "@/services/master/bank.service";

export default function BankPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<Bank>>({ status: true });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetBanksQuery({ page, paginate: 10 });
  const [createBank] = useCreateBankMutation();
  const [updateBank] = useUpdateBankMutation();
  const [deleteBank] = useDeleteBankMutation();

  const banks = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateBank({ id: editingId, payload: form }).unwrap();
        Swal.fire("Berhasil!", "Data bank berhasil diperbarui.", "success");
      } else {
        await createBank(form).unwrap();
        Swal.fire("Berhasil!", "Data bank berhasil ditambahkan.", "success");
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

  const handleEdit = (bank: Bank) => {
    setForm(bank);
    setEditingId(bank.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data bank yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBank(id).unwrap();
        refetch();
        Swal.fire("Terhapus!", "Data bank berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus bank:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  const filtered = banks.filter((b) => {
    const keyword = search.toLowerCase();
    const matchName = b.name.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "Aktif" && b.status === true) ||
      (filterStatus === "Tidak Aktif" && b.status === false);
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
      <h1 className="text-2xl font-bold">Bank</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama bank..."
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
            + Tambah Bank
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data bank...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((b, index) => (
                    <tr key={b.id} className="border-t">
                      <td className="px-4 py-2 flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(b.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                      <td className="px-4 py-2">
                        {(page - 1) * perPage + index + 1}
                      </td>
                      <td className="px-4 py-2">{b.code}</td>
                      <td className="px-4 py-2">{b.name}</td>
                      <td className="px-4 py-2">{limitWords(b.description)}</td>
                      <td className="px-4 py-2">
                        <Badge variant={b.status ? "success" : "destructive"}>
                          {b.status ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center p-4 text-muted-foreground"
                      >
                        Tidak ada data bank.
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
          <BankForm
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
