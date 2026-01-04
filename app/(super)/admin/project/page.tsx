import { createProject } from "@/app/lib/actions";
import { lusitana } from "@/ui/fonts/fonts";
import { CreateProject } from "@/ui/project/buttons";
import ShowAllTables from "@/ui/project/showAllProjects";
import Search from "@/ui/search";

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
  console.log(query);

  return (
    <div className="flex w-full flex-col justify-center items-start pt-10 p-3">
      <div className="w-full flex flex-col gap-2 md:flex-row md:items-center ">
        <Search />
        <CreateProject />
      </div>
 
        <ShowAllTables query={query} />
 
    </div>
  );
}
