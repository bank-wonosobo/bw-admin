"use client";

import { apiV1na } from "@/api/api";
import { IProfile } from "@/types/Profile";
import { ProfileFormInput, profileSchema } from "@/validation/profileSchema";
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
  profileId?: string | null;
  item?: IProfile | null;
};

const ModalFormProfile: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  profileId,
  item,
}) => {
  const methods = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) return;

    if (action === "update" && item) {
      reset({
        title: item.title,
        description: item.description,
      });
      return;
    }

    reset({
      title: "",
      description: "",
      image: undefined,
    });
  }, [action, isOpen, item, reset]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: ProfileFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title ?? "");
      formData.append("description", data.description);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1na.post("/profiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data profile.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Berhasil menambahkan profile.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: ProfileFormInput) => {
      const formData = new FormData();
      formData.append("title", data.title ?? "");
      formData.append("description", data.description);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1na.put(`/profiles/${profileId}`, formData);
      return res.data.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data profile.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Berhasil mengubah profile.");
      closeModal();
    },
  });

  const { mutate: deleteProfile } = useMutation({
    mutationFn: async () => {
      const res = await apiV1na.delete(`/profiles/${profileId}`);
      return res.data;
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menghapus data profile.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Berhasil menghapus profile.");
      closeModal();
    },
  });

  const onSubmitForm = (data: ProfileFormInput) => {
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
            {action === "create" ? "Buat " : "Edit "}
            Profile
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <Label>Judul Profile (Opsional)</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Judul profile"
                    {...register("title")}
                    hint={errors.title?.message}
                    error={!!errors.title}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Deskripsi Profile</Label>
                  <RichTextEditor name="description" />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Upload Gambar</Label>
                  <FileInput name="image" className="custom-class" />
                </div>
              </div>

              <div className="mt-8 flex w-full items-center justify-end gap-3">
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
            Aksi ini akan menghapus data profile
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              onClick={() => deleteProfile()}
              type="button"
              className="flex w-full justify-center rounded-lg bg-error-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalFormProfile;
