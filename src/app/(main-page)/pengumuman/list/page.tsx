import { Metadata } from "next";
import React from "react";
import Page from "./PageClient";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Pengumuman",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return <Page />;
}
