import { lusitana } from "@/ui/fonts/fonts";

export default function Page() {
  return (
    <div className="flex w-full min-h-screen justify-center items-start pt-10">
      <form className="w-full max-w-full">
        <div className="rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow">
          <h1 className={`${lusitana.className} mb-6 text-2xl`}>
            Create New Project
          </h1>

          <div className="flex flex-col gap-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                placeholder="Renovation Laburnum St"
                required
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Project Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="8060 121 Street, Surrey, BC"
                required
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Brief project description"
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Project Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Project Manager
              </label>
              <select
                name="projectManager"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Select manager</option>
                <option value="john">John</option>
                <option value="mary">Mary</option>
              </select>
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="Client name (optional)"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Project Type
              </label>
              <select
                name="projectType"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                <option value="renovation">Renovation</option>
                <option value="construction">Construction</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Status
              </label>
              <select
                name="status"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                placeholder="Estimated budget"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Assigned Employees */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Assigned Employees
              </label>
              <select
                name="employees"
                multiple
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm h-24"
              >
                <option value="emp1">Employee 1</option>
                <option value="emp2">Employee 2</option>
                <option value="emp3">Employee 3</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Additional information"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
