"use client";
import { apiV1 } from "@/api/api";
import { IBanner } from "@/types/Banner";
import { BannerFormInput, bannerSchema } from "@/validation/bannerSchema";
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
  bannerId?: number | null;
  item?: IBanner | null;
};

const ModalFormBanner: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  bannerId,
  item,
}) => {
  const methods = useForm<BannerFormInput>({
    resolver: zodResolver(bannerSchema),
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
          name: item.name,
          description: item.description,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: BannerFormInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.post(`/banners`, formData, {
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
      await queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Berhasil menambahkan banner.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: BannerFormInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1.put(`/banners/${bannerId}`, formData);
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
      await queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Berhasil mengubah banner.");
      closeModal();
    },
  });

  const { mutate: deleteBanner, isPending: isPendingDelete } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/banners/${bannerId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Berhasil menghapus banner.");
      closeModal();
    },
  });

  const onSubmitForm = (data: BannerFormInput) => {
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
            Banner
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <Label>Nama Banner</Label>
                  <Input
                    id="name"
                    type="i"
                    placeholder="Nama banner"
                    {...register("name")}
                    hint={errors.name?.message}
                    error={!!errors.name}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Deskripsi Banner</Label>
                  <RichTextEditor name="description" />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.description.message}
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
                <Button type="submit" size="sm" isLoading={isPendingCreate}>
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
            Aksi ini akan menghapus data banner
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteBanner()}
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

export default ModalFormBanner;
