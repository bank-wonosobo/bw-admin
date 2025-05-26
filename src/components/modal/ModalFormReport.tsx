"use client";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { ReportFormInput, reportSchema } from "@/validation/reportSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV1 } from "@/api/api";
import { toast } from "react-toastify";
import { IReports } from "@/types/Reports";
import DeleteHeader from "../ui/alert/DeleteHeader";
import DatePicker from "../form/date-picker";
import { useState } from "react";
import { IReportType } from "@/types/ReportType";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
  reportId?: number | null;
  item?: IReports | null;
};

const ModalFormReport: React.FC<ModalProps> = ({
  action,
  closeModal,
  isOpen,
  reportId,
  item,
}) => {
  const methods = useForm<ReportFormInput>({
    resolver: zodResolver(reportSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();
  const [reportTypes, setReportTypes] = useState<IReportType[]>([]);

  const options = reportTypes.map((type) => ({
    value: type.name,
    label: type.name,
  }));

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const res = await apiV1.get("/report-types");
        setReportTypes(res.data.data);
      } catch (err) {
        console.error("Error fetching report types:", err);
      }
    };

    if (isOpen) {
      fetchReportTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (action === "update" && item) {
        reset({
          title: item.title,
          description: item.description,
          period_start: item.period_start
            ? new Date(item.period_start)
            : undefined,
          period_end: item.period_end ? new Date(item.period_end) : undefined,
          year: item.year,
          version: item.version,
          report_type: item.report_type,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, reset, action, item]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: ReportFormInput) => {
      const payload = {
        ...data,
        period_start: data.period_start.toISOString(),
        period_end: data.period_end.toISOString(),
      };

      const res = await apiV1.post(`/reports`, payload);
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
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Berhasil menambahkan laporan.");
      closeModal();
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (data: ReportFormInput) => {
      const payload = {
        ...data,
        period_start: data.period_start.toISOString(),
        period_end: data.period_end.toISOString(),
      };

      const res = await apiV1.put(`/reports/${reportId}`, payload);
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
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Berhasil mengubah laporan.");
      closeModal();
    },
  });

  const { mutate: deleteReport, isPending: isPendingDelete } = useMutation({
    mutationFn: async () => {
      const res = await apiV1.delete(`/reports/${reportId}`);
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
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Berhasil menghapus laporan.");
      closeModal();
    },
  });

  const onSubmitForm = (data: ReportFormInput) => {
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <Controller
                  name="report_type"
                  control={methods.control}
                  render={({ field }) => (
                    <div className="col-span-1">
                      <Label>Jenis Laporan</Label>
                      <div className="relative">
                        <Select
                          options={options}
                          placeholder="Pilih jenis laporan"
                          value={field.value}
                          onChange={field.onChange}
                          className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                  )}
                />

                <div className="col-span-1">
                  <Label>Judul Laporan</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Judul laporan"
                    {...register("title")}
                    hint={errors.title?.message}
                    error={!!errors.title}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <Label>Deskripsi Laporan</Label>
                  <TextArea
                    id="description"
                    placeholder="Deskripsi laporan"
                    rows={3}
                    {...register("description")}
                    hint={errors.description?.message}
                    error={!!errors.description}
                  />
                </div>

                <Controller
                  name="period_start"
                  control={methods.control}
                  render={({ field }) => (
                    <DatePicker
                      id="period_start"
                      label="Awal Periode Laporan"
                      placeholder="Pilih tanggal"
                      value={field.value}
                      onChange={(dates) => field.onChange(dates[0])}
                    />
                  )}
                />

                <Controller
                  name="period_end"
                  control={methods.control}
                  render={({ field }) => (
                    <DatePicker
                      id="period_end"
                      label="Akhir Periode Laporan"
                      placeholder="Pilih tanggal"
                      value={field.value}
                      onChange={(dates) => field.onChange(dates[0])}
                    />
                  )}
                />

                <div className="col-span-1">
                  <Label>Tahun Laporan</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="Tahun laporan"
                    {...register("year", { valueAsNumber: true })}
                    hint={errors.year?.message}
                    error={!!errors.year}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Version</Label>
                  <Input
                    id="version"
                    type="text"
                    placeholder="contoh: v1.0, final"
                    {...register("version")}
                    hint={errors.version?.message}
                    error={!!errors.version}
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
            Aksi ini akan menghapus data publikasi
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={() => deleteReport()}
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

export default ModalFormReport;
