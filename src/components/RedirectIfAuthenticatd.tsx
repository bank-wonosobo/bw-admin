"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoading from "@/components/PageLoading"; // opsional loading spinner

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
