import { ArrowRightIcon } from "@mui/x-date-pickers";
import Link from "next/link";

export function CreateProject() {
  return (
    <Link
      href="/admin/project/create"
      className="
        flex h-14 items-center gap-2
        rounded bg-[#1976d2]
        px-4 text-[14px] font-medium text-white
        hover:bg-[#1565c0]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        whitespace-nowrap
        "
    >
      New Project
      <span className="hidden md:flex">
        <ArrowRightIcon className="h-5 w-5" />
      </span>
    </Link>
  );
}
