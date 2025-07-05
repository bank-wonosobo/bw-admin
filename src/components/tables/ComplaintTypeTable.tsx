"use client";
import { apiV1 } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import { IComplaintType } from "@/types/ComplaintType";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormComplaintType from "../modal/ModalFormComplaintType";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function ComplaintTypeTable() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IComplaintType[]>({
    queryKey: ["complaint-types"],
    queryFn: async () => {
      const response = await apiV1.get("/complaint-types");
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();

  const [action, setAction] = useState<any>(null);
  const [complaintTypeId, setComplaintTypeId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, id: any, item?: IComplaintType[]) {
    setAction(act);
    setComplaintTypeId(id);

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
    <div className="overflow-hidden rounded-xl bcomplaintType bcomplaintType-gray-200 bg-white dark:bcomplaintType-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="bcomplaintType-b bcomplaintType-gray-100 dark:bcomplaintType-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-[100px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
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
                data.map((complaintType) => (
                  <TableRow key={complaintType.id}>
                    <TableCell className="w-[100px] break-words whitespace-normal px-5 py-3 text-black text-start text-theme-sm dark:text-gray-400">
                      {complaintType.name}
                    </TableCell>
                    <TableCell className="w-[300px] break-words whitespace-normal px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {complaintType.description}
                    </TableCell>
                    <TableCell className="w-[50px] text-center text-theme-xs dark:text-gray-400">
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() =>
                            showModal("update", complaintType.id, data)
                          }
                          size="xs"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          onClick={() => showModal("delete", complaintType.id)}
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
      <ModalFormComplaintType
        isOpen={isOpen}
        action={action}
        complaintTypeId={complaintTypeId}
        closeModal={closeModal}
        item={item}
      />
    </div>
  );
}
