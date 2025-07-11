"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/customer";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
  useImportCustomerMutation,
  useExportCustomerMutation,
} from "@/services/customer.service";
import ImportExportButton from "./ui/button-excel";
import { getFileURL } from "@/lib/storage";
import Swal from "sweetalert2";

export default function CustomerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, refetch } = useGetCustomersQuery({
    page,
    paginate: 10,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();
  const [importCustomer] = useImportCustomerMutation();
  const [exportCustomer] = useExportCustomerMutation();

  const customers = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleEdit = (c: Customer) => {
    router.push(`/cust-management/add-new-customer?id=${c.id}`);
  };

  const handleAddCustomer = () => {
    router.push(`/cust-management/add-new-customer`);
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
    const matchName = `${c.first_name} ${c.last_name}`
      .toLowerCase()
      .includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "Aktif" && c.status === true) ||
      (filterStatus === "Tidak Aktif" && c.status === false);
    return matchName && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pelanggan</h1>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama pelanggan..."
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
          <Button onClick={handleAddCustomer}>+ Tambah Pelanggan</Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2 whitespace-nowrap">Nama Lengkap</th>
                <th className="px-4 py-2">Salutation</th>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telepon</th>
                <th className="px-4 py-2">Alamat</th>
                <th className="px-4 py-2 whitespace-nowrap">Kode Pos</th>
                <th className="px-4 py-2">Latitude</th>
                <th className="px-4 py-2">Longitude</th>
                <th className="px-4 py-2 whitespace-nowrap">Wilayah Kerja</th>
                <th className="px-4 py-2">Cabang</th>
                <th className="px-4 py-2">Bank</th>
                <th className="px-4 py-2 whitespace-nowrap">
                  Cabang Bank Mitra
                </th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2 whitespace-nowrap">
                  Tanggal Referensi
                </th>
                <th className="px-4 py-2 whitespace-nowrap">Tanggal Cair</th>
                <th className="px-4 py-2">CIF</th>
                <th className="px-4 py-2">No Rekening</th>
                <th className="px-4 py-2">Plafond</th>
                <th className="px-4 py-2 whitespace-nowrap">Sisa Pinjaman</th>
                <th className="px-4 py-2 whitespace-nowrap">Jangka Waktu</th>
                <th className="px-4 py-2 whitespace-nowrap">Terima Bersih</th>
                <th className="px-4 py-2 whitespace-nowrap">Jenis Pinjaman</th>
                <th className="px-4 py-2 whitespace-nowrap">Jenis Produk</th>
                <th className="px-4 py-2 whitespace-nowrap">Nama RM</th>
                <th className="px-4 py-2 whitespace-nowrap">File Pencairan</th>
                <th className="px-4 py-2 whitespace-nowrap">Customer Flag</th>
                <th className="px-4 py-2 whitespace-nowrap">Attachment Form</th>
                <th className="px-4 py-2 whitespace-nowrap">
                  Attachment Form Flag
                </th>
                <th className="px-4 py-2">Mutasi</th>
                <th className="px-4 py-2 whitespace-nowrap">File Mutasi</th>
                <th className="px-4 py-2 whitespace-nowrap">Juru Bayar</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={35}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data pelanggan...
                  </td>
                </tr>
              ) : (
                filtered.map((c, index) => (
                  <tr key={index} className="border-t">
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
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2">{(page - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{`${c.first_name} ${c.last_name}`}</td>
                    <td className="px-4 py-2">{c.salutation}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.job_title}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.phone}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.address
                        ? c.address.split(" ").slice(0, 6).join(" ") +
                          (c.address.split(" ").length > 6 ? "..." : "")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.postal_code}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.latitude}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.longitude}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.wilayah_kerja_name}
                    </td>
                    <td className="px-4 py- whitespace-nowrap">
                      {c.cabang_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.bank_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.cabang_bank_mitra_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.sales_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.reference_date
                        ? new Date(c.reference_date).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.disbursement_date
                        ? new Date(c.disbursement_date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">{c.cif}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.loan_account_number}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rp{c.plafond?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rp{c.remaining_loan?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rp{c.net_receipt?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.time_period} bulan
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.loan_type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.loan_product}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.rm_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getFileURL(c.disbursement_files) ? (
                        <a
                          href={getFileURL(c.disbursement_files)}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.customer_file_flag ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getFileURL(c.attacthment_form) ? (
                        <a
                          href={getFileURL(c.attacthment_form)}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.attachment_form_flag ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {c.mutation_flag ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getFileURL(c.mutation_files) ? (
                        <a
                          href={getFileURL(c.mutation_files)}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.payrol}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={c.status ? "success" : "destructive"}>
                        {c.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
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
    </div>
  );
}
