import { apiV1 } from "@/api/api";
import { IReports } from "@/types/Reports";
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

export default function ReportApprovalTable() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IReports[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await apiV1.get("/reports");
      return response.data.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: approve, isPending: isPendingApprove } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/reports/${reportId}/approve`);
      return res.data;
    },
    onError: (err: any) => {
      console.error("Approve Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat memublikasi data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Berhasil memublikasi laporan.");
    },
  });

  const { mutate: archive, isPending: isPendingArchive } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/reports/${reportId}/archive`);
      return res.data;
    },
    onError: (err: any) => {
      console.error("Approve Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat mengarsipkan data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Berhasil mengarsipkan laporan.");
    },
  });

  const onApprove = (action: "publish" | "archived", reportId: string) => {
    if (action === "publish") {
      approve(reportId);
    }
    if (action === "archived") {
      archive(reportId);
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Judul
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
                  Periode Awal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Periode Akhir
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tahun
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kuratal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  URL File
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Versi
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
                  Upload oleh
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Disetujui oleh
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tipe Laporan
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
                data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {order.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.period_start &&
                      isValid(parseISO(order.period_start))
                        ? format(parseISO(order.period_start), "d MMM yyyy", {
                            locale: id,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.period_start && isValid(parseISO(order.period_end))
                        ? format(parseISO(order.period_end), "d MMM yyyy", {
                            locale: id,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.year}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.quarter ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-gray-400">
                      {order.fileurl ? order.fileurl : "File kosong"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.version}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          order.status === "published"
                            ? "success"
                            : order.status === "draft"
                            ? "warning"
                            : "error"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {order.upload_by}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {order.approved_by ?? "-"}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.report_type}
                    </TableCell>
                    <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400 px-4">
                      {order.status === "published" ? (
                        <Button
                          isLoading={isPendingArchive}
                          onClick={() => onApprove("archived", order.id)}
                          size="xs"
                          className="px-3 text-xs font-normal bg-yellow-500 hover:bg-yellow-600"
                        >
                          Arsipkan
                        </Button>
                      ) : (
                        <Button
                          isLoading={isPendingApprove}
                          onClick={() => onApprove("publish", order.id)}
                          size="xs"
                          className="px-3 text-xs font-normal bg-green-500 hover:bg-green-600"
                        >
                          Publish
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
  );
}
