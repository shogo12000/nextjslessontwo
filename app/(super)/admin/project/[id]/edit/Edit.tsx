"use client";

import { updateProject } from "@/app/lib/actions";
import { ProjectsTable } from "@/myTypeScript";
import { lusitana } from "@/ui/fonts/fonts";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useActionState, useState } from "react";

type EditProps = {
  data: ProjectsTable;
};

export default function Edit({ data }: EditProps) {
  const employeesArray = data.employees.split(",").map((emp) => emp.trim());

  const [projectForm, setProjectForm] = useState({
    id: data.id,
    projectName: data.projectname || "",
    address: data.address || "",
    description: data.description || "",
    startDate: data.startdate || "",
    endDate: data.enddate || "",
    projectManager: data.projectmanager || "",
    clientName: data.clientname || "",
    projectType: data.projecttype || "",
    status: data.status || "",
    budget: data.budget || "",
    employees: employeesArray,
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

  const updateWithId = updateProject.bind(null, data.id);
  const [errorMessage, formUpdateProject, isPending] = useActionState(
    updateWithId,
    null
  ); 
  
  return (
    <div className="flex w-full justify-center items-start pt-10">
      <form action={formUpdateProject} className="w-full">
        <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
          <h1 className={`${lusitana.className} mb-6 text-2xl`}>
            Create New Project
          </h1>

          <div className="flex flex-col gap-4">
            {/* Project Name */}
            <TextField
              label="Project Name"
              name="projectName"
              value={projectForm.projectName}
              onChange={handleChange}
              placeholder="Renovation Laburnum St"
              required
              fullWidth
            />

            {errorMessage?.errors?.projectName?.[0] && (
              <>
                <p className="text-sm text-red-500">
                  {errorMessage?.errors?.projectName?.[0]}
                </p>
              </>
            )}

            {/* Address */}
            <TextField
              label="Project Address"
              name="address"
              value={projectForm.address}
              onChange={handleChange}
              placeholder="8060 121 Street, Surrey, BC"
              required
              fullWidth
            />

            {errorMessage?.errors?.address?.[0] && (
              <>
                <p className="text-sm text-red-500">
                  {errorMessage?.errors?.address?.[0]}
                </p>
              </>
            )}

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={projectForm.description}
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

            {/* Project Manager */}
            <FormControl fullWidth>
              <InputLabel>Project Manager</InputLabel>
              <Select
                name="projectManager"
                value={projectForm.projectManager}
                onChange={handleChange}
                label="Project Manager"
              >
                <MenuItem value="">Select manager</MenuItem>
                <MenuItem value="john">John</MenuItem>
                <MenuItem value="mary">Mary</MenuItem>
              </Select>
            </FormControl>

            {/* Client Name */}
            <TextField
              label="Client Name"
              name="clientName"
              value={projectForm.clientName}
              onChange={handleChange}
              placeholder="Client name (optional)"
              fullWidth
            />

            {/* Project Type */}
            <FormControl fullWidth>
              <InputLabel>Project Type</InputLabel>
              <Select
                name="projectType"
                value={projectForm.projectType}
                onChange={handleChange}
                label="Project Type"
              >
                <MenuItem value="">Select type</MenuItem>
                <MenuItem value="renovation">Renovation</MenuItem>
                <MenuItem value="construction">Construction</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={projectForm.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            {/* Budget */}
            <TextField
              label="Budget"
              name="budget"
              type="number"
              value={projectForm.budget}
              onChange={handleChange}
              fullWidth
            />

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
                <MenuItem value="emp1">Employee 1</MenuItem>
                <MenuItem value="emp2">Employee 2</MenuItem>
                <MenuItem value="emp3">Employee 3</MenuItem>
              </Select>
            </FormControl>

            {/* Notes */}
            <TextField
              label="Notes"
              name="notes"
              value={projectForm.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            {errorMessage?.message && (
              <>
                <p className="text-sm text-red-500">
                  {errorMessage?.message}
                </p>
              </>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="mt-2"
            >
              Update Project
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
