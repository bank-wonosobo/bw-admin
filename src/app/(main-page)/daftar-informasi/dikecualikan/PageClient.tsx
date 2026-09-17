"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormExcludedInformation from "@/components/modal/ModalFormExcludedInformation";
import ExcludedInformationTable from "@/components/tables/ExcludedInformationTable";

export default function PageClient() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Informasi Dikecualikan" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormExcludedInformation} title="Daftar Informasi Dikecualikan">
          <ExcludedInformationTable />
        </ComponentCard>
      </div>
    </div>
  );
}
