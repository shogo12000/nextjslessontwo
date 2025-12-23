"use client";
import Menu from "@/ui/dashboard/menu";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col max-w-[1280px] m-auto items-center h-screen overflow-hidden w-full ">
        {/* Menu no topo */}
        <div className="w-full flex-none  mx-auto">
          <Menu />
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 w-full overflow-y-auto p-6 md:p-12 ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
          </LocalizationProvider>
        </div>
      </div>
    </SessionProvider>
  );
}
