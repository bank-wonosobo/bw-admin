import { apiV1 } from "@/api/api";
import { IAnnouncement } from "@/types/Announcement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useSearch } from "@/hooks/useSearch";
import { useEffect, useState } from "react";
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

export default function AnnouncementApprovalTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { search } = useSearch();

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(handler);
  }, [search]);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IAnnouncement[]>({
    queryKey: ["announcement", currentPage, debouncedSearch],
    queryFn: async () => {
      const response = await apiV1.get("/announcements", {
        params: { page: currentPage, key: debouncedSearch },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: approve, isPending: isPendingApprove } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/announcements/${reportId}/approve`);
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
      await queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Berhasil memublikasi pengumuman.");
    },
  });

  const { mutate: archive, isPending: isPendingArchive } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/announcements/${reportId}/archive`);
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
      await queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Berhasil mengarsipkan pengumuman.");
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
  if (!data)
    return (
      <p className="px-5 py-3 text-black text-start text-theme-sm dark:text-gray-400">
        Data tidak ditemukan.
      </p>
    );

  return (
    <>
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
                    Konten
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Penulis
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Target Audiens
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tanggal Mulai
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tanggal Akhir
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Lampiran
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status Aktif
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tanggal Publikasi
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
                    Disetujui Oleh
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
                  data.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {announcement.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: announcement.content,
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {announcement.author}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {announcement.target_audience}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {announcement.start_date &&
                        isValid(parseISO(announcement.start_date))
                          ? format(
                              parseISO(announcement.start_date),
                              "d MMM yyyy",
                              {
                                locale: id,
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {announcement.end_date &&
                        isValid(parseISO(announcement.end_date))
                          ? format(
                              parseISO(announcement.end_date),
                              "d MMM yyyy",
                              {
                                locale: id,
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3  text-start text-theme-sm">
                        {announcement.attachment_url ? (
                          <a
                            href={announcement.attachment_url}
                            className="text-blue-500"
                          >
                            Lihat Lampiran
                          </a>
                        ) : (
                          <p className="text-gray-500 italic">
                            Lampiran kosong
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            announcement.is_active === true
                              ? "success"
                              : "error"
                          }
                        >
                          {announcement.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {announcement.published_at &&
                        isValid(parseISO(announcement.published_at))
                          ? format(
                              parseISO(announcement.published_at),
                              "d MMM yyyy",
                              {
                                locale: id,
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            announcement.status === "published"
                              ? "success"
                              : announcement.status === "draft"
                              ? "warning"
                              : "error"
                          }
                        >
                          {announcement.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {announcement.approved_by ?? "-"}
                      </TableCell>
                      <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400 px-4">
                        {announcement.status === "published" ? (
                          <Button
                            isLoading={isPendingArchive}
                            onClick={() =>
                              onApprove("archived", announcement.id)
                            }
                            size="xs"
                            className="px-3 text-xs font-normal bg-yellow-500 hover:bg-yellow-600"
                          >
                            Arsipkan
                          </Button>
                        ) : (
                          <Button
                            isLoading={isPendingApprove}
                            onClick={() =>
                              onApprove("publish", announcement.id)
                            }
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
