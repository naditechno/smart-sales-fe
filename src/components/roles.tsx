"use client";
import { useEffect, useMemo, useState } from "react";
import {
  useGetRolesQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsByRoleQuery,
  useAddPermissionToRoleMutation,
  useRevokePermissionFromRoleMutation,
} from "@/services/users.service";
import useModal from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Role } from "@/types/user";
import { Button } from "@/components/ui/button";
import FormCreateRole from "@/components/formModal/form-create-role";
import Swal from "sweetalert2";
import { skipToken } from "@reduxjs/toolkit/query";

export default function RolePage() {
  const [search, setSearch] = useState("");
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
  const [roleName, setRoleName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [localPermissions, setLocalPermissions] = useState<string[]>([]);
  const [isPermissionProcessing, setIsPermissionProcessing] = useState(false);
  const {
    data: permissionsData = [],
  } = useGetPermissionsByRoleQuery(selectedRole?.id ?? skipToken, {
    skip: !selectedRole,
  });

  useEffect(() => {
    if (selectedRole && permissionsData.length > 0) {
      setLocalPermissions(permissionsData);
    }
  }, [permissionsData, selectedRole]);  
  
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const routes = new Set<string>();
    permissionsData.forEach((perm) => {
      const [...rest] = perm.split("-");
      const route = rest.join("-");
      routes.add(route);
    });
    routes.forEach((route) => {
      groups[route] = ["view", "create", "update", "delete"];
    });
    if (routes.size === 0 && selectedRole) {
      const defaultRoutes = [
        "pulse",
        "api.v1.callback.midtrans",
        "api.v1.welcome",
      ];
      defaultRoutes.forEach((route) => {
        groups[route] = ["view", "create", "update", "delete"];
      });
    }
    return groups;
  }, [permissionsData, selectedRole]);  

  const { data: roles = [], isLoading, isError, refetch } = useGetRolesQuery();
  const [addPermissionToRole] = useAddPermissionToRoleMutation();
  const [revokePermissionFromRole] = useRevokePermissionFromRoleMutation();

  const [deleteRole] = useDeleteRoleMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const { isOpen, openModal, closeModal } = useModal();

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.name);
    } else {
      setRoleName("");
    }
  }, [editingRole]);

  const handleAddRole = () => {
    setEditingRole(undefined);
    setRoleName("");
    openModal();
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    openModal();
  };

  const handleDelete = async (role: Role) => {
    const result = await Swal.fire({
      title: `Hapus Peran "${role.name}"?`,
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(role.id).unwrap();
        await Swal.fire("Berhasil", "Peran berhasil dihapus", "success");
        refetch();
      } catch (err) {
        console.error("Gagal menghapus peran:", err);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus peran", "error");
      }
    }
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          payload: { name: roleName },
        }).unwrap();
        await Swal.fire("Berhasil", "Peran berhasil diperbarui", "success");
      } else {
        await createRole({ name: roleName }).unwrap();
        await Swal.fire("Berhasil", "Peran berhasil ditambahkan", "success");
      }
      refetch();
      closeModal();
    } catch (error) {
      console.error("Gagal menyimpan peran:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan peran", "error");
    }
  };

  const handleOpenPermissions = (role: Role) => {
    setSelectedRole(role);
  };

  // Improved toggle permission logic
  const togglePermission = async (perm: string, isCurrentlyActive: boolean) => {
    if (!selectedRole) return;
    setIsPermissionProcessing(true);

    try {
      if (isCurrentlyActive) {
        await revokePermissionFromRole({
          role: selectedRole.id,
          permission: [perm],
        }).unwrap();

        setLocalPermissions((prev) => prev.filter((p) => p !== perm));
        Swal.fire("Berhasil", "Permission berhasil dinonaktifkan", "success");
      } else {
        await addPermissionToRole({
          role: selectedRole.id,
          permission: [perm],
        }).unwrap();

        setLocalPermissions((prev) => [...prev, perm]);
        Swal.fire("Berhasil", "Permission berhasil diaktifkan", "success");
      }
    } catch (err) {
      console.error("Permission toggle failed:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengubah permission", "error");
    } finally {
      setIsPermissionProcessing(false);
    }
  };   
  
  const handleCheckAll = async () => {
    if (!selectedRole) return;
    setIsPermissionProcessing(true);

    try {
      const allPermissionsPossible = Object.entries(groupedPermissions).flatMap(
        ([route, actions]) => actions.map((action) => `${action}-${route}`)
      );

      const permissionsToAdd = allPermissionsPossible.filter(
        (perm) => !localPermissions.includes(perm)
      );

      if (permissionsToAdd.length > 0) {
        await Promise.all(
          permissionsToAdd.map((perm) =>
            addPermissionToRole({
              role: selectedRole.id,
              permission: [perm],
            }).unwrap()
          )
        );

        setLocalPermissions((prev) => [...prev, ...permissionsToAdd]);
        Swal.fire("Berhasil", "Semua permission telah diaktifkan", "success");
      } else {
        Swal.fire("Info", "Semua permission sudah aktif", "info");
      }
    } catch (err) {
      console.error("Check all failed:", err);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat mengaktifkan semua permission",
        "error"
      );
    } finally {
      setIsPermissionProcessing(false);
    }
  };
    
  // Fixed uncheck all permissions
  const handleUncheckAll = async () => {
    if (!selectedRole) return;
    setIsPermissionProcessing(true);

    try {
      if (localPermissions.length > 0) {
        await Promise.all(
          localPermissions.map((perm) =>
            revokePermissionFromRole({
              role: selectedRole.id,
              permission: [perm],
            }).unwrap()
          )
        );

        setLocalPermissions([]);
        Swal.fire(
          "Berhasil",
          "Semua permission telah dinonaktifkan",
          "success"
        );
      } else {
        Swal.fire("Info", "Tidak ada permission aktif", "info");
      }
    } catch (err) {
      console.error("Uncheck all failed:", err);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat menonaktifkan semua permission",
        "error"
      );
    } finally {
      setIsPermissionProcessing(false);
    }
  };
  
  
  return (
    <main className="p-6 w-full mx-auto">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Data Peran</h2>
            <p className="text-sm text-muted-foreground">
              Kelola semua peran pengguna di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                      No
                    </th>
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
                        colSpan={3}
                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada peran yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role, index) => (
                      <tr key={role.id}>
                        <td className="px-4 py-2">{index + 1}</td>
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
                              <DropdownMenuItem
                                onClick={() => handleEdit(role)}
                              >
                                Detail/Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenPermissions(role)}
                              >
                                Lihat Permissions
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

      {selectedRole && (
        <div
          key={selectedRole.id}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-semibold">
              Role Permissions - {selectedRole.name}
            </h3>

            <div className="flex gap-2">
              <Button
                onClick={handleCheckAll}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isPermissionProcessing}
              >
                ✅ Check All
              </Button>

              <Button
                onClick={handleUncheckAll}
                variant="destructive"
                disabled={isPermissionProcessing}
              >
                ❌ Uncheck All
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {Object.keys(groupedPermissions).length === 0 ? (
                <p className="text-muted-foreground">Belum ada permission.</p>
              ) : (
                Object.entries(groupedPermissions).map(([route, actions]) => (
                  <div key={`route-${route}`} className="border-t pt-4">
                    <p className="font-semibold text-sm mb-2">Route: {route}</p>
                    <div className="flex flex-wrap gap-6">
                      {actions.map((action) => {
                        const permKey = `${action}-${route}`;
                        const isActive = localPermissions.includes(permKey);

                        return (
                          <div
                            key={`role-permission-${action}-${route}`}
                            className="flex flex-col items-center gap-y-1"
                          >
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              disabled={isPermissionProcessing}
                              onClick={() =>
                                togglePermission(permKey, isActive)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                isActive
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                                  isActive ? "translate-x-5" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm capitalize mt-1">
                              {action}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-right mt-4">
              <Button variant="outline" onClick={() => setSelectedRole(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
