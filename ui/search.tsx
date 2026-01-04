"use client"

import { TextField } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <TextField
      label="Search Project"
      name="searchProject"
      placeholder="Search Project"
      onChange={(e) => handleSearch(e.target.value)}
      fullWidth
    />
  );
}
