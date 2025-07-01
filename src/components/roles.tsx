"use client";
import { useEffect, useState } from "react";
import {
  useGetRolesQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "@/services/users.service"; // Sesuaikan path jika berbeda
import useModal from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Role } from "@/types/user"; // Pastikan tipe Role diimpor dengan benar
import { Button } from "@/components/ui/button"; // Sesuaikan path jika berbeda
import FormCreateRole from "@/components/formModal/form-create-role"; // Komponen modal baru

export default function RolePage() {
  const [search, setSearch] = useState("");
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
  const [roleName, setRoleName] = useState(""); // State untuk input nama peran di modal

  const { data: roles = [], isLoading, isError, refetch } = useGetRolesQuery(); // Mengambil semua peran

  const [deleteRole] = useDeleteRoleMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const { isOpen, openModal, closeModal } = useModal();

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mengisi form saat mode edit atau mereset saat mode tambah
  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.name);
    } else {
      setRoleName("");
    }
  }, [editingRole]);

  const handleAddRole = () => {
    setEditingRole(undefined); // Reset untuk mode tambah
    setRoleName(""); // Pastikan input kosong
    openModal();
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name); // Isi input dengan nama peran yang diedit
    openModal();
  };

  const handleDelete = async (role: Role) => {
    if (window.confirm(`Apakah yakin ingin menghapus peran ${role.name}?`)) {
      try {
        await deleteRole(role.id).unwrap();
        window.alert("Peran berhasil dihapus");
        refetch(); // Memuat ulang data setelah penghapusan
      } catch (err) {
        console.error("Gagal menghapus peran:", err);
        window.alert("Terjadi kesalahan saat menghapus peran");
      }
    }
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        // Mode edit
        await updateRole({
          id: editingRole.id,
          payload: { name: roleName },
        }).unwrap();
        window.alert("Peran berhasil diperbarui");
      } else {
        // Mode tambah
        await createRole({ name: roleName }).unwrap();
        window.alert("Peran berhasil ditambahkan");
      }
      refetch(); // Panggil refetch untuk memuat ulang data di halaman utama
      closeModal(); // Tutup modal
    } catch (error) {
      console.error("Gagal menyimpan peran:", error);
      window.alert("Terjadi kesalahan saat menyimpan peran");
    }
  };

  return (
    <main className="p-6 w-full mx-auto">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Data Peran</h2>
            <p className="text-sm text-muted-foreground">
              Kelola semua peran pengguna di sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Pencarian peran..."
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleAddRole}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow hover:bg-primary/90 transition"
            >
              Tambah Peran
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-auto">
          {isLoading ? (
            <p className="text-center animate-pulse py-6">
              Memuat data peran...
            </p>
          ) : isError ? (
            <p className="text-center py-6">Gagal memuat data peran!</p>
          ) : (
            <>
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                      Nama Peran
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada peran yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => (
                      <tr key={role.id}>
                        <td className="px-4 py-2 capitalize">{role.name}</td>
                        <td className="px-4 py-2 flex justify-end items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(role)}
                          >
                            Delete
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700">
                                <IconDotsVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Tambahkan opsi dropdown lainnya jika diperlukan */}
                              <DropdownMenuItem
                                onClick={() => handleEdit(role)}
                              >
                                Detail/Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <FormCreateRole
            onClose={closeModal}
            initialData={editingRole}
            roleName={roleName}
            setRoleName={setRoleName}
            onSubmit={handleSubmitRole}
            isSubmitting={isCreating || isUpdating}
          />
        </div>
      )}
    </main>
  );
}
