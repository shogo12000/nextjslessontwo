"use client";

import { createProject, createSchedule } from "@/app/lib/actions";
import { lusitana } from "@/ui/fonts/fonts";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useActionState, useState, useEffect } from "react";
import { getAllEmployees, getAllProjects } from "@/ui/data/data";

export default function CreateSchedule() {
  const [projectForm, setProjectForm] = useState({
    projects: "",
    tasks: "",
    startDate: "",
    endDate: "",
    employees: [] as string[],
  });

  const [allEmployees, setAllEmployees] = useState<
    { id: string; name: string }[]
  >([]);

  const [allProjects, setAllProjects] = useState<
    { id: string; projectname: string }[]
  >([]);

  const [loadingPage, setLoadingPage] = useState(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    // Para multi-select, value é array
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoadingPage(true);

        const [resultEmployees, resultProjects] = await Promise.all([
          getAllEmployees(),
          getAllProjects(),
        ]);
        setAllProjects(resultProjects);
        setAllEmployees(resultEmployees);
        // se precisar depois:
        // setAllProjects(resultProjects);

        console.log(resultProjects);
        console.log(resultEmployees);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoadingPage(false);
      }
    };

    getEmployees();
  }, []);

  const [errorMessage, formCreateSchedule, isPending] = useActionState(
    createSchedule,
    null
  );

 

  return (
    <div className="flex w-full justify-center items-start pt-10">
      {loadingPage ? (
        <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
          <h1 className={`${lusitana.className} mb-6 text-2xl`}>Loading...</h1>
        </div>
      ) : (
        <form action={formCreateSchedule} className="w-full  ">
          <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
            <h1 className={`${lusitana.className} mb-6 text-2xl`}>
              Create Schedule
            </h1>

            <div className="flex flex-col gap-4">
              {/* Project Name */}
              {/* Assigned Employees */}
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projects"
                  //   multiple
                  value={projectForm.projects}
                  onChange={handleChange}
                  label="Project"
                >
                  {allProjects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.projectname}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value="emp1">Employee 1</MenuItem>
                  <MenuItem value="emp2">Employee 2</MenuItem>
                  <MenuItem value="emp3">Employee 3</MenuItem> */}
                </Select>
              </FormControl>

              {errorMessage?.errors?.properties?.projects?.errors[0] && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.errors?.properties?.projects?.errors[0]}
                  </p>
                </>
              )}

              {/* Tasks */}
              <TextField
                label="Tasks"
                name="tasks"
                value={projectForm.tasks}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />

              {/* Dates */}
              <div className="w-full grid grid-cols-2 gap-3">
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={projectForm.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </div>

              <div className="w-full grid grid-cols-2 gap-3">
                {errorMessage?.errors?.properties?.startDate?.errors[0] ? (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage?.errors?.properties?.startDate?.errors[0]}
                    </p>
                  </>
                ) : (
                  <span></span>
                )}

                {errorMessage?.errors?.properties?.endDate?.errors[0] && (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage?.errors?.properties?.endDate?.errors[0]}
                    </p>
                  </>
                )}
              </div>
              {/* Assigned Employees */}
              <FormControl fullWidth>
                <InputLabel>Assigned Employees</InputLabel>
                <Select
                  name="employees"
                  multiple
                  value={projectForm.employees}
                  onChange={handleChange}
                  label="Assigned Employees"
                >
                  {allEmployees.map((emp) => (
                    <MenuItem key={emp.name} value={emp.name}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errorMessage?.errors?.properties?.employees?.errors[0] && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.errors?.properties?.employees?.errors[0]}
                  </p>
                </>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                className="mt-2"
                onClick={() => console.log(projectForm)}
              >
                Create Schedule
              </Button>

              {errorMessage?.message && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.message}
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
