"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormComplaintType from "@/components/modal/ModalFormComplaintType";
import ComplainTypeTable from "@/components/tables/ComplaintTypeTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tipe Aduan" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormComplaintType}
          title="Tipe Aduan"
        >
          <ComplainTypeTable />
        </ComponentCard>
      </div>
    </div>
  );
}
