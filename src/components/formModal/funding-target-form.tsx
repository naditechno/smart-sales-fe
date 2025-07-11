"use client";

import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetSalesCategoriesQuery } from "@/services/master/salescategory.service";
import { FundingProductTarget } from "@/types/sales-manage";
import { useRef } from "react";
import { formatRupiah, parseRupiah } from "@/lib/format-utils";
import { SalesCategory } from "@/types/salescategory"; 

interface FundingTargetFormProps {
  form: Partial<FundingProductTarget>;
  setForm: (form: Partial<FundingProductTarget>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

export default function FundingTargetForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isEdit,
}: FundingTargetFormProps) {
  const { data: salesCategoryResult, isLoading: loadingSalesCat } =
    useGetSalesCategoriesQuery({ page: 1, paginate: 9999 });

  const salesCategories: SalesCategory[] = salesCategoryResult?.data || [];

  const minTargetRef = useRef<HTMLInputElement>(null);
  const maxTargetRef = useRef<HTMLInputElement>(null);

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "min_target" | "max_target"
  ) => {
    const raw = e.target.value;
    const number = parseRupiah(raw);
    setForm({ ...form, [field]: number });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Target Produk Funding" : "Tambah Target Produk Funding"}
      </h2>

      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="col-span-4">
          <label className="text-sm">Kategori Sales</label>
          <Combobox
            value={form.sales_category_id ?? null}
            onChange={(id) => setForm({ ...form, sales_category_id: id })}
            data={salesCategories}
            isLoading={loadingSalesCat}
            placeholder="Pilih Kategori Sales"
            getOptionLabel={(item) => item.name}
          />
        </div>
      </div>

      <hr className="my-6" />

      {/* Detail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hidden Funding Product */}
        <Input
          type="hidden"
          name="funding_product_id"
          value={form.funding_product_id ?? ""}
        />

        <div>
          <label className="text-sm">Target Minimal</label>
          <Input
            ref={minTargetRef}
            name="min_target"
            value={
              form.min_target !== undefined ? formatRupiah(form.min_target) : ""
            }
            onChange={(e) => handleCurrencyChange(e, "min_target")}
            className="mt-1"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm">Target Maksimal</label>
          <Input
            ref={maxTargetRef}
            name="max_target"
            value={
              form.max_target !== undefined ? formatRupiah(form.max_target) : ""
            }
            onChange={(e) => handleCurrencyChange(e, "max_target")}
            className="mt-1"
            inputMode="numeric"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm">Status</label>
          <select
            value={form.status === false ? "0" : "1"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "1" })
            }
            className="mt-1 w-full border rounded px-3 py-2 bg-background"
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>{isEdit ? "Update" : "Simpan"}</Button>
      </div>
    </div>
  );
}