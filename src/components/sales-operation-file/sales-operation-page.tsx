"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskTab from "./tabs/task-tab";
import ProspectTab from "./tabs/prospect-tab";
import ReviewTab from "./tabs/review-tab";
import ApprovalTab from "./tabs/approval-tab";
import ReconciliationTab from "./tabs/reconciliation-tab";

export default function SalesOperationsPage() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Operasi Penjualan</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="tasks">Tugas</TabsTrigger>
          <TabsTrigger value="leads">Prospek</TabsTrigger>
          <TabsTrigger value="review">Tinjauan</TabsTrigger>
          <TabsTrigger value="approval">Persetujuan</TabsTrigger>
          <TabsTrigger value="reconciliation">Rekonsiliasi</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          {activeTab === "tasks" && <TaskTab />}
        </TabsContent>

        <TabsContent value="leads">
          {activeTab === "leads" && <ProspectTab />}
        </TabsContent>

        <TabsContent value="review">
          {activeTab === "review" && <ReviewTab />}
        </TabsContent>

        <TabsContent value="approval">
          {activeTab === "approval" && <ApprovalTab />}
        </TabsContent>

        <TabsContent value="reconciliation">
          {activeTab === "reconciliation" && <ReconciliationTab />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
