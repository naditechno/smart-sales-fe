"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar04 } from "@/components/ui/calendar04";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import TablePage from "@/components/dashboard/table-dashboard";

export default function Page() {
  const [showCalendar, setShowCalendar] = useState(false);
  const { data: session } = useSession();

  const role = session?.user?.roles?.[0]?.name;

  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="w-full flex flex-wrap gap-2 items-center justify-between px-4 lg:px-6">
              <Input
                placeholder="Cari nama..."
                className="w-full lg:w-1/2"
              />
              <div className="flex items-center gap-2">
                {role === "superadmin" && (
                  <select className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800">
                    <option value="">Semua Cabang</option>
                    <option value="active">Cabang 1</option>
                    <option value="inactive">Cabang 2</option>
                  </select>
                )}
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
            </div>

            <div className="px-4 lg:px-6">
            </div>
            <div className="px-4 lg:px-6">
              <TablePage/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}