"use client";
import {
  getAllUsers,
  getEmployeeWorkHistory,
} from "@/ui/super/actions/actions";
import { useEffect, useState } from "react";
import { UserDB, WorkHistory } from "@/myTypeScript";

function formatTime(date: string | Date | null) {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function page() {
  const [employee, setEmployee] = useState<UserDB[]>([]);
  const [empHistory, setEmpHistory] = useState<WorkHistory[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      const usersOnly = [...allUsers];
      console.log(usersOnly);
      setEmployee(usersOnly);
    };

    getUsers();
  }, []);

  const getEmployeeId = async (id: string) => {
    if (!id) {
      setEmpHistory([]);
      return;
    }

    const employeeHistory = await getEmployeeWorkHistory(id);
    console.log(employeeHistory);
    setEmpHistory(employeeHistory);
  };

  return (
    <div>
      <h1>Employee Work History</h1>

      <label htmlFor="employee">Employee name: </label>
      <select
        name="userId"
        className="border p-2 rounded"
        id="employee"
        onChange={(e) => getEmployeeId(e.target.value)}
      >
        <option value="">Select a user</option>
        {employee.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* HISTÓRICO */}
      {empHistory.length > 0 && (
        <table className="w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Start Work</th>
              <th className="border p-2">End Work</th>
              <th className="border p-2">Break Start</th>
              <th className="border p-2">Break End</th>
              <th className="border p-2">Break (min)</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">After Break</th>
              <th className="border p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {empHistory.map((row) => (
              <tr key={row.id} className="text-center">
                <td className="border p-2">{formatTime(row.startwork)}</td>

                <td className="border p-2">{formatTime(row.endwork)}</td>

                <td className="border p-2">
                  {/* {row.startbreak ? formatTime(row.startbreak) : "-"} */}
                  {row.startbreak ? row.startbreak : "-"}
                </td>

                <td className="border p-2">
                  {/* {row.endbreak ? formatTime(row.endbreak) : "-"} */}
                  {row.endbreak ? row.endbreak : "-"}
                </td>

                <td className="border p-2">{row.break} min</td>

                <td className="border p-2">{row.totalwork} h</td>

                <td className="border p-2 font-semibold">
                  {row.totalafterbreak} h
                </td>

                <td className="border p-2">{row.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
