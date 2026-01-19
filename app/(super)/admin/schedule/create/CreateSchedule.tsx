"use client";

import { lusitana } from "@/ui/fonts/fonts";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import {
  getAllEmployees,
  getAllProjects,
  getScheduleById,
} from "@/ui/data/data";

type Props = {
  createSchedule: (prevState: any, formData: FormData) => Promise<any>;
  mode?: "create" | "edit";
  scheduleId?: string;
};

export default function CreateSchedule({
  createSchedule,
  mode,
  scheduleId,
}: Props) {
  /* =======================
     FORM STATE
  ======================= */
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

  const [loadingPage, setLoadingPage] = useState(true);

  /* =======================
     HANDLE CHANGE
  ======================= */
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================
     LOAD PROJECTS + EMPLOYEES
  ======================= */
  useEffect(() => {
    const loadBaseData = async () => {
      try {
        const [employees, projects] = await Promise.all([
          getAllEmployees(),
          getAllProjects(),
        ]);

        setAllEmployees(employees);
        setAllProjects(projects);
      } catch (err) {
        console.error("Error loading base data", err);
      }
    };

    loadBaseData();
  }, []);

  /* =======================
     LOAD SCHEDULE (EDIT)
  ======================= */
  useEffect(() => {
    if (mode === "edit" && scheduleId) {
      const loadSchedule = async () => {
        try {
          const [schedule] = await getScheduleById(scheduleId);

          if (!schedule) return;

          setProjectForm({
            projects: schedule.project_id,
            tasks: schedule.tasks,
            startDate: schedule.start_date,
            endDate: schedule.end_date,
            employees: schedule.employees
              ? schedule.employees.split(",")
              : [],
          });
        } catch (err) {
          console.error("Error loading schedule", err);
        } finally {
          setLoadingPage(false);
        }
      };

      loadSchedule();
    } else {
      setLoadingPage(false);
    }
  }, [mode, scheduleId]);

  /* =======================
     SERVER ACTION
  ======================= */
  const [errorMessage, formCreateSchedule, isPending] = useActionState(
    createSchedule,
    null
  );

  /* =======================
     RENDER
  ======================= */
  if (loadingPage) {
    return (
      <div className="flex w-full justify-center pt-10">
        <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
          <h1 className={`${lusitana.className} text-2xl`}>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center items-start pt-10">
      <form action={formCreateSchedule} className="w-full">
        {/* hidden id for EDIT */}
        {mode === "edit" && scheduleId && (
          <input type="hidden" name="scheduleId" value={scheduleId} />
        )}

        <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
          <h1 className={`${lusitana.className} mb-6 text-2xl`}>
            {mode === "create" ? "Create Schedule" : "Edit Schedule"}
          </h1>

          <div className="flex flex-col gap-4">
            {/* Project */}
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                name="projects"
                value={projectForm.projects}
                onChange={handleChange}
                label="Project"
              >
                {allProjects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.projectname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errorMessage?.errors?.properties?.projects?.errors[0] && (
              <p className="text-sm text-red-500">
                {errorMessage.errors.properties.projects.errors[0]}
              </p>
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
            <div className="grid grid-cols-2 gap-3">
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

            {/* Employees */}
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
                  <MenuItem key={emp.id} value={emp.name}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
            >
              {mode === "create" ? "Create Schedule" : "Update Schedule"}
            </Button>

            {errorMessage?.message && (
              <p className="text-sm text-red-500">{errorMessage.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
