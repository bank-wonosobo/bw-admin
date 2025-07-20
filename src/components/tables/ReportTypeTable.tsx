"use client";
import { apiV1 } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import { IReportType } from "@/types/ReportType";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormReportType from "../modal/ModalFormReportType";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function ReportTypeTable() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IReportType[]>({
    queryKey: ["report-types"],
    queryFn: async () => {
      const response = await apiV1.get("/report-types");
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();

  const [action, setAction] = useState<any>(null);
  const [reportTypeId, setReportTypeId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, id: any, item?: IReportType[]) {
    setAction(act);
    setReportTypeId(id);

    if (act === "update" && item) {
      const selected = item.find((item) => item.id === id);
      setItem(selected ?? null);
    } else {
      setItem(null);
    }
    openModal();
  }

  if (isLoading)
    return (
      <p className="px-5 py-3 text-black text-start text-theme-sm dark:text-gray-400">
        Loading...
      </p>
    );
  if (isError)
    return (
      <p className="px-5 py-3 text-black text-start text-theme-sm dark:text-gray-400">
        Terjadi kesalahan saat mengambil data.
      </p>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-[100px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jenis Laporan
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[300px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Deskripsi
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[100px] px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Array.isArray(data) &&
                data.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="w-[100px] break-words whitespace-normal px-5 py-3 text-black text-start text-theme-sm dark:text-gray-400">
                      {report.name}
                    </TableCell>
                    <TableCell className="w-[300px] break-words whitespace-normal px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {report.description}
                    </TableCell>
                    <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400">
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => showModal("update", report.id, data)}
                          size="xs"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          onClick={() => showModal("delete", report.id)}
                          size="xs"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <TrashBinIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ModalFormReportType
        isOpen={isOpen}
        action={action}
        reportTypeId={reportTypeId}
        closeModal={closeModal}
        item={item}
      />
    </div>
  );
}
