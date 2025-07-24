"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReport from "@/components/modal/ModalFormReport";
import ReportTable from "@/components/tables/ReportTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Publikasi" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormReport}
          title="laporan publikasi . . ."
          search
        >
          <ReportTable />
        </ComponentCard>
      </div>
    </div>
  );
}
