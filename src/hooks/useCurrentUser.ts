import { useQuery } from "@tanstack/react-query";
import { apiV1user } from "@/api/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await apiV1user.get("/current");
      return res.data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
