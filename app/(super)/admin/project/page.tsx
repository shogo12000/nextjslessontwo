"use client";

import { createProject } from "@/app/lib/actions";
import { lusitana } from "@/ui/fonts/fonts";
import { CreateProject } from "@/ui/project/buttons";
import Search from "@/ui/search";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useActionState, useState } from "react";

export default function Page() {
  const [projectForm, setProjectForm] = useState({
    projectName: "",
    address: "",
    description: "",
    startDate: "",
    endDate: "",
    projectManager: "",
    clientName: "",
    projectType: "",
    status: "pending",
    budget: "",
    employees: [] as string[],
    notes: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    // Para multi-select, value é array
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errorMessage, formCreateProject, isPending] = useActionState(
    createProject,
    null
  ); 

  return (
    <div className="flex w-full justify-center items-start pt-10">
      <form className="w-full">
        <div className="flex items-center gap-0">
          <Search />
          <CreateProject />
        </div>
      </form>
    </div>
  );
}
