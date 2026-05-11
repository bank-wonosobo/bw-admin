"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormProfile from "@/components/modal/ModalFormProfile";
import ProfileTable from "@/components/tables/ProfileTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormProfile} title="Profile">
          <ProfileTable />
        </ComponentCard>
      </div>
    </div>
  );
}
