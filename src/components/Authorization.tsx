"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoading from "./PageLoading";

export default function Authorization({
  requiredPermission,
  children,
}: {
  requiredPermission?: string;
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

  return <>{children}</>;
}
