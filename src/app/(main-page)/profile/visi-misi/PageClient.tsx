"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormVisionMission from "@/components/modal/ModalFormVisionMission";
import VisionMissionTable from "@/components/tables/VisionMissionTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Visi Misi" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormVisionMission} title="Visi Misi">
          <VisionMissionTable />
        </ComponentCard>
      </div>
    </div>
  );
}
