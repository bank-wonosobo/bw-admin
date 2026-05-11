import { apiV1na } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { IProfile } from "@/types/Profile";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormProfile from "../modal/ModalFormProfile";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export default function ProfileTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const pageLimit = 10;

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IProfile[]>({
    queryKey: ["profiles", currentPage],
    queryFn: async () => {
      const response = await apiV1na.get("/profiles", {
        params: { page: currentPage, limit: pageLimit },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [item, setItem] = useState<IProfile | null>(null);

  function showModal(act: any, id: string, items?: IProfile[]) {
    setAction(act);
    setProfileId(id);

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
                    Deskripsi
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
                  data.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-gray-400">
                        {profile.title}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: profile.description,
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                        {profile.image_url ? (
                          <a href={profile.image_url} className="text-blue-500">
                            Lihat Media
                          </a>
                        ) : (
                          <p className="italic text-gray-500">Media kosong</p>
                        )}
                      </TableCell>
                      <TableCell className="w-[50px] px-4 text-center text-theme-xs dark:text-gray-400">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() =>
                              showModal("update", profile.id, data)
                            }
                            size="xs"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            onClick={() => showModal("delete", profile.id)}
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
        <ModalFormProfile
          isOpen={isOpen}
          action={action}
          profileId={profileId}
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
