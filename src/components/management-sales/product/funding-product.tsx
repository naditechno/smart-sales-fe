"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FundingProductForm from "@/components/formModal/funding-product-form";
import useModal from "@/hooks/use-modal";
import { FundingProduct } from "@/types/sales-manage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  useCreateFundingProductMutation,
  useDeleteFundingProductMutation,
  useGetFundingProductsQuery,
  useUpdateFundingProductMutation,
} from "@/services/product-services/fundingproduct.service";
import { useGetFundingProductCategoriesQuery } from "@/services/product-services/fundingproductcategory.service";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function FundingProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const roleName = session?.user?.roles?.[0]?.name;
  const isSales = roleName === "sales";

  const [newProduct, setNewProduct] = useState<Partial<FundingProduct>>({
    status: true,
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "tidak">(
    "semua"
  );
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetFundingProductsQuery({
    page,
    paginate: 10,
  });

  const { data: categoriesData } = useGetFundingProductCategoriesQuery({
    page: 1,
    paginate: 1000,
  });

  const [createProduct] = useCreateFundingProductMutation();
  const [updateProduct] = useUpdateFundingProductMutation();
  const [deleteProduct] = useDeleteFundingProductMutation();

  const handleSubmit = async () => {
    const payload = {
      name: newProduct.name ?? "",
      description: newProduct.description ?? "",
      minimum_amount: Number(newProduct.minimum_amount),
      maximum_amount: Number(newProduct.maximum_amount),
      interest_rate: Number(newProduct.interest_rate),
      eligibility_criteria: newProduct.eligibility_criteria ?? "",
      status: !!newProduct.status,
      funding_product_category_id:
        newProduct.funding_product_category_id ?? undefined,
    };

    try {
      if (editingProductId !== null) {
        await updateProduct({ id: editingProductId, payload });
        Swal.fire("Berhasil!", "Produk berhasil diperbarui.", "success");
      } else {
        await createProduct(payload);
        Swal.fire("Berhasil!", "Produk berhasil ditambahkan.", "success");
      }
      setNewProduct({});
      setEditingProductId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal simpan produk:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan produk.", "error");
    }
  };

  const handleEdit = (product: FundingProduct) => {
    setNewProduct({
      ...product,
      interest_rate: product.interest_rate,
      status: Boolean(product.status),
    });
    setEditingProductId(product.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: "Produk yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);
      await refetch();
      Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal hapus produk:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus produk.", "error");
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await updateProduct({ id, payload: { status: !currentStatus } });
      refetch();
    } catch (err) {
      console.error("Gagal mengubah status produk:", err);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "semua" | "aktif" | "tidak";
    setFilterStatus(value);
  };

  const products = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && p.status === true) ||
      (filterStatus === "tidak" && p.status === false);
    return matchSearch && matchStatus;
  });

  const limitWords = (text: string, maxWords = 7) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  }; 

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produk Funding</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak">Tidak Aktif</option>
          </select>

          {!isSales && (
            <Button
              onClick={() => {
                setNewProduct({ status: true });
                setEditingProductId(null);
                openModal();
              }}
            >
              + Tambah Produk
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Aksi</th>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-4 py-2 font-medium">Deskripsi</th>
                <th className="px-4 py-2 font-medium">Min-Max</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Suku Bunga
                </th>
                <th className="px-4 py-2 font-medium">Kriteria</th>
                <th className="px-4 py-2 font-medium">Kategori</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center p-4 text-muted-foreground animate-pulse"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2 space-x-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            router.push(
                              `/sales-management/funding-product/target/${product.id}`
                            )
                          }
                        >
                          Target
                        </Button>

                        {!isSales && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8"
                              >
                                <IconDotsVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {limitWords(product.description)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.minimum_amount)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.maximum_amount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.interest_rate}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.eligibility_criteria.split(" ").length > 7
                        ? product.eligibility_criteria
                            .split(" ")
                            .slice(0, 7)
                            .join(" ") + "..."
                        : product.eligibility_criteria}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.category_name || "-"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={product.status ? "success" : "destructive"}
                        className={isSales ? "" : "cursor-pointer"}
                        onClick={() =>
                          !isSales && toggleStatus(product.id, product.status)
                        }
                      >
                        {product.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FundingProductForm
            form={newProduct}
            setForm={setNewProduct}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            categories={categoriesData?.data ?? []}
          />
        </div>
      )}
    </div>
  );
}
