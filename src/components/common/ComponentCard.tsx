"use client";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import React from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

type ComponentCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  path?: string;
  ModalComponent?: React.FC<ModalProps>;
};

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
};

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  ModalComponent,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {ModalComponent ? (
          <div>
            <Button
              onClick={openModal}
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Tambah Data
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      {ModalComponent && (
        <ModalComponent
          isOpen={isOpen}
          action={"create"}
          closeModal={closeModal}
        />
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
