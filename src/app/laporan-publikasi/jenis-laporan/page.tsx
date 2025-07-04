import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Page from "./PageClient";
import PermissionGuard from "@/components/PermissionGuard";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Jenis Laporan",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return (
    <PermissionGuard requiredPermission="banner">
      <Page />;
    </PermissionGuard>
  );
}
