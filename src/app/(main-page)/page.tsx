"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Ecommerce() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/jaringan-kantor");
  });

  // return (
  //   <PermissionGuard requiredPermission="dashboard:view">
  //     <div className="grid grid-cols-12 gap-4 md:gap-6"></div>
  //   </PermissionGuard>
  // );
}
