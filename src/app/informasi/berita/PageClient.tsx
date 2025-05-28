"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormNews from "@/components/modal/ModalFormNews";
import NewsTable from "@/components/tables/NewsTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Berita" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormNews} title="Berita">
          <NewsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
