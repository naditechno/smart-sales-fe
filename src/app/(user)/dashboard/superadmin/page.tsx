"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar04 } from "@/components/ui/calendar04";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import raw from "@/json/applications.json";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Input } from "@/components/ui/input";

type RawApp = {
  id: string;
  customerName: string;
  productType: string;
  amount: number;
  date: string;
  status: string;
  sales: string;
  coordinator: string;
};

type TableRow = {
  header: string;
  id: number;
  status: string;
  target: string;
  type: string;
  limit: string;
  reviewer: string;
};

const tableData: TableRow[] = (raw as RawApp[]).map((app, idx) => ({
  header: `${app.customerName} (${app.productType})`,
  id: idx + 1,
  status: app.status,
  target: app.date,
  type: app.productType,
  limit: new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(app.amount),
  reviewer: app.coordinator,
}));

export default function Page() {
  const [showCalendar, setShowCalendar] = useState(false);
  return (
    <>
      <SiteHeader title="Dashboard Admin" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="w-full flex gap-2 items-center justify-between px-4 lg:px-6">
              <Input
                placeholder="Cari nama sales / coordinator / customer..."
                className="w-full lg:w-1/2"
              />
              <Button
                onClick={() => setShowCalendar((prev) => !prev)}
                variant="default"
                size="sm"
              >
                Filter Berdasarkan Tanggal
              </Button>
             
              {showCalendar && (
                <div className="absolute top-32 right-4 z-50">
                  <Calendar04 />
                </div>
              )}
            </div>
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <DataTable data={tableData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
