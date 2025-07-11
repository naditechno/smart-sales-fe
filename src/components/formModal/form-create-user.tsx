"use client";
import { useEffect, useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetRolesQuery,
} from "@/services/users.service";
import { User, Role, CreateUserPayload } from "@/types/user";
import Swal from "sweetalert2";
import { Combobox } from "@/components/ui/combo-box";
import { useGetSalesCategoriesQuery } from "@/services/master/salescategory.service";
import { useGetSalesTypesQuery } from "@/services/master/salestype.service";

interface FormCreateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: User;
}

export default function FormCreateUser({
  onClose,
  onSuccess,
  initialData,
}: FormCreateUserProps) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "sales",
    password: "",
    password_confirmation: "",
  });

  const [salesCategoryId, setSalesCategoryId] = useState<number | null>(null);
  const [salesTypeId, setSalesTypeId] = useState<number | null>(null);

  const { data: roles = [] } = useGetRolesQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { data: salesCategoryResult, isLoading: loadingCategory } =
    useGetSalesCategoriesQuery({ page: 1, paginate: 9999 });

  const { data: salesTypeResult, isLoading: loadingType } =
    useGetSalesTypesQuery({ page: 1, paginate: 9999 });

  const salesCategories = salesCategoryResult?.data || [];
  const salesTypes = salesTypeResult?.data || [];

  const isLoading = creating || updating;

  useEffect(() => {
    if (!initialData || roles.length === 0) return;

    const selectedRole =
      roles.find((r) => r.id === initialData.role_id)?.name || "sales";

    setForm({
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      role: selectedRole,
      password: "",
      password_confirmation: "",
    });

    setSalesCategoryId(initialData.sales_category_id || null);
    setSalesTypeId(initialData.sales_type_id || null);
  }, [initialData, roles]);

  const roleNameToId = useMemo(() => {
    return Object.fromEntries(roles.map((r: Role) => [r.name, r.id]));
  }, [roles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roleId = roleNameToId[form.role];
    if (!roleId) {
      await Swal.fire({
        icon: "warning",
        title: "Peran tidak valid",
        text: "Silakan pilih peran yang benar.",
      });
      return;
    }

    if (!salesCategoryId || !salesTypeId) {
      await Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap",
        text: "Pilih kategori dan tipe sales terlebih dahulu.",
      });
      return;
    }

    try {
      const payload: CreateUserPayload = {
        role_id: roleId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
        sales_category_id: salesCategoryId,
        sales_type_id: salesTypeId,
        status: 1,
      };

      if (isEdit && initialData?.id) {
        await updateUser({
          id: initialData.id,
          payload,
        }).unwrap();
        await Swal.fire(
          "Berhasil",
          "Data pengguna berhasil diperbarui.",
          "success"
        );
      } else {
        await createUser(payload).unwrap();
        await Swal.fire(
          "Berhasil",
          "Data pengguna berhasil ditambahkan.",
          "success"
        );
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error && "data" in error) {
        const err = error as { data?: { message?: string }; error?: string };
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.data?.message || err.error || "Terjadi kesalahan",
        });
      } else {
        await Swal.fire("Gagal", "Terjadi kesalahan", "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["name", "email", "phone"] as const).map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize text-sm">
                  {field === "name"
                    ? "Nama"
                    : field === "email"
                    ? "Email"
                    : "Telepon"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-neutral-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            ))}
            <div>
              <label className="block mb-1 text-sm">Peran</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-neutral-700 border-gray-300 dark:border-gray-600"
              >
                {roles.map((r: Role) => (
                  <option key={r.id} value={r.name}>
                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Kata Sandi</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isEdit ? "Kosongkan jika tidak diubah" : ""}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-neutral-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Konfirmasi Sandi</label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder={isEdit ? "Kosongkan jika tidak diubah" : ""}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-neutral-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Kategori Sales</label>
              <Combobox
                value={salesCategoryId}
                onChange={setSalesCategoryId}
                data={salesCategories}
                isLoading={loadingCategory}
                placeholder="Pilih Kategori Sales"
                getOptionLabel={(item) => item.name}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Tipe Sales</label>
              <Combobox
                value={salesTypeId}
                onChange={setSalesTypeId}
                data={salesTypes}
                isLoading={loadingType}
                placeholder="Pilih Tipe Sales"
                getOptionLabel={(item) => item.name}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-700 text-sm disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
