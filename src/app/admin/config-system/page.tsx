import ConfigSystemPage from "@/components/configuration-systems/ConfigSystemPage";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Configuration System" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <ConfigSystemPage/>
        </div>
      </div>
    </>
  );
}
