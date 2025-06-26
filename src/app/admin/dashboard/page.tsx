import { SiteHeader } from "@/components/site-header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SummaryCards } from "@/components/summary-cards";
import data from "@/json/data.json";

export default function Page() {
  return (
    <>
      <SiteHeader title="Dashboard Admin" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SummaryCards />
            </div>
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
