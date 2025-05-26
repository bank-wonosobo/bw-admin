import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval",
  description: "Bank Wonosobo",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approval Informasi" />
      <div className="space-y-6">
        <ComponentCard title="Approval">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
