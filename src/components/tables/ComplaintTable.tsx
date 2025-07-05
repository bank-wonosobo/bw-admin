import { apiV1 } from "@/api/api";
import { IComplaint } from "@/types/Complaint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-toastify";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";
import { useState } from "react";

export default function ReportApprovalTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IComplaint[]>({
    queryKey: ["complaints", currentPage],
    queryFn: async () => {
      const response = await apiV1.get("/complaints", {
        params: { page: currentPage },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: process, isPending: isPendingApprove } = useMutation({
    mutationFn: async (complaintId: string) => {
      const res = await apiV1.put(`/complaints/${complaintId}/process`);
      return res.data;
    },
    onError: (err: any) => {
      console.error("Change status Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat mengubah status aduan.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Berhasil mengubah status aduan sedang diproses.");
    },
  });

  const { mutate: done, isPending: isPendingArchive } = useMutation({
    mutationFn: async (complaintId: string) => {
      const res = await apiV1.put(`/complaints/${complaintId}/done`);
      return res.data;
    },
    onError: (err: any) => {
      console.error("Change status Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat mengubah status aduan.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Berhasil mengubah status aduan telah diselesaikan.");
    },
  });

  const onComplainAction = (
    action: "process" | "done",
    complaintId: string
  ) => {
    if (action === "process") {
      process(complaintId);
    }
    if (action === "done") {
      done(complaintId);
    }
  };

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
    <>
      <div className="overflow-hidden rounded-xl bcomplain bcomplain-gray-200 bg-white dark:bcomplain-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="bcomplain-b bcomplain-gray-100 dark:bcomplain-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Complaint ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nama Terlapor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Lokasi Kejadian
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Waktu Kejadian
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Deskripsi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    URL Bukti
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nama Pelapor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nomor HP Pelapor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tipe Aduan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Array.isArray(data) &&
                  data.map((complain) => (
                    <TableRow key={complain.id}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {complain.complaint_id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {complain.reported_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.insident_location}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {complain.insident_time &&
                        isValid(parseISO(complain.insident_time))
                          ? format(
                              parseISO(complain.insident_time),
                              "d MMM yyyy",
                              {
                                locale: id,
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.description}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-gray-400">
                        {complain.evidence_url
                          ? complain.evidence_url
                          : "File kosong"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.reporter_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.reporter_phone}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            complain.status === "done"
                              ? "success"
                              : complain.status === "pending"
                              ? "warning"
                              : "info"
                          }
                        >
                          {complain.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {complain.complaint_type}
                      </TableCell>
                      <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400 px-4">
                        {complain.status === "pending" ? (
                          <Button
                            isLoading={isPendingArchive}
                            onClick={() =>
                              onComplainAction("process", complain.id)
                            }
                            size="xs"
                            className="px-3 text-xs font-normal bg-yellow-500 hover:bg-yellow-600"
                          >
                            Proses Aduan
                          </Button>
                        ) : complain.status === "process" ? (
                          <Button
                            isLoading={isPendingApprove}
                            onClick={() =>
                              onComplainAction("done", complain.id)
                            }
                            size="xs"
                            className="px-3 text-xs font-normal bg-blue-500 hover:bg-blue-600"
                          >
                            Selesaikan Aduan
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            className="px-3 text-xs font-normal bg-green-500"
                            disabled
                          >
                            Aduan selesai
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
