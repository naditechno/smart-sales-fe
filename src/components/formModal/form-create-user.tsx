"use client";
import { useEffect, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetRolesQuery,
} from "@/services/users.service";

interface FormCreateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // data user yang akan diedit (jika ada)
}

export default function FormCreateUser({
  onClose,
  onSuccess,
  initialData,
}: FormCreateUserProps) {
  const isEdit = Boolean(initialData?.id); // true jika edit

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "sales",
    password: "",
    password_confirmation: "",
  });

  const { data: roles = [] } = useGetRolesQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const isLoading = creating || updating;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || "sales",
        password: "",
        password_confirmation: "",
      });
    }
  }, [initialData]);

  const roleNameToId: Record<string, number> = Object.fromEntries(
    roles.map((r: any) => [r.name, r.id])
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        role_id: roleNameToId[form.role],
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: 1,
      };

      if (form.password) {
        Object.assign(payload, {
          password: form.password,
          password_confirmation: form.password_confirmation,
        });
      }

      if (isEdit && initialData?.id) {
        await updateUser({
          id: initialData.id,
          payload,
        }).unwrap();
      } else {
        await createUser(payload as any).unwrap();
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.data?.message || error.error || "Terjadi kesalahan");
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
                {roles.map((r: any) => (
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
