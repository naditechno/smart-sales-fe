import CabangPage from "@/components/master/cabang-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Cabang" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <CabangPage/>
        </div>
      </div>
    </div>
  );
}
