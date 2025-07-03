import TaskActivityPage from "@/components/sales-operation-file/task-tab";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Task Schedule" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <TaskActivityPage />
        </div>
      </div>
    </>
  );
}
