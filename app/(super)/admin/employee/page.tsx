"use client";
import {
  getAllUsers,
  getEmployeeWorkHistory,
} from "@/ui/super/actions/actions";
import { useEffect, useState } from "react";
import { UserDB, WorkHistory } from "@/myTypeScript";

// Função para formatar hora
function formatTime(date: string | Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Page() {
  const [employee, setEmployee] = useState<UserDB[]>([]);
  const [empHistory, setEmpHistory] = useState<WorkHistory[]>([]);

  // Pegar todos os usuários
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setEmployee([...allUsers]);
    };
    getUsers();
  }, []);

  // Pegar histórico do usuário selecionado
  const getEmployeeId = async (id: string) => {
    if (!id) {
      setEmpHistory([]);
      return;
    }
    const employeeHistory = await getEmployeeWorkHistory(id);
    setEmpHistory(employeeHistory);
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-bold mb-4">Employee Work History</h1>

      <label htmlFor="employee" className="block mb-2 font-medium">
        Employee name:
      </label>
      <select
        name="userId"
        id="employee"
        className="border p-2 rounded w-full max-w-sm mb-4"
        onChange={(e) => getEmployeeId(e.target.value)}
      >
        <option value="">Select a user</option>
        {employee.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {empHistory.length > 0 && (
        <div className="w-full overflow-x-auto border rounded">
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border px-2 py-1">Start Work</th>
                <th className="border px-2 py-1">End Work</th>
                <th className="border px-2 py-1">Break Start</th>
                <th className="border px-2 py-1">Break End</th>
                <th className="border px-2 py-1">Break (min)</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">After Break</th>
                <th className="border px-2 py-1">Address</th>
              </tr>
            </thead>
            <tbody>
              {empHistory.map((row) => (
                <tr key={row.id} className="text-center">
                  <td className="border px-2 py-1">
                    {formatTime(row.startwork)}
                  </td>
                  <td className="border px-2 py-1">
                    {formatTime(row.endwork)}
                  </td>
                  <td className="border px-2 py-1">
                    {row.startbreak ? formatTime(row.startbreak) : "-"}
                  </td>
                  <td className="border px-2 py-1">
                    {row.endbreak ? formatTime(row.endbreak) : "-"}
                  </td>
                  <td className="border px-2 py-1">{row.break} min</td>
                  <td className="border px-2 py-1">{row.totalwork} h</td>
                  <td className="border px-2 py-1 font-semibold">
                    {row.totalafterbreak} h
                  </td>
                  <td className="border px-2 py-1">{row.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {empHistory.length === 0 && (
        <p className="text-gray-500 mt-2">No work history available.</p>
      )}
    </div>
  );
}
