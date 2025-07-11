"use client";

import { useEffect, useState } from "react";
import {
  useCreateSalesTargetFundingMutation,
  useUpdateSalesTargetFundingMutation,
  useGetSalesTargetFundingByIdQuery,
} from "@/services/coordinator/salestarget.service";
import {
  useGetAllCoordinatorsQuery,
  useGetSalesByCoordinatorIdQuery,
} from "@/services/reference.service";
import { useGetFundingProductsQuery } from "@/services/product-services/fundingproduct.service";
import { SalesTargetFunding } from "@/types/sales";
import Swal from "sweetalert2";
import { Combobox } from "@/components/ui/combo-box";
import { FundingProduct } from "@/types/sales-manage";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button } from "../ui/button";
import { formatRupiah, parseRupiah } from "@/lib/format-utils";

interface FormSalesTargetFundingProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SalesTargetFunding;
}

export default function FormSalesTargetFunding({
  onClose,
  onSuccess,
  initialData,
}: FormSalesTargetFundingProps) {
  const isEdit = Boolean(initialData);
  const [coordinatorId, setCoordinatorId] = useState<number | null>(null);
  const [salesId, setSalesId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [details, setDetails] = useState<
    { funding_product_id: number; target: number }[]
  >([]);

  const { data: coordinators = [] } = useGetAllCoordinatorsQuery({
    search: "",
    paginate: 100,
  });

  const { data: sales = [] } = useGetSalesByCoordinatorIdQuery(
    coordinatorId ? { id: coordinatorId, search: "" } : skipToken
  );

  const { data: fundingProductResponse } = useGetFundingProductsQuery({
    search: "",
    page: 1,
    paginate: 100,
  });

  const fundingProducts = fundingProductResponse?.data ?? [];

  const [create, { isLoading: creating }] =
    useCreateSalesTargetFundingMutation();
  const [update, { isLoading: updating }] =
    useUpdateSalesTargetFundingMutation();

  // ✅ Get details from API by ID only when editing
  const { data: fullDetail, isSuccess: isFullDetailSuccess } =
    useGetSalesTargetFundingByIdQuery(initialData?.id ?? skipToken);

  useEffect(() => {
    if (initialData && isFullDetailSuccess && fullDetail) {
      setCoordinatorId(fullDetail.coordinator_id);
      setSalesId(fullDetail.sales_id);

      setDate(fullDetail.date.slice(0, 10));

      // ✅ Ambil details dari API get by id
      setDetails(
        fullDetail.details?.map((d) => ({
          funding_product_id: d.funding_product_id,
          target: d.target,
        })) || []
      );
    }
  }, [initialData, isFullDetailSuccess, fullDetail]);

  const handleDetailChange = (
    index: number,
    field: "funding_product_id" | "target",
    value: string | number
  ) => {
    setDetails((prev) => {
      const updated = [...prev];
      const parsedValue = typeof value === "string" ? parseInt(value) : value;

      if (field === "funding_product_id") {
        updated[index].funding_product_id = parsedValue;
      } else {
        updated[index].target = parsedValue;
      }

      return updated;
    });
  };

  const handleAddDetail = () => {
    setDetails((prev) => [...prev, { funding_product_id: 0, target: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordinatorId || !salesId || !date || details.length === 0) {
      Swal.fire("Error", "Lengkapi seluruh data terlebih dahulu.", "warning");
      return;
    }

    const payload = {
      coordinator_id: coordinatorId,
      sales_id: salesId,
      date,
      details,
    };

    try {
      if (isEdit && initialData) {
        await update({ id: initialData.id, payload }).unwrap();
        Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      } else {
        await create(payload).unwrap();
        Swal.fire("Berhasil", "Data berhasil ditambahkan", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      Swal.fire("Gagal", error?.data?.message ?? "Terjadi kesalahan", "error");
    }
  };
  

  const isLoading = creating || updating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit
            ? "Edit Target Sales Pendanaan"
            : "Tambah Target Sales Pendanaan"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Koordinator</label>
              <Combobox
                data={coordinators}
                value={coordinatorId}
                onChange={setCoordinatorId}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Koordinator"
              />
            </div>
            <div>
              <label className="text-sm">Sales</label>
              <Combobox
                data={sales}
                value={salesId}
                onChange={setSalesId}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Sales"
                isLoading={!coordinatorId}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          <hr className="col-span-2"/>

          <div>
            <label className="block text-sm mb-2">Detail Target Produk</label>
            {details?.map((detail, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <select
                  value={detail.funding_product_id}
                  onChange={(e) =>
                    handleDetailChange(
                      index,
                      "funding_product_id",
                      e.target.value
                    )
                  }
                  className="col-span-6 border rounded px-2 py-1 bg-white dark:bg-neutral-800"
                >
                  <option value={0} disabled>
                    Pilih Produk
                  </option>
                  {fundingProducts.map((product: FundingProduct) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formatRupiah(detail.target)}
                  onChange={(e) => {
                    const parsed = parseRupiah(e.target.value);
                    if (!isNaN(parsed)) {
                      handleDetailChange(index, "target", parsed);
                    }
                  }}
                  placeholder="Target"
                  className="col-span-4 border rounded px-2 py-1 bg-white dark:bg-neutral-800"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                  className="col-span-2 bg-red-500 text-white rounded px-2 py-1 text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
            <Button
              variant="default"
              type="button"
              onClick={handleAddDetail}
              className="mt-2"
            >
              + Tambah Detail
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 text-sm disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}