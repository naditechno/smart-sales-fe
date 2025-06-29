"use client";

import { Button } from "@/components/ui/button";
import { useCostParameterStore } from "@/store/costParameterStore";

export default function RiwayatPage() {
  const { data, setData } = useCostParameterStore();

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Riwayat Parameter Biaya</h2>
      <div className="rounded-lg border overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Produk</th>
              <th className="px-4 py-2">Jenis</th>
              <th className="px-4 py-2">Nilai</th>
              <th className="px-4 py-2">Mulai</th>
              <th className="px-4 py-2">Akhir</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-muted/40">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2">{item.costType}</td>
                <td className="px-4 py-2">{item.costValue}</td>
                <td className="px-4 py-2">{item.startDate}</td>
                <td className="px-4 py-2">{item.endDate}</td>
                <td className="px-4 py-2 text-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-4 py-6 text-muted-foreground"
                >
                  Tidak ada data riwayat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
