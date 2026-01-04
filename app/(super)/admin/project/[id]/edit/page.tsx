 
import { fetchProjectById } from "@/ui/data/data";
import Edit from "./Edit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;  

  const data = await fetchProjectById(id);

  console.log(data);  

  return (
    
    <Edit data={data}/>
  );
}
