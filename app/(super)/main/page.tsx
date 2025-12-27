import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
 
  return (
    <div>
      <h1>pagina home</h1>
      <p>Somente admins podem ver isso</p>
    </div>
  );
}
