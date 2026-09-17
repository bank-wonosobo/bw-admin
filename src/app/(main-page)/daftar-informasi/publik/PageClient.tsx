"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormPublicInformation from "@/components/modal/ModalFormPublicInformation";
import PublicInformationTable from "@/components/tables/PublicInformationTable";

export default function PageClient() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Informasi Publik" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormPublicInformation} title="Daftar Informasi Publik">
          <PublicInformationTable />
        </ComponentCard>
      </div>
    </div>
  );
}
