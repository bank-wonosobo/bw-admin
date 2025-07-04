"use client";
import { useQueryClient } from "@tanstack/react-query";
import { removeAuthToken } from "@/api/api";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    removeAuthToken();
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    router.push("/signup");
  };
}
