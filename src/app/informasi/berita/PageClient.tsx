"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReport from "@/components/modal/ModalFormReport";
import NewsTable from "@/components/tables/NewsTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Berita" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormReport} title="Berita">
          <NewsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
