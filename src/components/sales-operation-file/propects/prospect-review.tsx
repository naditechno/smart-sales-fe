"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProspectsQuery } from "@/services/coordinator/prospect.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProspectReviewPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetProspectsQuery({
    page,
    paginate: 10,
  });

  const allProspects = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  const acceptedProspects = allProspects
    .filter((p) => p.status === 3) // hanya Accepted
    .filter((p) => p.id.toString().includes(search)); // filter pencarian

  const renderStatus = (status: number) => {
    if (status === 3) {
      return (
        <span className="px-2 py-1 rounded-lg text-sm bg-green-100 text-green-600">
          Accepted
        </span>
      );
    }
    return null;
  };

  const renderProductType = (type: string) => {
    if (
      type === "App\\Models\\Product\\FundingProduct" ||
      type === "AppModelsProductFundingProduct"
    ) {
      return "Funding Product";
    } else if (
      type === "App\\Models\\Product\\LendingProduct" ||
      type === "AppModelsProductLendingProduct"
    ) {
      return "Lending Product";
    }
    return "-";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Review Prospek (Accepted Only)</h1>

      <Input
        placeholder="Cari ID prospek..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/2"
      />

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Produk</th>
                <th className="px-4 py-2 font-medium">Deskripsi</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : acceptedProspects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada prospek yang disetujui.
                  </td>
                </tr>
              ) : (
                acceptedProspects.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">
                      {renderProductType(item.product_type)}
                    </td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{renderStatus(item.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

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
    </div>
  );
}
