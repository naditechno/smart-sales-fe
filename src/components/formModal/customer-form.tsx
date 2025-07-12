"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";

import { useGetAllSalesQuery } from "@/services/reference.service";
import { useGetWilayahKerjaQuery } from "@/services/master/wilayahkerja.service";
import { useGetBranchesQuery } from "@/services/master/cabang.service";
import { useGetBanksQuery } from "@/services/master/bank.service";
import { useGetCabangBankMitrasQuery } from "@/services/master/cabangbankmitra.service";

import FormPage1 from "../form-large/form-page1";
import FormPage2 from "../form-large/form-page2";
import { useSession } from "next-auth/react";

interface CustomerFormProps {
  form: Partial<Customer>;
  setForm: (data: Partial<Customer>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editingId: number | null;
  isLoading?: boolean;
}

export default function CustomerForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  editingId,
  isLoading = false,
}: CustomerFormProps) {
  // State untuk mengontrol halaman yang aktif
  const [currentPage, setCurrentPage] = useState<"page1" | "page2">("page1");
  const { data: session } = useSession();
  const role = session?.user?.roles?.[0]?.name || "";
  const userId = session?.user?.id || 0;

  const username = useMemo(() => {
    if (form.first_name && form.last_name) {
      return `${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}`;
    } else if (form.first_name) {
      return form.first_name.toLowerCase();
    }
    return "";
  }, [form.first_name, form.last_name]);

  const isEdit = !!editingId;

  const [wilayahKerjaSearch, setWilayahKerjaSearch] = useState("");
  const [cabangSearch, setCabangSearch] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [mitraCabangSearch, setMitraCabangSearch] = useState("");
  const [salesSearch, setSalesSearch] = useState("");

  const {
    data: wilayahKerjaResponse,
    isLoading: loadingWilayahKerja,
    isError: errorWilayahKerja,
  } = useGetWilayahKerjaQuery({
    page: 1,
    search: wilayahKerjaSearch,
    paginate: 10,
  });
  const wilayahKerjaList = wilayahKerjaResponse?.data ?? [];

  const {
    data: cabangResponse,
    isLoading: loadingCabang,
    isError: errorCabang,
  } = useGetBranchesQuery({ page: 1, search: cabangSearch, paginate: 10 });
  const cabangList = cabangResponse?.data ?? [];

  const {
    data: bankResponse,
    isLoading: loadingBanks,
    isError: errorBanks,
  } = useGetBanksQuery({ page: 1, search: bankSearch, paginate: 10 });
  const bankList = bankResponse?.data ?? [];

  const {
    data: mitraCabangResponse,
    isLoading: loadingMitraCabang,
    isError: errorMitraCabang,
  } = useGetCabangBankMitrasQuery({
    page: 1,
    search: mitraCabangSearch,
    paginate: 10,
  });
  const mitraCabangList = mitraCabangResponse?.data ?? [];

  const {
    data: salesList = [],
    isLoading: loadingSales,
    isError: errorSales,
  } = useGetAllSalesQuery({ search: salesSearch, paginate: 10 });

  const formatNumber = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === "") return "";
    const raw =
      typeof value === "number"
        ? value
        : Number(value.toString().replace(/\D/g, ""));
    if (isNaN(raw)) return "";
    return raw.toLocaleString("id-ID");
  };

  const unformatNumber = (formatted: string) => {
    return Number(formatted.replace(/\./g, ""));
  };

  return (
    <div className="p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
          </h2>
          <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
            ✕
          </Button>
        </div>

        {/* --- Navbar untuk navigasi halaman --- */}
        <div className="flex border-b border-gray-200 dark:border-zinc-700 mb-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              currentPage === "page1"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setCurrentPage("page1")}
          >
            Informasi Dasar
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              currentPage === "page2"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setCurrentPage("page2")}
          >
            Informasi Pinjaman & Status
          </button>
        </div>

        {/* --- Konten Form Berdasarkan Halaman yang Aktif --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPage === "page1" && (
            <FormPage1
              form={form}
              setForm={setForm}
              username={username}
              role={role}
              userId={userId}
              wilayahKerjaList={wilayahKerjaList}
              loadingWilayahKerja={loadingWilayahKerja}
              errorWilayahKerja={errorWilayahKerja}
              setWilayahKerjaSearch={setWilayahKerjaSearch}
              cabangList={cabangList}
              loadingCabang={loadingCabang}
              errorCabang={errorCabang}
              setCabangSearch={setCabangSearch}
              bankList={bankList}
              loadingBanks={loadingBanks}
              errorBanks={errorBanks}
              setBankSearch={setBankSearch}
              mitraCabangList={mitraCabangList}
              loadingMitraCabang={loadingMitraCabang}
              errorMitraCabang={errorMitraCabang}
              setMitraCabangSearch={setMitraCabangSearch}
              salesList={salesList}
              loadingSales={loadingSales}
              errorSales={errorSales}
              setSalesSearch={setSalesSearch}
            />
          )}

          {currentPage === "page2" && (
            <FormPage2
              form={form}
              setForm={setForm}
              formatNumber={formatNumber}
              unformatNumber={unformatNumber}
            />
          )}
        </div>

        {/* --- Tombol Aksi --- */}
        <div className="pt-4 flex justify-end gap-2 col-span-1 md:col-span-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : isEdit ? "Perbarui" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
