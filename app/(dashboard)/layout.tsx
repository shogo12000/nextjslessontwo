import Menu from "@/ui/dashboard/menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden w-full ">
      {/* Menu no topo */}
      <div className="w-full flex-none max-w-[1280px] mx-auto">
        <Menu />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 ">
        {children}
      </div>
    </div>
  );
}