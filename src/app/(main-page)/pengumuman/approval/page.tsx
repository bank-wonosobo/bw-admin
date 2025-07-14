import { Metadata } from "next";
import Page from "./PageClient";
import PermissionGuard from "@/components/PermissionGuard";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval Pengumuman",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return (
    <PermissionGuard requiredPermission="announcement-approval:view">
      <Page />
    </PermissionGuard>
  );
}
