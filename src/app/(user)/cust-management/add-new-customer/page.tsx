"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomerForm from "@/components/formModal/customer-form";
import { SiteHeader } from "@/components/site-header";
import { Customer } from "@/types/customer";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
} from "@/services/customer.service";
import Swal from "sweetalert2";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface ValidationErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === "object" && error != null && "message" in error;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const editingId = idParam ? parseInt(idParam) : null;

  const [form, setForm] = useState<Partial<Customer>>({
    status: true,
    customer_file_flag: true,
    attachment_form_flag: true,
    mutation_flag: true,
  });

  const { refetch } = useGetCustomersQuery({ page: 1, paginate: 10 });
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();

  const { data: editingCustomer, isLoading: isLoadingCustomer } =
    useGetCustomerByIdQuery(editingId!, {
      skip: editingId === null,
    });

  useEffect(() => {
    if (editingCustomer && editingId !== null) {
      setForm({
        // Field utama
        first_name: editingCustomer.first_name,
        last_name: editingCustomer.last_name,
        salutation: editingCustomer.salutation,
        job_title: editingCustomer.job_title,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        postal_code: editingCustomer.postal_code,
        latitude: editingCustomer.latitude,
        longitude: editingCustomer.longitude,
        status: editingCustomer.status ?? true,

        // Relasi ID
        wilayah_kerja_id: editingCustomer.wilayah_kerja_id,
        cabang_id: editingCustomer.cabang_id,
        bank_id: editingCustomer.bank_id,
        cabang_bank_mitra_id: editingCustomer.cabang_bank_mitra_id,
        sales_id: editingCustomer.sales_id,

        // Info pinjaman
        reference_date: editingCustomer.reference_date,
        disbursement_date: editingCustomer.disbursement_date,
        cif: editingCustomer.cif,
        loan_account_number: editingCustomer.loan_account_number,
        plafond: editingCustomer.plafond,
        remaining_loan: editingCustomer.remaining_loan,
        net_receipt: editingCustomer.net_receipt,
        time_period: editingCustomer.time_period,
        loan_type: editingCustomer.loan_type,
        loan_product: editingCustomer.loan_product,
        rm_name: editingCustomer.rm_name,
        payrol: editingCustomer.payrol,

        // File di-reset (tidak diisi dari API)
        disbursement_files: null,
        attacthment_form: null,
        mutation_files: null,

        // Flag boolean
        customer_file_flag: editingCustomer.customer_file_flag ?? true,
        attachment_form_flag: editingCustomer.attachment_form_flag ?? true,
        mutation_flag: editingCustomer.mutation_flag ?? true,
      });
    }
  }, [editingCustomer, editingId]);
  

  const handleSubmit = async () => {
    const requiredFiles = [
      { field: "disbursement_files", label: "File Pencairan" },
      { field: "attacthment_form", label: "File Lampiran Form Flagging" },
      { field: "mutation_files", label: "Form Mutasi" },
    ];

    // Cek hanya saat create (bukan edit)
    if (!editingId) {
      const missingFiles = requiredFiles.filter(
        (file) => !form[file.field as keyof Customer]
      );

      if (missingFiles.length > 0) {
        const missingFileNames = missingFiles.map((f) => f.label).join(", ");
        Swal.fire({
          title: "File Required",
          text: `Please upload the following required files: ${missingFileNames}`,
          icon: "warning",
        });
        return;
      }
    }

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        const typedKey = key as keyof Customer;

        // File fields (hanya jika File)
        if (
          typedKey === "disbursement_files" ||
          typedKey === "attacthment_form" ||
          typedKey === "mutation_files"
        ) {
          if (value instanceof File) {
            formData.append(typedKey, value);
          }
        } else {
          // Kirim semua field lain, meskipun kosong
          let stringValue: string;

          if (typeof value === "boolean") {
            stringValue = value ? "1" : "0";
          } else if (typeof value === "number") {
            stringValue = value.toString();
          } else if (typeof value === "string") {
            stringValue = value;
          } else if (value === null || value === undefined) {
            stringValue = ""; 
          } else {
            stringValue = String(value);
          }

          formData.append(typedKey, stringValue);
        }
      });
      
      if (editingId !== null) {
        await updateCustomer({ id: editingId, payload: formData }).unwrap();
        Swal.fire("Success", "Customer updated successfully.", "success");
      } else {
        await createCustomer(formData).unwrap();
        Swal.fire("Success", "Customer added successfully.", "success");
      }

      setForm({
        status: true,
        customer_file_flag: true,
        attachment_form_flag: true,
        mutation_flag: true,
      });

      refetch();
      router.push("/cust-management");
    } catch (error) {
      console.error("Gagal simpan data:", error);

      if (isFetchBaseQueryError(error)) {
        const errorData = error.data as ValidationErrorResponse;

        if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join("\n");
          Swal.fire({
            title: "Validation Error",
            text: errorMessages,
            icon: "error",
          });
        } else if (errorData?.message) {
          Swal.fire({
            title: "Error",
            text: errorData.message,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `Request failed with status ${error.status}`,
            icon: "error",
          });
        }
      } else if (isSerializedError(error)) {
        Swal.fire({
          title: "Error",
          text: error.message || "An error occurred",
          icon: "error",
        });
      } else {
        Swal.fire("Error", "Failed to save customer data.", "error");
      }
    }
  };

  const handleCancel = () => {
    router.push("/cust-management");
  };

  return (
    <>
      <SiteHeader
        title={`Manajemen Customer ${
          editingId ? `(Edit Customer ID ${editingId})` : "(Add New Customer)"
        }`}
      />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          {!editingId || (editingId && !isLoadingCustomer) ? (
            <CustomerForm
              form={form}
              setForm={setForm}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              editingId={editingId}
            />
          ) : (
            <div className="text-center p-6">Memuat data pelanggan...</div>
          )}
        </div>
      </div>
    </>
  );
}
