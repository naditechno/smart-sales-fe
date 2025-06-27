"use client";
import { useState } from "react";
import { useDeleteUserMutation, useGetRolesQuery, useGetUsersQuery } from "@/services/users.service";
import FormCreateUser from "@/components/formModal/form-create-user";
import useModal from "@/hooks/use-modal";

export default function CreateUser() {
  const { data: result, isLoading, isError, refetch } = useGetUsersQuery();
  const users = Array.isArray(result?.data) ? result.data : [];
  const { data: roles = [] } = useGetRolesQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const usersPerPage = 10;

  const { isOpen, openModal, closeModal } = useModal();

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "" || (statusFilter === "active" ? u.status : !u.status);

    const matchRole =
      roleFilter === "" ||
      (u.role?.toLowerCase() || "") === roleFilter.toLowerCase();

    return matchSearch && matchStatus && matchRole;
  });

  const handleEdit = (user) => {
    setEditingUser(user); 
    openModal();
  };

  const handleDelete = async (user) => {
    if (confirm(`Apakah yakin ingin menghapus ${user.name}?`)) {
      try {
        await deleteUser(user.id).unwrap();
        alert("User berhasil dihapus");
        refetch();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Terjadi kesalahan saat menghapus user");
      }
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <main className="p-6 w-full mx-auto">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Data Pengguna</h2>
            <p className="text-sm text-muted-foreground">
              Kelola semua akun pengguna di sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Pencarian data..."
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Semua Peran</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow hover:bg-primary/90 transition"
            >
              Tambah Akun
            </button>
          </div>
        </div>

        {/* Tabel user */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-auto">
          {isLoading ? (
            <p className="text-center animate-pulse py-6">
              Memuat data pengguna...
            </p>
          ) : isError ? (
            <p className="text-center py-6">Gagal memuat data!</p>
          ) : (
            <>
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-neutral-700">
                  <tr>
                    {"Nama Email Telepon Peran Status Aksi"
                      .split(" ")
                      .map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.phone}</td>
                      <td className="px-4 py-2 capitalize">{u.role || "-"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            u.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.status ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => handleDelete(u)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-neutral-600 text-black dark:text-white rounded disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-neutral-600 text-black dark:text-white rounded disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {isOpen && (
        <FormCreateUser
          onClose={closeModal}
          onSuccess={refetch}
          initialData={editingUser}
        />
      )}
    </main>
  );
}
