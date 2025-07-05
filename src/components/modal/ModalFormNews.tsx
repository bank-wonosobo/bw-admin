"use client";
import { apiV1 } from "@/api/api";
import { INews } from "@/types/News";
import { NewsFormInput, newsSchema } from "@/validation/newsSchema";
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
import Image from "next/image";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | "detail" | null;
  isOpen: boolean;
  closeModal: () => void;
  newsId?: number | null;
  item?: INews | null;
};

const ModalFormNews: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  newsId,
  item,
}) => {
  const methods = useForm<NewsFormInput>({
    resolver: zodResolver(newsSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  console.log("======", item);

  useEffect(() => {
    if (isOpen) {
      if (action === "update" && item) {
        reset({
          title: item.title,
          slug: item.slug,
          content: item.content,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: NewsFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.post(`/news`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    },
    onError: (err: any) => {
      console.error("Create Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Berhasil menambahkan berita.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: NewsFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.put(`/news/${newsId}`, formData);
      return res.data.data;
    },
    onError: (err: any) => {
      console.error("Update Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Berhasil mengubah berita.");
      closeModal();
    },
  });

  const { mutate: deleteNews } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/news/${newsId}`);
      return res.data;
    },
    onError: (err: any) => {
      console.error("Delete Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menghapus data.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Berhasil menghapus berita.");
      closeModal();
    },
  });

  const onSubmitForm = (data: NewsFormInput) => {
    if (action === "create") {
      create(data);
    }
    if (action === "update") {
      update(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
      isFullscreen={action === "detail"}
    >
      {(action === "create" || action === "update") && (
        <>
          <h4 className="mb-7 text-lg font-medium text-gray-800 dark:text-white/90">
            {action === "create" ? "Buat " : "Edit "}
            Berita
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1">
                  <Label>Judul Berita</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Judul berita"
                    {...register("title")}
                    hint={errors.title?.message}
                    error={!!errors.title}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Slug</Label>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="Slug"
                    {...register("slug")}
                    hint={errors.slug?.message}
                    error={!!errors.slug}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Konten Berita</Label>
                  <RichTextEditor name="content" />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Upload file</Label>
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
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isPendingCreate || isPendingUpdate}
                >
                  Save Changes
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
            Aksi ini akan menghapus data berita
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteNews()}
              type="button"
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      )}

      {action === "detail" && item && (
        <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Judul
              </label>
              <p className="text-gray-800 text-xl font-semibold dark:text-gray-100">
                {item.title}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Konten
              </label>
              <div
                className="prose dark:prose-invert max-w-none list-decimal list-inside"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>

            {item.image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Gambar
                </label>
                <Image
                  src={item.image_url}
                  alt="Gambar berita"
                  width={600}
                  height={300}
                  className="rounded border object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="flex flex-col mt-8 pt-4 sm:flex-row gap-4 border-t-1 border-gray-500">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Slug
                </label>
                <p className="text-gray-800 dark:text-gray-100">{item.slug}</p>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Penulis
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {item.author}
                </p>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    item.status === "published"
                      ? "bg-green-100 text-green-700"
                      : item.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Disetujui oleh
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {item.approved_by || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalFormNews;
