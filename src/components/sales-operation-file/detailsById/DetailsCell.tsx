"use client";

import { useEffect } from "react";
import { useGetSalesTargetFundingByIdQuery } from "@/services/coordinator/salestarget.service";

interface Props {
  id: number;
  refreshTrigger: number;
}

export default function DetailsCell({ id, refreshTrigger }: Props) {
  const { data, isLoading, isError, refetch } =
    useGetSalesTargetFundingByIdQuery(id);

  // Refetch manual saat refreshTrigger berubah
  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  if (isLoading)
    return <div className="text-muted-foreground italic">Memuat...</div>;
  if (isError || !data?.details)
    return (
      <div className="text-muted-foreground italic">Gagal memuat data</div>
    );

  if (data.details.length === 0)
    return <div className="text-muted-foreground italic">Tidak ada data</div>;

  return (
    <ul className="list-disc list-inside">
      {data.details.map((d, i) => (
        <li key={i}>
          Produk #{d.funding_product_id}: {d.target.toLocaleString("id-ID")}{" "}
          unit
        </li>
      ))}
    </ul>
  );
}
