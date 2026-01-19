"use client";
import { useRouter } from "next/navigation";

export function BtnCreateSchedule() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin/schedule/create?mode=create");
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-14 items-center gap-2 justify-between rounded bg-[#1976d2] px-4 text-white"
    >
      New Schedule
    </button>
  );
}



// "use client"
// import { ArrowRightIcon } from "@mui/x-date-pickers";
// import Link from "next/link";

// export function BtnCreateSchedule() {
//   return (
//     <Link
//       href="/admin/schedule/create"
//       className="
//         flex h-14 items-center gap-2 justify-between
//         rounded bg-[#1976d2]
//         px-4 text-[14px] font-medium text-white
//         hover:bg-[#1565c0]
//         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
//         whitespace-nowrap
//         "
//     >
//       <span className="md:hidden">Create New Schedule</span>
 
//       <span className="hidden md:block">New Schedule</span>
     
//         <ArrowRightIcon className="h-5 w-5" />
     
//     </Link>
//   );
// }