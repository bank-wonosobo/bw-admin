"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormOffice from "@/components/modal/ModalFormOffice";
import OfficeTable from "@/components/tables/OfficeTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Jaringan Kantor" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormOffice}
          title="jaringan kantor . . ."
          search
        >
          <OfficeTable />
        </ComponentCard>
      </div>
    </div>
  );
}
