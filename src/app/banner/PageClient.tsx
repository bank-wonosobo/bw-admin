"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReport from "@/components/modal/ModalFormReport";
import BasicTableOne from "@/components/tables/BasicTableOne";
import ReportTable from "@/components/tables/ReportTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Banner" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormReport} title="Banner">
          <ReportTable />
        </ComponentCard>
      </div>
    </div>
  );
}
