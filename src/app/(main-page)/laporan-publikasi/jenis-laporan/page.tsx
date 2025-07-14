import { Metadata } from "next";
import Page from "./PageClient";
import PermissionGuard from "@/components/PermissionGuard";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Jenis Laporan",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return (
    <PermissionGuard requiredPermission="report-type:view">
      <Page />
    </PermissionGuard>
  );
}
