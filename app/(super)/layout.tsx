"use client";

import Menu from "@/ui/super/menu";
 


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
 
      <div className="flex flex-col max-w-[1280px] m-auto items-center h-screen overflow-hidden w-full ">
        {/* Menu no topo */}
        <div className="w-full flex-none  mx-auto">
          <Menu/>
        </div>

 
            {children}
 
      </div>
 
  );
}
