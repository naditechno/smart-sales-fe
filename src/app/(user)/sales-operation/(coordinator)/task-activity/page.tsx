import TaskActivityPage from "@/components/sales-operation-file/task-tab";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Task Schedule" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <TaskActivityPage />
        </div>
      </div>
    </div>
  );
}
