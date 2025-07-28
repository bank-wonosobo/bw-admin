import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiV1user } from "@/api/api";
import { LoginFormInput } from "@/validation/loginSchema";
import type { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormInput) => {
      const payload = {
        ...data,
        device_info: "web",
      };

      const res = await apiV1user.post("/login", payload);
      const loginInfo = res.data.data;

      Cookies.set("token", loginInfo.token, {
        expires: 1,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return loginInfo;
    },

    onSuccess: async () => {
      toast.success("Login berhasil.");
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/jaringan-kantor");
    },

    onError: (err: unknown) => {
      console.error("Login Error:", err);

      let message = "Terjadi kesalahan saat login.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        message =
          axiosErr.response?.data?.message || axiosErr.message || message;
      }

      toast.error(message);
    },
  });
};
