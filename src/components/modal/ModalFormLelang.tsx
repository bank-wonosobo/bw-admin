"use client";
import { apiV1 } from "@/api/api";
import { ILelang } from "@/types/Lelang";
import { LelangFormInput, lelangSchema } from "@/validation/lelangSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import Input from "../form/input/InputField";
import RichTextEditor from "../form/input/RIchTextEditor";
import DeleteHeader from "../ui/alert/DeleteHeader";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
  lelangId?: string | null;
  item?: ILelang | null;
};

const ModalFormLelang: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  lelangId,
  item,
}) => {
  const methods = useForm<LelangFormInput>({
    resolver: zodResolver(lelangSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (action === "update" && item) {
        reset({
          title: item.title,
          description: item.description,
          link: item.link,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: LelangFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.post(`/auctions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lelang"] });
      toast.success("Berhasil menambahkan data lelang.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: LelangFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.put(`/auctions/${lelangId}`, formData);
      return res.data.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lelang"] });
      toast.success("Berhasil mengubah data lelang.");
      closeModal();
    },
  });

  const { mutate: deleteLelang } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/auctions/${lelangId}`);
      return res.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menghapus data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lelang"] });
      toast.success("Berhasil menghapus data lelang.");
      closeModal();
    },
  });

  const onSubmitForm = (data: LelangFormInput) => {
    if (action === "create") create(data);
    if (action === "update") update(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      {(action === "create" || action === "update") && (
        <>
          <h4 className="mb-7 text-lg font-medium text-gray-800 dark:text-white/90">
            {action === "create" ? "Tambah " : "Edit "}
            Data Lelang
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <Label>Judul Lelang</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Judul lelang"
                    {...register("title")}
                    hint={errors.title?.message}
                    error={!!errors.title}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Deskripsi</Label>
                  <RichTextEditor name="description" />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Link</Label>
                  <Input
                    id="link"
                    type="text"
                    placeholder="https://..."
                    {...register("link")}
                    hint={errors.link?.message}
                    error={!!errors.link}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Upload Gambar</Label>
                  <FileInput name="image" className="custom-class" />
                </div>
              </div>

              <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={closeModal}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isPendingCreate || isPendingUpdate}
                >
                  Simpan
                </Button>
              </div>
            </form>
          </FormProvider>
        </>
      )}

      {action === "delete" && (
        <div className="text-center">
          <DeleteHeader />
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Hapus Data ?
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Aksi ini akan menghapus data lelang secara permanen.
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteLelang()}
              type="button"
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalFormLelang;
