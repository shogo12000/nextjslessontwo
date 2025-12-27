"use client";
import { getUserLogin } from "@/ui/actions/actions";
import { useEffect } from "react";

export default function page() {
 
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Somente admins podem ver isso</p>
    </div>
  );
}
