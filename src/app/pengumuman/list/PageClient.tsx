"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormNews from "@/components/modal/ModalFormNews";
import AnnouncementTable from "@/components/tables/AnnouncementTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengumuman" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormNews} title="Pengumuman">
          <AnnouncementTable />
        </ComponentCard>
      </div>
    </div>
  );
}
