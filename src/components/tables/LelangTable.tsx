import { apiV1 } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import { ILelang } from "@/types/Lelang";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormLelang from "../modal/ModalFormLelang";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export default function LelangTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<ILelang[]>({
    queryKey: ["lelang", currentPage],
    queryFn: async () => {
      const response = await apiV1.get("/auctions", {
        params: { page: currentPage },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [lelangId, setLelangId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, itemId: any, items?: ILelang[]) {
    setAction(act);
    setLelangId(itemId);

    if (act === "update" && items) {
      const selected = items.find((i) => i.id === itemId);
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
                    Gambar
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Link
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Array.isArray(data) &&
                  data.map((lelang) => (
                    <TableRow key={lelang.id}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {lelang.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div
                          className="line-clamp-3 overflow-hidden text-ellipsis"
                          dangerouslySetInnerHTML={{ __html: lelang.description }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                        {lelang.image_url ? (
                          <a
                            href={lelang.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500"
                          >
                            Lihat Gambar
                          </a>
                        ) : (
                          <p className="text-gray-500 italic">Kosong</p>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                        {lelang.link ? (
                          <a
                            href={lelang.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500"
                          >
                            Buka Link
                          </a>
                        ) : (
                          <p className="text-gray-500 italic">Kosong</p>
                        )}
                      </TableCell>
                      <TableCell className="w-[80px] text-center text-theme-xs dark:text-gray-400 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => showModal("update", lelang.id, data)}
                            size="xs"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            onClick={() => showModal("delete", lelang.id)}
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
        <ModalFormLelang
          isOpen={isOpen}
          action={action}
          lelangId={lelangId}
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
