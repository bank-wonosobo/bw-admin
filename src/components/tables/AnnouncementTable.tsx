import { apiV1 } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import { useQuery } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import ModalFormAnnouncement from "../modal/ModalFormAnnouncement";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { IAnnouncement } from "@/types/Announcement";
import DOMPurify from "dompurify";
import Pagination from "./Pagination";

export default function AnnouncementTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IAnnouncement[]>({
    queryKey: ["announcement", currentPage],
    queryFn: async () => {
      const response = await apiV1.get("/announcements", {
        params: { page: currentPage },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [announcementId, setAnnouncementId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, id: any, item?: IAnnouncement[]) {
    setAction(act);
    setAnnouncementId(id);

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
                  data.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {order.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{ __html: order.content }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {order.author}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {order.target_audience}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.start_date && isValid(parseISO(order.start_date))
                          ? format(parseISO(order.start_date), "d MMM yyyy", {
                              locale: id,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.end_date && isValid(parseISO(order.end_date))
                          ? format(parseISO(order.end_date), "d MMM yyyy", {
                              locale: id,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-gray-400">
                        {order.attachment_url
                          ? order.attachment_url
                          : "File kosong"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={order.is_active === true ? "success" : "error"}
                        >
                          {order.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.published_at &&
                        isValid(parseISO(order.published_at))
                          ? format(parseISO(order.published_at), "d MMM yyyy", {
                              locale: id,
                            })
                          : "-"}
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
                        {order.approved_by ?? "-"}
                      </TableCell>
                      <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => showModal("update", order.id, data)}
                            size="xs"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            onClick={() => showModal("delete", order.id)}
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
        <ModalFormAnnouncement
          isOpen={isOpen}
          action={action}
          announcementId={announcementId}
          closeModal={closeModal}
          item={item}
        />
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
