import { Metadata } from "next";
import Page from "./PageClient";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval Pengumuman",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return <Page />;
}
