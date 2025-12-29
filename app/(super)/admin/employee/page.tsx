"use client";
import { getAllUsers } from "@/ui/super/actions/actions";
import { useEffect, useState } from "react";
import { UserDB } from "@/myTypeScript";

export default function page() {
  const [employee, setEmployee] = useState<UserDB[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      const usersOnly = [...allUsers];
      console.log(usersOnly);
      setEmployee(usersOnly);
    };

    getUsers();
  }, []);

  const getEmployeeId = (e: string) => {
    console.log(e);
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
    </div>
  );
}
