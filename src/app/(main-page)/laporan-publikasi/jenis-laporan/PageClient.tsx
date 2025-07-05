"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReportType from "@/components/modal/ModalFormReportType";
import ReportTypeTable from "@/components/tables/ReportTypeTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Jenis Laporan" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormReportType}
          title="Jenis Laporan"
        >
          <ReportTypeTable />
        </ComponentCard>
      </div>
    </div>
  );
}
