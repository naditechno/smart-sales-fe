"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Assignment } from "@/types/assignment";

import {
  useGetAllCoordinatorsQuery,
  useGetSalesByCoordinatorIdQuery,
} from "@/services/reference.service";
import { useGetCustomersQuery } from "@/services/customer.service";
import { User } from "@/types/user";
import { Customer } from "@/types/customer";

interface AssignmentFormProps {
  form: Partial<Assignment>;
  setForm: (form: Partial<Assignment>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function AssignmentForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false,
}: AssignmentFormProps) {
  const isEdit = !!form.id;

  const [customerSearch, setCustomerSearch] = useState("");
  const [coordinatorSearch, setCoordinatorSearch] = useState("");
  const [salesSearch, setSalesSearch] = useState("");

  const {
    data: customerResponse,
    isLoading: loadingCustomers,
    isError: errorCustomer,
  } = useGetCustomersQuery({
    page: 1,
    paginate: 10,
    search: customerSearch || "",
  });

  const customers: Customer[] = customerResponse?.data ?? [];

  const {
    data: coordinators = [],
    isLoading: loadingCoordinators,
    isError: errorCoordinator,
  } = useGetAllCoordinatorsQuery({
    search: coordinatorSearch || "",
    paginate: 10,
  });

  const {
    data: sales = [],
    isLoading: loadingSales,
    isError: errorSales,
  } = useGetSalesByCoordinatorIdQuery(
    {
      id: form.coordinator_id!,
      search: salesSearch || "",
    },
    { skip: !form.coordinator_id }
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Assignment" : "Tambah Assignment"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Customer Combobox */}
        <div className="flex flex-col gap-y-1">
          <Label>Customer</Label>
          <Combobox
            value={form.customer_id ?? null}
            onChange={(id) => setForm({ ...form, customer_id: id })}
            onSearchChange={setCustomerSearch}
            data={customers}
            isLoading={loadingCustomers}
            placeholder={loadingCustomers ? "Loading..." : "Pilih Customer"}
            getOptionLabel={(c: Customer) =>
              `${c.first_name} ${c.last_name} (${c.email})`
            }
          />
          {errorCustomer && (
            <p className="text-sm text-red-500 mt-1">
              Gagal memuat data customer.
            </p>
          )}
        </div>

        {/* Coordinator Combobox */}
        <div className="flex flex-col gap-y-1">
          <Label>Koordinator</Label>
          <Combobox
            value={form.coordinator_id ?? null}
            onChange={(id) =>
              setForm({ ...form, coordinator_id: id, sales_id: undefined })
            }
            onSearchChange={setCoordinatorSearch}
            data={coordinators}
            isLoading={loadingCoordinators}
            placeholder={
              loadingCoordinators ? "Loading..." : "Pilih Koordinator"
            }
            getOptionLabel={(u: User) => `${u.name} (${u.email})`}
          />
          {errorCoordinator && (
            <p className="text-sm text-red-500 mt-1">
              Gagal memuat data koordinator.
            </p>
          )}
        </div>

        {/* Sales Combobox */}
        <div className="flex flex-col gap-y-1">
          <Label>Sales</Label>
          <Combobox
            value={form.sales_id ?? null}
            onChange={(id) => setForm({ ...form, sales_id: id })}
            onSearchChange={setSalesSearch}
            data={sales}
            isLoading={loadingSales}
            placeholder={loadingSales ? "Loading..." : "Pilih Sales"}
            getOptionLabel={(u: User) => `${u.name} (${u.email})`}
          />
          {errorSales && (
            <p className="text-sm text-red-500 mt-1">
              Gagal memuat data sales.
            </p>
          )}
        </div>

        {/* Assignment Date */}
        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Penugasan</Label>
          <Input
            type="date"
            value={form.assignment_date ?? ""}
            onChange={(e) =>
              setForm({ ...form, assignment_date: e.target.value })
            }
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            value={form.status ?? ""}
            onChange={(e) =>
              setForm({ ...form, status: Number(e.target.value) })
            }
            className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <option value="" disabled>
              Pilih Status
            </option>
            <option value={0}>Pending</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
