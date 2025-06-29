"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CostParameterTab from "@/components/configuration-systems/tabs/CostParameterSection";
import RouteOptimizationTab from "@/components/configuration-systems/tabs/RouteOptimizationSection";
import TaskScheduleTab from "@/components/configuration-systems/tabs/TaskScheduleSection";

export default function ConfigSystemPage() {
  const [activeTab, setActiveTab] = useState("cost");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Konfigurasi Sistem</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="cost">Parameter Biaya</TabsTrigger>
          <TabsTrigger value="route">Optimasi Rute</TabsTrigger>
          <TabsTrigger value="tasks">Jadwal Tugas</TabsTrigger>
        </TabsList>

        <TabsContent value="cost">
          {activeTab === "cost" && <CostParameterTab />}
        </TabsContent>

        <TabsContent value="route">
          {activeTab === "route" && <RouteOptimizationTab />}
        </TabsContent>

        <TabsContent value="tasks">
          {activeTab === "tasks" && <TaskScheduleTab />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
