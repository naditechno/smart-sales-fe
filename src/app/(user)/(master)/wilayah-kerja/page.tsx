import WilayahKerjaPage from "@/components/master/wilayah-kerja-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Wilayah Kerja" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <WilayahKerjaPage />
        </div>
      </div>
    </div>
  );
}
