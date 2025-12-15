"use client";
import { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { auth } from "@/auth";
import { useEffect } from "react";
import { getUserLogin } from "../actions/actions";

const links = [
  { name: "Home", href: "/home", icon: HomeIcon },
  { name: "Dashboard", href: "/dashboard", icon: DocumentDuplicateIcon },
];

export default function Menu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const user = await getUserLogin();

      if(user?.name){
        setUserName(user.name);
      }
    };

    getUser();
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm">
      {/* Desktop */}
      <div className=" hidden md:flex items-center justify-between">
        <div className="hidden md:flex flex-row items-center gap-2 p-2">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                flex items-center justify-center
                w-40 h-10
                gap-2
                rounded-md
                text-sm font-medium
                p-2.5
                ${isActive ? "bg-sky-100 text-blue-600" : "bg-gray-50"}
                hover:bg-sky-100 hover:text-blue-600
              `}
              >
                <LinkIcon className="w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
        <label className="pr-10">{userName}</label>
        
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden h-12 fixed top-0 left-0 right-0 bg-white z-50 shadow-sm flex items-center justify-between p-2">
        <span className="text-lg font-bold">Menu</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {open ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Links (slide down) */}
      <div
        className={`
          md:hidden
          fixed top-12 left-0 right-0 bg-white z-40
          overflow-hidden transition-all duration-900 ease-in-out
          ${open ? "max-h-96" : "max-h-0"}
        `}
      >
        <div className="flex flex-col gap-1 p-2">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(!open)}
                className={`
                  flex items-center justify-start
                  w-full h-12
                  gap-2
                  rounded-md
                  text-sm font-medium
                  p-2.5
                  border-b border-gray-300
                  last:border-b-0
                  ${isActive ? "bg-sky-100 text-blue-600" : "bg-white"}
                  hover:bg-sky-100 hover:text-blue-600
                `}
              >
                <LinkIcon className="w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer para evitar que o conteúdo fique atrás do menu fixo */}
      <div className="md:hidden h-12"></div>
    </nav>
  );
}
