import { Metadata } from "next";
import Page from "./PageClient";

export const metadata: Metadata = {
  title: "Bank Wonosobo - Approval Berita",
  description: "Bank Wonosobo",
};

export default function PageWrapper() {
  return <Page />;
}
