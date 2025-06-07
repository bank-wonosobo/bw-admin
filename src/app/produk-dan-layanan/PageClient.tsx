"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormReport from "@/components/modal/ModalFormReport";
import BasicTableOne from "@/components/tables/BasicTableOne";
import ProductsAndServicesTable from "@/components/tables/ProductsAndServicesTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Produk dan Layanan" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormReport}
          title="Produk dan Layanan"
        >
          <ProductsAndServicesTable />
        </ComponentCard>
      </div>
    </div>
  );
}
