import RiwayatPage from "@/components/configuration-systems/tabs/form-riwayat-cost";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Configuration System" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <RiwayatPage />
        </div>
      </div>
    </>
  );
}
