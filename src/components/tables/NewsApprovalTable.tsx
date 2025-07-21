import { apiV1 } from "@/api/api";
import { INews } from "@/types/News";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
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
import { useModal } from "@/hooks/useModal";
import ModalFormNews from "../modal/ModalFormNews";

export default function NewsApprovalTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<INews[]>({
    queryKey: ["news", currentPage],
    queryFn: async () => {
      const response = await apiV1.get("/news", {
        params: { page: currentPage },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: approve, isPending: isPendingApprove } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/news/${reportId}/approve`);
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
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Berhasil memublikasi berita.");
    },
  });

  const { mutate: archive, isPending: isPendingArchive } = useMutation({
    mutationFn: async (reportId: string) => {
      const res = await apiV1.put(`/news/${reportId}/archive`);
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
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Berhasil mengarsipkan berita.");
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

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [newsId, setNewsId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, id: any, item?: INews[]) {
    setAction("detail");
    setNewsId(id);

    if (item) {
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
                    Slug
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
                    Media
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Detail
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Array.isArray(data) &&
                  data.map((news) => (
                    <TableRow key={news.id}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {news.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {news.slug}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div
                          className="line-clamp-3 overflow-hidden text-ellipsis "
                          dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {news.author}
                      </TableCell>
                      <TableCell className="px-4 py-3  text-start text-theme-sm">
                        {news.image_url ? (
                          <a href={news.image_url} className="text-blue-500">
                            Lihat Media
                          </a>
                        ) : (
                          <p className="text-gray-500 italic">Media kosong</p>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {news.published_at &&
                        isValid(parseISO(news.published_at))
                          ? format(parseISO(news.published_at), "d MMM yyyy", {
                              locale: id,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            news.status === "published"
                              ? "success"
                              : news.status === "draft"
                              ? "warning"
                              : "error"
                          }
                        >
                          {news.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {news.approved_by ?? "-"}
                      </TableCell>
                      <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400 px-4">
                        {news.status === "published" ? (
                          <Button
                            isLoading={isPendingArchive}
                            onClick={() => onApprove("archived", news.id)}
                            size="xs"
                            className="px-3 text-xs font-normal bg-yellow-500 hover:bg-yellow-600"
                          >
                            Arsipkan
                          </Button>
                        ) : (
                          <Button
                            isLoading={isPendingApprove}
                            onClick={() => onApprove("publish", news.id)}
                            size="xs"
                            className="px-3 text-xs font-normal bg-green-500 hover:bg-green-600"
                          >
                            Publish
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="w-[50px] text-center text-theme-sm px-4">
                        <div className="flex justify-center gap-2">
                          <p
                            onClick={() => showModal("detail", news.id, data)}
                            className="text-yellow-500 hover:text-yellow-600 font-bold cursor-pointer"
                          >
                            <p className="font-light">Lihat Detail</p>
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ModalFormNews
        isOpen={isOpen}
        action={action}
        newsId={newsId}
        closeModal={closeModal}
        item={item}
      />
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
