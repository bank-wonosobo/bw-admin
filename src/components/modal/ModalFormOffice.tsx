"use client";
import { apiV1na } from "@/api/api";
import { IOffice } from "@/types/Office";
import {
  editOfficeSchema,
  OfficeFormInput,
  officeSchema,
} from "@/validation/officeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import DeleteHeader from "../ui/alert/DeleteHeader";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { ZodType } from "zod";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
  officeId?: number | null;
  item?: IOffice | null;
};

const ModalFormOffice: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  officeId,
  item,
}) => {
  const isCreate = action === "create";

  const schema = isCreate ? officeSchema : editOfficeSchema;

  type SchemaType = typeof schema extends ZodType<any, any, infer T>
    ? T
    : never;

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
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
          address: item.address,
          longitude: item.longitude,
          latitude: item.latitude,
          map_link: item.map_link,
          phone_number: item.phone_number,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: OfficeFormInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      // formData.append("description", data.description);
      formData.append("longitude", data.longitude);
      formData.append("latitude", data.latitude);
      formData.append("map_link", data.map_link);
      formData.append("phone_number", data.phone_number);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1na.post(`/offices`, formData, {
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
      await queryClient.invalidateQueries({ queryKey: ["office"] });
      toast.success("Berhasil menambahkan jaringan kantor.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: OfficeFormInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      // formData.append("description", data.description);
      formData.append("longitude", data.longitude);
      formData.append("latitude", data.latitude);
      formData.append("map_link", data.map_link);
      formData.append("phone_number", data.phone_number);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await apiV1na.put(`/offices/${officeId}`, formData);
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
      await queryClient.invalidateQueries({ queryKey: ["office"] });
      toast.success("Berhasil mengubah jaringan kantor.");
      closeModal();
    },
  });

  const { mutate: deleteOffice } = useMutation({
    mutationFn: async () => {
      const res = await apiV1na.delete(`/offices/${officeId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["office"] });
      toast.success("Berhasil menghapus jaringan kantor.");
      closeModal();
    },
  });

  const onSubmitForm = (data: OfficeFormInput) => {
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
            Jaringan Kantor
          </h4>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <Label>Nama Kantor</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama kantor"
                    {...register("name")}
                    hint={errors.name?.message}
                    error={!!errors.name}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Alamat Kantor</Label>
                  <TextArea
                    id="address"
                    placeholder="Alamat kantor"
                    {...register("address")}
                    hint={errors.address?.message}
                    error={!!errors.address}
                  />
                </div>

                {/* <div className="col-span-1 sm:col-span-2">
                  <Label>Deskripsi Kantor</Label>
                  <TextArea
                    rows={2}
                    id="description"
                    placeholder="Deskripsi kantor"
                    {...register("description")}
                    hint={errors.description?.message}
                    error={!!errors.description}
                  />
                </div> */}

                <div className="col-span-1">
                  <Label>Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    {...register("latitude")}
                    hint={errors.latitude?.message}
                    error={!!errors.latitude}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    {...register("longitude")}
                    hint={errors.longitude?.message}
                    error={!!errors.longitude}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Link Peta</Label>
                  <Input
                    id="map_link"
                    type="text"
                    placeholder="Link peta"
                    {...register("map_link")}
                    hint={errors.map_link?.message}
                    error={!!errors.map_link}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Nomor Telpon</Label>
                  <Input
                    id="phone_number"
                    type="text"
                    placeholder="Nomor telpon"
                    {...register("phone_number")}
                    hint={errors.phone_number?.message}
                    error={!!errors.phone_number}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>
                    {action === "create"
                      ? "Upload gambar"
                      : "Upload gambar baru"}
                  </Label>
                  <FileInput
                    hint={errors.image?.message}
                    error={!!errors.image}
                    name="image"
                    className="custom-class"
                  />
                </div>

                {action === "update" && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label>Gambar saat ini</Label>
                    <div className="rounded-xl">
                      <img
                        src={item?.image_url}
                        className="w-32 h-24 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                )}
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
            Aksi ini akan menghapus data jaringan kantor
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteOffice()}
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

export default ModalFormOffice;
