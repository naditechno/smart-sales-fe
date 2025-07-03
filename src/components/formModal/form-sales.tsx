"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sales } from "@/types/sales";
import { useState } from "react";
import {
  useGetAllCoordinatorsQuery,
  useGetUnassignedSalesQuery,
} from "@/services/reference.service";
import { Combobox } from "@/components/ui/combo-box";

interface SalesFormProps {
  form: Partial<Sales>;
  setForm: (form: Partial<Sales>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function SalesForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: SalesFormProps) {
  const [isEdit] = useState(!!form.sales_id);
  const [salesSearch, setSalesSearch] = useState("");
  const [coordinatorSearch, setCoordinatorSearch] = useState("");

  const {
    data: salesData = [],
    isLoading: loadingSales,
    isError: errorSales,
  } = useGetUnassignedSalesQuery(
    salesSearch.length >= 2
      ? { search: salesSearch, paginate: 10 }
      : { search: "", paginate: 10 }
  );

  const {
    data: coordinatorData = [],
    isLoading: loadingCoordinators,
    isError: errorCoordinators,
  } = useGetAllCoordinatorsQuery(
    coordinatorSearch.length >= 2
      ? { search: coordinatorSearch, paginate: 10 }
      : { search: "", paginate: 10 }
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Sales" : "Tambah Sales"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* SALES COMBOBOX */}
        <div className="flex flex-col gap-y-1">
          <Label>Sales</Label>
          <Combobox
            value={form.sales_id ?? null}
            onChange={(id) => setForm({ ...form, sales_id: id })}
            onSearchChange={setSalesSearch}
            data={salesData}
            isLoading={loadingSales}
            placeholder="Pilih Sales"
            getOptionLabel={(s) => `${s.name} (${s.email})`}
          />
          {errorSales && (
            <p className="text-red-500 text-sm mt-1">
              Gagal memuat data sales.
            </p>
          )}
        </div>

        {/* COORDINATOR COMBOBOX */}
        <div className="flex flex-col gap-y-1">
          <Label>Koordinator</Label>
          <Combobox
            value={form.coordinator_id ?? null}
            onChange={(id) => setForm({ ...form, coordinator_id: id })}
            onSearchChange={setCoordinatorSearch}
            data={coordinatorData}
            isLoading={loadingCoordinators}
            placeholder="Pilih Koordinator"
            getOptionLabel={(c) => `${c.name} (${c.email})`}
          />
          {errorCoordinators && (
            <p className="text-red-500 text-sm mt-1">
              Gagal memuat data koordinator.
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>{isEdit ? "Perbarui" : "Simpan"}</Button>
      </div>
    </div>
  );
}
