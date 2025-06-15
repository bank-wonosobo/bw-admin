"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormBanner from "@/components/modal/ModalFormBanner";
import BannerTable from "@/components/tables/BannerTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Jaringan Kantor" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormBanner} title="Jaringan Kantor">
          <BannerTable />
        </ComponentCard>
      </div>
    </div>
  );
}
