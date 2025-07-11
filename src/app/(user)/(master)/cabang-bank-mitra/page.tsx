import BankMitraPage from "@/components/master/bank-mitra-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Cabang Bank Mitra" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <BankMitraPage/>
        </div>
      </div>
    </div>
  );
}
