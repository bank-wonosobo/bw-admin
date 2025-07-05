"use client";
import { apiV1 } from "@/api/api";
import { IComplaintType } from "@/types/ComplaintType";
import {
  ComplaintTypeFormInput,
  complaintTypeSchema,
} from "@/validation/complaintTypeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import DeleteHeader from "../ui/alert/DeleteHeader";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
  complaintTypeId?: number | null;
  item?: IComplaintType | null;
};

const ModalFormComplaintType: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  complaintTypeId,
  item,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintTypeFormInput>({
    resolver: zodResolver(complaintTypeSchema),
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
    mutationFn: async (data: ComplaintTypeFormInput) => {
      const res = await apiV1.post(`/complaint-types`, data);
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
      await queryClient.invalidateQueries({ queryKey: ["complaint-types"] });
      toast.success("Berhasil menambahkan jenis aduan.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: ComplaintTypeFormInput) => {
      const res = await apiV1.put(`/complaint-types/${complaintTypeId}`, data);
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
      await queryClient.invalidateQueries({ queryKey: ["complaint-types"] });
      toast.success("Berhasil mengubah jenis aduan.");
      closeModal();
    },
  });

  const { mutate: deleteComplaintType } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/complaint-types/${complaintTypeId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["complaint-types"] });
      toast.success("Berhasil menghapus jenis aduan.");
      closeModal();
    },
  });

  const onSubmitForm = (data: ComplaintTypeFormInput) => {
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
            Jenis Aduan
          </h4>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <Label>Nama</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama jenis aduan"
                  {...register("name")}
                  hint={errors.name?.message}
                  error={!!errors.name}
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Deskripsi</Label>
                <TextArea
                  placeholder="Deskripsi jenis aduan"
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
              <Button
                type="submit"
                size="sm"
                isLoading={isPendingCreate || isPendingUpdate}
              >
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
            Aksi ini akan menghapus data jenis aduan
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteComplaintType()}
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

export default ModalFormComplaintType;
