"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReportApprovalTable from "@/components/tables/ReportApprovalTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approval Laporan Publikasi" />
      <div className="space-y-6">
        <ComponentCard title="Approval">
          <ReportApprovalTable />
        </ComponentCard>
      </div>
    </div>
  );
}
