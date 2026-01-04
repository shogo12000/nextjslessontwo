import { fetchFilterProjects } from "../data/data";
import Link from "next/link";

function parseEmployees(employeesStr: string | null | undefined): string {
  if (!employeesStr) return "0"; // se vazio ou null retorna array vazio

  const emp = employeesStr
    .split(",") // separa por vírgula
    .map((e) => e.trim()) // remove espaços extras
    .filter((e) => e.length > 0); // remove strings vazias

  return emp.length.toString();
}

export default async function ShowAllTables({ query }: { query: string }) {
  const projects = await fetchFilterProjects(query);

  console.log(projects);
  return (
    <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {project.projectname}
            </h2>

            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  project.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : project.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {project.status}
              </span>

              {/* EDIT BUTTON */}
              <Link
                href={`/admin/project/${project.id}/edit`}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                ✏️ Edit
              </Link>
            </div>
          </div>

          {/* Address */}
          <p className="mb-3 text-sm text-gray-600">📍 {project.address}</p>

          {/* Description */}
          {project.description && (
            <p className="mb-3 text-sm text-gray-700 line-clamp-2">
              Description: {project.description}
            </p>
          )}

          {/* Meta info */}
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Manager:</strong> {project.projectmanager || "—"}
            </p>
            <p>
              <strong>Client:</strong> {project.clientname || "—"}
            </p>
            <p>
              <strong>Type:</strong> {project.projecttype || "—"}
            </p>

            <p>
              <strong>Start:</strong> {project.startdate || "—"}
            </p>
            <p>
              <strong>End:</strong> {project.enddate || "—"}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm text-gray-500">
            <span>
              💰 {project.budget ? `$${project.budget}` : "No budget"}
            </span>

            <span>
              👥 {parseEmployees(project.employees)}
              {/* {project.employees}
              employees */}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
