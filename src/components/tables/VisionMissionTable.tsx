import { apiV1na } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { IVisionMission } from "@/types/Profile";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormVisionMission from "../modal/ModalFormVisionMission";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export default function VisionMissionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const pageLimit = 10;

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IVisionMission[]>({
    queryKey: ["vision-missions", currentPage],
    queryFn: async () => {
      const response = await apiV1na.get("/vision-missions", {
        params: { page: currentPage, limit: pageLimit },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [visionMissionId, setVisionMissionId] = useState<string | null>(null);
  const [item, setItem] = useState<IVisionMission | null>(null);

  function showModal(act: any, id: string, items?: IVisionMission[]) {
    setAction(act);
    setVisionMissionId(id);

    if (act === "update" && items) {
      const selected = items.find((entry) => entry.id === id);
      setItem(selected ?? null);
    } else {
      setItem(null);
    }

    openModal();
  }

  if (isLoading) {
    return (
      <p className="px-5 py-3 text-start text-theme-sm text-black dark:text-gray-400">
        Loading...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="px-5 py-3 text-start text-theme-sm text-black dark:text-gray-400">
        Terjadi kesalahan saat mengambil data.
      </p>
    );
  }

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
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Judul
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Visi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Misi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Media
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Array.isArray(data) &&
                  data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-gray-400">
                        {entry.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: entry.vision,
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: entry.mission,
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                        {entry.image_url ? (
                          <a href={entry.image_url} className="text-blue-500">
                            Lihat Media
                          </a>
                        ) : (
                          <p className="italic text-gray-500">Media kosong</p>
                        )}
                      </TableCell>
                      <TableCell className="w-[50px] px-4 text-center text-theme-xs dark:text-gray-400">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => showModal("update", entry.id, data)}
                            size="xs"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            onClick={() => showModal("delete", entry.id)}
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
        <ModalFormVisionMission
          isOpen={isOpen}
          action={action}
          visionMissionId={visionMissionId}
          closeModal={closeModal}
          item={item}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
