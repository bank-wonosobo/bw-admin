import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticatd";

import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RedirectIfAuthenticated>
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <ThemeProvider>
          <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
            {children}
            <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
              <div className="relative items-center justify-center  flex z-1">
                <GridShape />
                <div className="flex flex-col items-center max-w-xs">
                  <div className="block mb-4">
                    <p className="text-center mb-2 text-xl text-gray-400 dark:text-white/60">
                      Welcome to
                    </p>
                    <p className="text-center font-bold text-4xl text-gray-400 dark:text-white/60">
                      Dashboard Admin Bank Wonosobo
                    </p>
                    <p className="text-center font-bold text-4xl text-gray-400 dark:text-white/60">
                      . . .
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
              <ThemeTogglerTwo />
            </div>
          </div>
        </ThemeProvider>
      </div>
    </RedirectIfAuthenticated>
  );
}
