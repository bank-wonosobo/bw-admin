"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoading from "./PageLoading";
import NotFound from "@/app/not-found";

export default function PermissionGuard({
  requiredPermission,
  children,
}: {
  requiredPermission: string;
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [isLoading, user, requiredPermission, router]);

  if (isLoading || !user) return <PageLoading />;

  if (!user.permissions?.includes(requiredPermission)) {
    router.replace("/not-found-page");
  }

  return <>{children}</>;
}
