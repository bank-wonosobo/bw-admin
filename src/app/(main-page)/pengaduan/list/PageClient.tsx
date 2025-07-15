"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplainTable from "@/components/tables/ComplaintTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengaduan" />
      <div className="space-y-6">
        <ComponentCard title="List Pengaduan">
          <ComplainTable />
        </ComponentCard>
      </div>
    </div>
  );
}
