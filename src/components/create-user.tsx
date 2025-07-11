"use client";

import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "@/services/users.service";
import { useGetSalesTypesQuery } from "@/services/master/salestype.service";
import { useGetSalesCategoriesQuery } from "@/services/master/salescategory.service";
import FormCreateUser from "@/components/formModal/form-create-user";
import useModal from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { User } from "@/types/user";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Swal from "sweetalert2";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreateUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [usersPerPage] = useState(10);

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    paginate: usersPerPage,
    search,
    search_by: searchBy,
  });

  const { data: roles = [] } = useGetRolesQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const { data: salesCategoriesResult } = useGetSalesCategoriesQuery({
    page: 1,
    paginate: 9999,
  });
  const { data: salesTypesResult } = useGetSalesTypesQuery({
    page: 1,
    paginate: 9999,
  });

  const salesCategories = salesCategoriesResult?.data || [];
  const salesTypes = salesTypesResult?.data || [];

  const getCategoryName = (id: number | undefined) =>
    salesCategories.find((c) => c.id === id)?.name || "-";

  const getTypeName = (id: number | undefined) =>
    salesTypes.find((t) => t.id === id)?.name || "-";

  const users: User[] = result?.data?.data || [];
  const totalPages = result?.data?.last_page || 1;

  const handleAddUser = () => {
    setEditingUser(undefined);
    openModal();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    openModal();
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `Hapus ${user.name}?`,
      text: "Apakah Anda yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id).unwrap();
        Swal.fire("Berhasil!", "User berhasil dihapus.", "success");
        refetch();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        Swal.fire("Error", "Terjadi kesalahan saat menghapus user.", "error");
      }
    }
  };

  const toggleStatus = async (user: User) => {
    const action = user.status ? "Nonaktifkan" : "Aktifkan";

    const result = await Swal.fire({
      title: `${action} ${user.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          role_id: user.roles?.[0]?.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status ? 0 : 1,
        };
        await updateUserStatus({ id: user.id, payload }).unwrap();
        Swal.fire(
          "Berhasil!",
          `Status user ${user.name} diperbarui.`,
          "success"
        );
        refetch();
      } catch (error) {
        console.error("Gagal ubah status:", error);
        Swal.fire("Error", "Gagal mengubah status user.", "error");
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredUsers = users.filter((u) => {
    const matchStatus =
      statusFilter === "" || (statusFilter === "active" ? u.status : !u.status);
    const matchRole =
      roleFilter === "" ||
      (u.roles?.[0]?.name?.toLowerCase() || "") === roleFilter.toLowerCase();
    return matchStatus && matchRole;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama pengguna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex flex-wrap gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Semua Peran</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </option>
            ))}
          </select>

          <Button onClick={handleAddUser}>+ Tambah Pengguna</Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telepon</th>
                <th className="px-4 py-2">Peran</th>
                <th className="px-4 py-2 whitespace-nowrap">Kategori Sales</th>
                <th className="px-4 py-2 whitespace-nowrap">Tipe Sales</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-destructive">
                    Gagal memuat data pengguna.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-2">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{u.phone}</td>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">
                      {u.roles?.[0]?.name || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getCategoryName(u.sales_category_id)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getTypeName(u.sales_type_id)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={u.status ? "success" : "destructive"}>
                        {u.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => handleEdit(u)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(u)}
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
                            {u.status ? (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => toggleStatus(u)}
                              >
                                Nonaktifkan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => toggleStatus(u)}
                              >
                                Aktifkan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="outline"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <FormCreateUser
          onClose={closeModal}
          onSuccess={refetch}
          initialData={editingUser ?? undefined}
        />
      )}
    </div>
  );
}
