"use client";
import { apiV1 } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import DeleteHeader from "../ui/alert/DeleteHeader";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  action?: "create" | "update" | "delete" | "approval" | null;
  item?: any;
  infoId?: string | null;
}

export default function ModalFormPPIDRegulations({ isOpen, closeModal, action, item, infoId }: ModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (item && action === "update") {
      setFormData({ title: item.title, description: item.description });
    } else {
      setFormData({ title: "", description: "" });
      setFile(null);
    }
  }, [item, action, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (action === "create") return await apiV1.post("/ppid-regulations", data, { headers: { "Content-Type": "multipart/form-data" } });
      if (action === "update") return await apiV1.put(`/ppid-regulations/${infoId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      if (action === "delete") return await apiV1.delete(`/ppid-regulations/${infoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PPIDRegulations"] });
      closeModal();
    },
    onError: (error) => {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (action === "delete") {
      mutation.mutate(new FormData());
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (file) data.append("file", file);
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  if (action === "delete") {
    return (
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="flex flex-col gap-6 p-6">
          <DeleteHeader />
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Hapus Data</h3>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal} className="w-full">
              Batal
            </Button>
            <Button size="sm" variant="primary" onClick={() => handleSubmit()} className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl p-6">
      <h3 className="text-lg font-bold mb-4">{action === "create" ? "Tambah Regulasi Informasi PPID" : "Edit Regulasi Informasi PPID"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Judul</Label>
          <Input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div>
          <Label>Deskripsi</Label>
          <TextArea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        </div>
        <div>
          <Label>File Upload</Label>
          <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" type="button" onClick={closeModal}>Batal</Button>
          <Button variant="primary" size="sm" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
