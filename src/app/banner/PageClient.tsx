"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReport from "@/components/modal/ModalFormReport";
import BasicTableOne from "@/components/tables/BasicTableOne";
import BannerTable from "@/components/tables/BannerTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Banner" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormReport} title="Banner">
          <BannerTable />
        </ComponentCard>
      </div>
    </div>
  );
}
