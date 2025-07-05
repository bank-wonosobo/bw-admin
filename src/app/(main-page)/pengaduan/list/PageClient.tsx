"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormBanner from "@/components/modal/ModalFormBanner";
import ComplainTable from "@/components/tables/ComplaintTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengaduan" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormBanner} title="Jaringan Kantor">
          <ComplainTable />
        </ComponentCard>
      </div>
    </div>
  );
}
