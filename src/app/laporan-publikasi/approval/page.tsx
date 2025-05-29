import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Page from "./PageClient";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval Laporan Publikasi",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return <Page />;
}
