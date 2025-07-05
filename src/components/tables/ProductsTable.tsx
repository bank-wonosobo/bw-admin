import { apiV1na } from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import { IProducts } from "@/types/Products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ModalFormProducts from "../modal/ModalFormProducts";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export default function ProductsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<IProducts[]>({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      const response = await apiV1na.get("/products", {
        params: { page: currentPage },
      });
      setTotalPage(response.data.total_page);
      return response.data.data;
    },
  });

  const { isOpen, openModal, closeModal } = useModal();
  const [action, setAction] = useState<any>(null);
  const [productsId, setProductsId] = useState<any>(null);
  const [item, setItem] = useState<any>(null);

  function showModal(act: any, id: any, item?: IProducts[]) {
    setAction(act);
    setProductsId(id);

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
                    Nama
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
                    Media
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tagline
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Kategori Produk
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
                        {order.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: order.description,
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-gray-400">
                        {order.image_url ? order.image_url : "File kosong"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {order.tagline}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {order.product_category}
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
        <ModalFormProducts
          isOpen={isOpen}
          action={action}
          productsId={productsId}
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
