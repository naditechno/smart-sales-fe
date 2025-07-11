"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { CabangBankMitra } from "@/types/cabangbankmitra";
import { useGetBranchesQuery } from "@/services/master/cabang.service";
import { useGetBanksQuery } from "@/services/master/bank.service";
import { Branch } from "@/types/branch";
import { Bank } from "@/types/bank";
import { Textarea } from "../ui/textarea";

interface BankMitraFormProps {
  form: Partial<CabangBankMitra>;
  setForm: (form: Partial<CabangBankMitra>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function BankMitraForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false,
}: BankMitraFormProps) {
  const isEdit = !!form?.id;

  const [bankSearch, setBankSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");

  const {
    data: bankResponse,
    isLoading: loadingBank,
    isError: errorBank,
  } = useGetBanksQuery({ page: 1, paginate: 10, search: bankSearch });

  const banks: Bank[] = bankResponse?.data ?? [];

  const {
    data: branchResponse,
    isLoading: loadingBranch,
    isError: errorBranch,
  } = useGetBranchesQuery({ page: 1, paginate: 10, search: branchSearch });

  const branches: Branch[] = branchResponse?.data ?? [];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Cabang Bank Mitra" : "Tambah Cabang Bank Mitra"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Kode */}
        <div className="flex flex-col gap-y-1">
          <Label>Kode</Label>
          <Input
            value={form.code ?? ""}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>

        {/* Nama */}
        <div className="flex flex-col gap-y-1">
          <Label>Nama</Label>
          <Input
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Cabang */}
        <div className="flex flex-col gap-y-1">
          <Label>Cabang</Label>
          <Combobox
            value={form.cabang_id ?? null}
            onChange={(id) => setForm({ ...form, cabang_id: id })}
            onSearchChange={setBranchSearch}
            data={branches}
            isLoading={loadingBranch}
            placeholder={loadingBranch ? "Memuat..." : "Pilih Cabang"}
            getOptionLabel={(c: Branch) => `${c.code} - ${c.name}`}
          />
          {errorBranch && (
            <p className="text-sm text-red-500 mt-1">Gagal memuat cabang.</p>
          )}
        </div>

        {/* Bank */}
        <div className="flex flex-col gap-y-1">
          <Label>Bank</Label>
          <Combobox
            value={form.bank_id ?? null}
            onChange={(id) => setForm({ ...form, bank_id: id })}
            onSearchChange={setBankSearch}
            data={banks}
            isLoading={loadingBank}
            placeholder={loadingBank ? "Memuat..." : "Pilih Bank"}
            getOptionLabel={(b: Bank) => `${b.code} - ${b.name}`}
          />
          {errorBank && (
            <p className="text-sm text-red-500 mt-1">Gagal memuat bank.</p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            value={form.status ? "1" : "0"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "1" })
            }
            className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <option value="1">Aktif</option>
            <option value="0">Tidak Aktif</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
