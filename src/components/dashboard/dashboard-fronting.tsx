"use client";

import { ChartPieDonutText } from "@/components/dashboard/chart-pie-donut-text";
import { ChartPieLegend } from "@/components/dashboard/chart-pie-legend";
import { ChartAreaInteractive } from "./chart-area-interactive";

export default function DashboardFronting() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase">Dashboard Fronting</h1>
        <div className="text-sm bg-white dark:bg-zinc-800 font-semibold px-3 py-1 rounded-md shadow">
          1 Jun 2025 – 30 Jun 2025
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: Ringkasan */}
        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-2 col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-md shadow p-4">
            <p className="text-sm text-muted-foreground">Realisasi Bulan Ini</p>
            <p className="text-2xl font-bold text-primary">5.982.500.000</p>
            <p className="text-xs text-red-500">15.0% dari 40,0 M Target</p>
            <div className="mt-2">
              <ChartPieDonutText />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Box 1 */}
            <div className="rounded-xl bg-gradient-to-b from-[#d7f3f2] to-white dark:from-gray-800 dark:to-gray-900 shadow-md px-4 py-3 text-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Pencapaian Hari ini
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                150.000.000
              </p>
            </div>

            {/* Box 2 */}
            <div className="rounded-xl bg-gradient-to-b from-[#d7f3f2] to-white dark:from-gray-800 dark:to-gray-900 shadow-md px-4 py-3 text-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Target Bulan ini
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                40.000.000.000
              </p>
            </div>

            {/* Box 3 */}
            <div className="rounded-xl bg-gradient-to-b from-[#d7f3f2] to-white dark:from-gray-800 dark:to-gray-900 shadow-md px-4 py-3 text-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Estimasi Pendapat Bersih MS
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                11.965.000.000
              </p>
            </div>
            <ChartAreaInteractive/>
          </div>
        </div>

        {/* Kanan: Hanya Legend */}
        <div className="bg-white dark:bg-zinc-800 rounded-md shadow p-4">
          <h2 className="text-sm font-semibold mb-2">
            Rasio Pencapaian Wilayah
          </h2>
          <ChartPieLegend />
        </div>
      </div>
    </div>
  );
}