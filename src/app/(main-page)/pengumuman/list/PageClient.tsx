"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormAnnouncement from "@/components/modal/ModalFormAnnouncement";
import AnnouncementTable from "@/components/tables/AnnouncementTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengumuman" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormAnnouncement}
          title="Pengumuman"
        >
          <AnnouncementTable />
        </ComponentCard>
      </div>
    </div>
  );
}
