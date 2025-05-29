"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewsApprovalTable from "@/components/tables/NewsApprovalTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approval Berita" />
      <div className="space-y-6">
        <ComponentCard title="Approval">
          <NewsApprovalTable />
        </ComponentCard>
      </div>
    </div>
  );
}
