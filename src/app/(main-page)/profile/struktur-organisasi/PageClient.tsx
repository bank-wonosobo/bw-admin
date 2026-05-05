"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormOrganizationalStructure from "@/components/modal/ModalFormOrganizationalStructure";
import OrganizationalStructureTable from "@/components/tables/OrganizationalStructureTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Struktur Organisasi" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormOrganizationalStructure}
          title="Struktur Organisasi"
        >
          <OrganizationalStructureTable />
        </ComponentCard>
      </div>
    </div>
  );
}
