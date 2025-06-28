"use client";
import { apiV1, apiV1user } from "@/api/api";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { LoginFormInput, loginSchema } from "@/validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SignInForm() {
  const methods = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset();
  }, [reset]);

  const queryClient = useQueryClient();

  const { mutate: login, isPending: isPendingCreate } = useMutation({
    mutationFn: async (data: LoginFormInput) => {
      const payload = {
        ...data,
        device_info: "web",
      };

      const res = await apiV1user.post(`/login`, payload);
      return res.data.data;
    },
    onError: (err: any) => {
      console.error("Login Error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan pengiriman data login.";
      toast.error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Login berhasil.");
    },
  });

  const onSubmitForm = (data: LoginFormInput) => {
    login(data);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="example@gmail.com"
                    type="email"
                    {...register("email")}
                    hint={errors.email?.message}
                    error={!!errors.email}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      hint={errors.password?.message}
                      error={!!errors.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
