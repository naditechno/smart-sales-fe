import BankPage from "@/components/master/bank-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Bank" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <BankPage/>
        </div>
      </div>
    </div>
  );
}
