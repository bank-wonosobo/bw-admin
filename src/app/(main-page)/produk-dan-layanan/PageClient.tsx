"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormProducts from "@/components/modal/ModalFormProducts";
import BasicTableOne from "@/components/tables/BasicTableOne";
import ProductsTable from "@/components/tables/ProductsTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Produk dan Layanan" />
      <div className="space-y-6">
        <ComponentCard
          ModalComponent={ModalFormProducts}
          title="Produk dan Layanan"
        >
          <ProductsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
