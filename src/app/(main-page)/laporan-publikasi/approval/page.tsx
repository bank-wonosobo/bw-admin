import { Metadata } from "next";
import Page from "./PageClient";
import PermissionGuard from "@/components/PermissionGuard";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval Laporan Publikasi",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return (
    <PermissionGuard requiredPermission="report-approval:view">
      <Page />
    </PermissionGuard>
  );
}
