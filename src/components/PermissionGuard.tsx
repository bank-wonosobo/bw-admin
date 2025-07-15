"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoading from "./PageLoading";

export default function PermissionGuard({
  requiredPermission,
  children,
}: {
  requiredPermission?: string;
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      !user
      //   (!user || !user.permissions.includes(requiredPermission))
    ) {
      router.replace("/signin");
    }
  }, [isLoading, user, requiredPermission, router]);

  // if (isLoading) return null;

  // if (!user || !user.permissions?.includes(requiredPermission)) {
  //   return null; // atau bisa tampilkan <UnauthorizedPage />
  // }

  if (isLoading || !user) return <PageLoading />;
  //   if (!user.permissions.includes(requiredPermission)) return null;

  return <>{children}</>;
}
