"use client";
import { apiV1 } from "@/api/api";
import { IAnnouncement } from "@/types/Announcement";
import {
  AnnouncementFormInput,
  announcementSchema,
} from "@/validation/announcementSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
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
  announcementId?: number | null;
  item?: IAnnouncement | null;
};

const ModalFormAnnouncement: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  announcementId,
  item,
}) => {
  const methods = useForm<AnnouncementFormInput>({
    resolver: zodResolver(announcementSchema),
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
          content: item.content,
          author: item.author,
          target_audience: item.target_audience,
          start_date: item.start_date ? new Date(item.start_date) : undefined,
          end_date: item.end_date ? new Date(item.end_date) : undefined,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: AnnouncementFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("author", data.author);
      formData.append("target_audience", data.target_audience);
      formData.append("start_date", data.start_date.toISOString());
      formData.append("end_date", data.end_date.toISOString());

      if (data.attachment) {
        formData.append("attachment", data.attachment);
      }

      const res = await apiV1.post(`/announcements`, formData, {
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
      await queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Berhasil menambahkan berita.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: AnnouncementFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("author", data.author);
      formData.append("target_audience", data.target_audience);
      formData.append("start_date", data.start_date.toISOString());
      formData.append("end_date", data.end_date.toISOString());

      if (data.attachment) {
        formData.append("attachment", data.attachment);
      }

      const res = await apiV1.put(`/announcements/${announcementId}`, formData);
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
      await queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Berhasil mengubah berita.");
      closeModal();
    },
  });

  const { mutate: deleteAnnouncement } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/announcements/${announcementId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Berhasil menghapus berita.");
      closeModal();
    },
  });

  const onSubmitForm = (data: AnnouncementFormInput) => {
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
    >
      {(action === "create" || action === "update") && (
        <>
          <h4 className="mb-7 text-lg font-medium text-gray-800 dark:text-white/90">
            {action === "create" ? "Buat " : "Edit "}
            Pengumuman
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <Label>Judul</Label>
                  <Input
                    id="title"
                    type="i"
                    placeholder="Judul berita"
                    {...register("title")}
                    hint={errors.title?.message}
                    error={!!errors.title}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Author</Label>
                  <Input
                    id="author"
                    type="text"
                    placeholder="Author"
                    {...register("author")}
                    hint={errors.author?.message}
                    error={!!errors.author}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Target Audiens</Label>
                  <Input
                    id="target_audience"
                    type="text"
                    placeholder="Target audiens"
                    {...register("target_audience")}
                    hint={errors.target_audience?.message}
                    error={!!errors.target_audience}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Konten</Label>
                  <RichTextEditor name="content" />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <Controller
                  name="start_date"
                  control={methods.control}
                  render={({ field }) => (
                    <DatePicker
                      id="start_date"
                      label="Awal Periode Laporan"
                      placeholder="Pilih tanggal"
                      value={field.value}
                      onChange={(dates) => field.onChange(dates[0])}
                    />
                  )}
                />

                <Controller
                  name="end_date"
                  control={methods.control}
                  render={({ field }) => (
                    <DatePicker
                      id="end_date"
                      label="Akhir Periode Laporan"
                      placeholder="Pilih tanggal"
                      value={field.value}
                      onChange={(dates) => field.onChange(dates[0])}
                    />
                  )}
                />

                <div className="col-span-1 sm:col-span-2">
                  <Label>Upload file</Label>
                  <FileInput name="attachment" className="custom-class" />
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
            Aksi ini akan menghapus data pengumuman
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteAnnouncement()}
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

export default ModalFormAnnouncement;
