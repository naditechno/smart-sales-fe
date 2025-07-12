"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function TablePage() {
  const [page, setPage] = useState(1);

  const dataTable = [
    {
      header: "Budi Santoso (Funding)",
      sectionType: "Funding",
      status: "Pending",
      target: "2025-06-20",
      limit: 50000000,
      reviewer: "Koordinator X",
    },
    {
      header: "Siti Aminah (Lending)",
      sectionType: "Lending",
      status: "Approved",
      target: "2025-06-18",
      limit: 75000000,
      reviewer: "Koordinator Y",
    },
    {
      header: "Andi Wijaya (Lending)",
      sectionType: "Lending",
      status: "Rejected",
      target: "2025-06-15",
      limit: 100000000,
      reviewer: "Koordinator X",
    },
    {
      header: "Rina Marlina (Funding)",
      sectionType: "Funding",
      status: "Approved",
      target: "2025-06-14",
      limit: 60000000,
      reviewer: "Koordinator Z",
    },
    {
      header: "Dedi Kurniawan (Lending)",
      sectionType: "Lending",
      status: "Pending",
      target: "2025-06-13",
      limit: 85000000,
      reviewer: "Koordinator Y",
    },
    {
      header: "Yuni Lestari (Funding)",
      sectionType: "Funding",
      status: "Approved",
      target: "2025-06-12",
      limit: 72000000,
      reviewer: "Koordinator Y",
    },
    {
      header: "Agus Salim (Lending)",
      sectionType: "Lending",
      status: "Rejected",
      target: "2025-06-11",
      limit: 95000000,
      reviewer: "Koordinator Y",
    },
    {
      header: "Fitri Andini (Funding)",
      sectionType: "Funding",
      status: "Pending",
      target: "2025-06-10",
      limit: 67000000,
      reviewer: "Koordinator Z",
    },
    {
      header: "Tono Haryanto (Lending)",
      sectionType: "Lending",
      status: "Approved",
      target: "2025-06-09",
      limit: 80000000,
      reviewer: "Koordinator X",
    },
    {
      header: "Mega Pratiwi (Funding)",
      sectionType: "Funding",
      status: "Approved",
      target: "2025-06-08",
      limit: 54000000,
      reviewer: "Koordinator Y",
    },
  ];

  const lastPage = 1;
  const perPage = 10;

  return (
    <div className="px-2 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Tab Section */}
        <div className="hidden md:flex gap-2 flex-wrap bg-neutral-300 dark:bg-neutral-800 rounded-full">
          {[
            { label: "Outline", active: true },
            { label: "Past Performance", count: 3 },
            { label: "Key Personnel", count: 2 },
            { label: "Focus Documents" },
          ].map((tab, idx) => (
            <button
              key={idx}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                tab.active
                  ? "bg-zinc-600 text-white"
                  : "bg-zinc-900/40 text-zinc-300 hover:bg-zinc-700/50"
              } flex items-center gap-1`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-xs bg-zinc-400 dark:bg-zinc-700 text-white px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions Section */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Customize Columns
          </Button>
          <Button variant="default" size="sm">
            + Add Section
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Header
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Section Type
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Target
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Limit
                </th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Reviewer
                </th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">
                    {(page - 1) * perPage + idx + 1}
                  </td>
                  <td className="px-4 py-2 font-medium">{item.header}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs font-medium rounded-full bg-zinc-800 text-white px-2 py-1">
                      {item.sectionType}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {item.status === "Pending" && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                        Pending
                      </span>
                    )}
                    {item.status === "Approved" && (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Approved
                      </span>
                    )}
                    {item.status === "Rejected" && (
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(item.target).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.limit.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.reviewer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
