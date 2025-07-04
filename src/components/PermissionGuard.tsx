"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    if (
      !isLoading &&
      !user
      //   (!user || !user.permissions.includes(requiredPermission))
    ) {
      router.replace("/signin");
    }
  }, [isLoading, user, requiredPermission, router]);

  if (isLoading || !user) return null;
  //   if (!user.permissions.includes(requiredPermission)) return null;

  return <>{children}</>;
}
