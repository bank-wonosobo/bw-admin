import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalFormPPIDRegulations from "@/components/modal/ModalFormPPIDRegulations";
import PPIDRegulationsTable from "@/components/tables/PPIDRegulationsTable";

export default function PageClient() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Regulasi Informasi PPID" />
      <div className="space-y-6">
        <ComponentCard ModalComponent={ModalFormPPIDRegulations} title="Regulasi Informasi PPID">
          <PPIDRegulationsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
