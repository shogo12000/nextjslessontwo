import { createProject } from "@/app/lib/actions";
import { lusitana } from "@/ui/fonts/fonts";
import { CreateProject } from "@/ui/project/buttons";
import ShowAllTables from "@/ui/project/showAllProjects";
import Search from "@/ui/search";
import { fetchProjectPages } from "@/ui/data/data";
import Pagination from "@/ui/project/pagination";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParamsx = await searchParams;
  const query = searchParamsx?.query || "";
  const currentPage = Number(searchParamsx?.page) || 1;
  const totalPages = await fetchProjectPages(query);

  return (
    <div className="flex w-full flex-col justify-center items-start pt-10 p-3">
      <div className="w-full flex flex-col gap-2 md:flex-row md:items-center ">
        <Search />
        <CreateProject />
      </div>

      <ShowAllTables query={query} currentPage={currentPage} />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
