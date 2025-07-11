import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import types from your project
import { Customer } from "@/types/customer";

interface FormPage2Props {
  form: Partial<Customer>;
  setForm: (data: Partial<Customer>) => void;
  formatNumber: (value: string | number | null | undefined) => string;
  unformatNumber: (formatted: string) => number;
}

const FormPage2: React.FC<FormPage2Props> = ({
  form,
  setForm,
  formatNumber,
  unformatNumber,
}) => {
  return (
    <>
      {/* --- Loan Info --- */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="reference_date">Tanggal Referensi</Label>
        <Input
          id="reference_date"
          type="date"
          value={form.reference_date || ""}
          onChange={(e) => setForm({ ...form, reference_date: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="disbursement_date">Tanggal Pencairan</Label>
        <Input
          id="disbursement_date"
          type="date"
          value={form.disbursement_date || ""}
          onChange={(e) =>
            setForm({ ...form, disbursement_date: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="cif">No. CIF</Label>
        <Input
          id="cif"
          value={form.cif || ""}
          onChange={(e) => setForm({ ...form, cif: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="loan_account_number">No. Rekening Pinjaman</Label>
        <Input
          id="loan_account_number"
          value={form.loan_account_number || ""}
          onChange={(e) =>
            setForm({ ...form, loan_account_number: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="plafond">Plafond</Label>
        <Input
          id="plafond"
          type="text"
          inputMode="numeric"
          value={formatNumber(form.plafond)}
          onChange={(e) =>
            setForm({ ...form, plafond: unformatNumber(e.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="remaining_loan">Sisa Pinjaman</Label>
        <Input
          id="remaining_loan"
          type="text"
          inputMode="numeric"
          value={formatNumber(form.remaining_loan)}
          onChange={(e) =>
            setForm({
              ...form,
              remaining_loan: unformatNumber(e.target.value),
            })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="net_receipt">Terima Bersih</Label>
        <Input
          id="net_receipt"
          type="text"
          inputMode="numeric"
          value={formatNumber(form.net_receipt)}
          onChange={(e) =>
            setForm({
              ...form,
              net_receipt: unformatNumber(e.target.value),
            })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="time_period">Jangka Waktu</Label>
        <Input
          id="time_period"
          type="number"
          value={form.time_period ?? ""}
          onChange={(e) =>
            setForm({ ...form, time_period: Number(e.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="loan_type">Jenis Pinjaman</Label>
        <select
          id="loan_type"
          value={form.loan_type || ""}
          onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          required
        >
          <option value="" disabled hidden>
            -- Pilih Jenis Pinjaman --
          </option>
          <option value="WN">WN (PRAPURNA)</option>
          <option value="WM">WM (PURNA)</option>
        </select>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="loan_product">Produk Pinjaman</Label>
        <Input
          id="loan_product"
          value={form.loan_product || ""}
          onChange={(e) => setForm({ ...form, loan_product: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="rm_name">Nama RM</Label>
        <Input
          id="rm_name"
          value={form.rm_name || ""}
          onChange={(e) => setForm({ ...form, rm_name: e.target.value })}
        />
      </div>

      {/* Changed to file upload */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="disbursement_files">File Pencairan (PDF)</Label>
        <Input
          id="disbursement_files"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setForm({ ...form, disbursement_files: file });
          }}
        />
        {form.disbursement_files instanceof File && (
          <p className="text-sm text-zinc-600">
            {form.disbursement_files.name}
          </p>
        )}
        {/* Display current file if it's a string (e.g., from existing data) */}
        {typeof form.disbursement_files === "string" &&
          form.disbursement_files && (
            <p className="text-sm text-zinc-600">
              Current file:{" "}
              <a
                href={form.disbursement_files}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Link
              </a>
            </p>
          )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="payrol">Juru Bayar</Label>
        <Input
          id="payrol"
          value={form.payrol || ""}
          onChange={(e) => setForm({ ...form, payrol: e.target.value })}
        />
      </div>

      {/* --- Flags --- */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="customer_file_flag">
          Apakah Berkas Nasabah Sudah di Flagging?
        </Label>
        <select
          id="customer_file_flag"
          value={form.customer_file_flag ? "true" : "false"}
          onChange={(e) =>
            setForm({
              ...form,
              customer_file_flag: e.target.value === "true",
            })
          }
          className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
        >
          <option value="true">Sudah Terflagging</option>
          <option value="false">Belum Terflagging</option>
        </select>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="attachment_form_flag">
          Status Lampiran Form Flagging
        </Label>
        <select
          id="attachment_form_flag"
          value={form.attachment_form_flag ? "true" : "false"}
          onChange={(e) =>
            setForm({
              ...form,
              attachment_form_flag: e.target.value === "true",
            })
          }
          className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
        >
          <option value="true">Ada Lampiran</option>
          <option value="false">Tidak Ada Lampiran</option>
        </select>
      </div>

      {/* Changed to file upload */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="attacthment_form">
          File Lampiran Form Flagging (PDF)
        </Label>
        <Input
          id="attacthment_form"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setForm({ ...form, attacthment_form: file });
          }}
        />
        {form.attacthment_form instanceof File && (
          <p className="text-sm text-zinc-600">{form.attacthment_form.name}</p>
        )}
        {typeof form.attacthment_form === "string" && form.attacthment_form && (
          <p className="text-sm text-zinc-600">
            Current file:{" "}
            <a
              href={form.attacthment_form}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Link
            </a>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="mutation_flag">Jika purna, apakah sudah mutasi?</Label>
        <select
          id="mutation_flag"
          value={form.mutation_flag ? "true" : "false"}
          onChange={(e) =>
            setForm({
              ...form,
              mutation_flag: e.target.value === "true",
            })
          }
          className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
        >
          <option value="true">Sudah Mutasi</option>
          <option value="false">Tidak Mutasi (Bukan Purna)</option>
        </select>
      </div>

      {/* Changed to file upload */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="mutation_files">
          File Mutasi (Jika Nasabah Lintas/Take Over)
        </Label>
        <Input
          id="mutation_files"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setForm({ ...form, mutation_files: file });
          }}
        />
        {form.mutation_files instanceof File && (
          <p className="text-sm text-zinc-600">{form.mutation_files.name}</p>
        )}
        {typeof form.mutation_files === "string" && form.mutation_files && (
          <p className="text-sm text-zinc-600">
            Current file:{" "}
            <a
              href={form.mutation_files}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Link
            </a>
          </p>
        )}
      </div>

      {/* --- Status --- */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          value={form.status === true ? "true" : "false"}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value === "true" })
          }
        >
          <option value="true">Aktif</option>
          <option value="false">Tidak Aktif</option>
        </select>
      </div>
    </>
  );
};

export default FormPage2;
