"use client";

import { PAGE_TITLES } from "@/helper/routes";
import { H1 } from "../typography";
import { FiMenu } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="bg-white sticky top-4 border mb-5 border-line rounded-2xl xl:rounded-3xl px-6 py-5 flex items-center justify-between z-9">
      <H1 className="xl:text-xl">{title}</H1>

      <div className="flex items-center gap-3">
        <FiMenu
          onClick={onMenuClick}
          className="cursor-pointer hover:text-primary duration-300 lg:hidden block"
        />
      </div>

    </header>
  );
}
