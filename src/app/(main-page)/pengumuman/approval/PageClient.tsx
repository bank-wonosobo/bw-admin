"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AnnouncementApprovalTable from "@/components/tables/AnnouncementApprovalTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approval Pengumuman" />
      <div className="space-y-6">
        <ComponentCard title="pengumuman . . ." search>
          <AnnouncementApprovalTable />
        </ComponentCard>
      </div>
    </div>
  );
}
