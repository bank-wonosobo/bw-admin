"use client";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { useForm } from "react-hook-form";
import {
  ReportTypeFormInput,
  reportTypeSchema,
} from "@/validation/reportTypeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV1 } from "@/api/api";
import { toast } from "react-toastify";
import { IReportType } from "@/types/ReportType";
import DeleteHeader from "../ui/alert/DeleteHeader";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
  reportTypeId?: number | null;
  item?: IReportType | null;
};

const ModalFormReportType: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  reportTypeId,
  item,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportTypeFormInput>({
    resolver: zodResolver(reportTypeSchema),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (action === "update" && item) {
        reset({
          name: item.name,
          description: item.description,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: ReportTypeFormInput) => {
      const res = await apiV1.post(`/report-types`, data);
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
      await queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Berhasil menambahkan jenis laporan.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: ReportTypeFormInput) => {
      const res = await apiV1.put(`/report-types/${reportTypeId}`, data);
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
      await queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Berhasil mengubah jenis laporan.");
      closeModal();
    },
  });

  const { mutate: deleteReportType, isPending: isPendingDelete } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/report-types/${reportTypeId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Berhasil menghapus jenis laporan.");
      closeModal();
    },
  });

  const onSubmitForm = (data: ReportTypeFormInput) => {
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
            Laporan Publikasi
          </h4>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <Label>Nama Jenis Laporan</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama jenis laporan"
                  {...register("name")}
                  hint={errors.name?.message}
                  error={!!errors.name}
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Deskripsi Jenis Laporan</Label>
                <TextArea
                  placeholder="Deskripsi jenis laporan"
                  rows={3}
                  {...register("description")}
                  hint={errors.description?.message}
                  error={!!errors.description}
                />
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
              <Button type="submit" size="sm" isLoading={isPendingCreate}>
                Save Changes
              </Button>
            </div>
          </form>
        </>
      )}

      {action === "delete" && (
        <div className="text-center">
          <DeleteHeader />
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Hapus Data ?
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Aksi ini akan menghapus data jenis publikasi
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteReportType()}
              type="button"
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      )}
      {action === "approval" && <p>Approve?</p>}
    </Modal>
  );
};

export default ModalFormReportType;
