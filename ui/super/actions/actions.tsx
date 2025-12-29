"use server";

import postgres from "postgres";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { UserDB, WorkHistory } from "@/myTypeScript";
import { redirect } from "next/navigation";

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login"); // encerra execução
  }

  if (session?.user.userType != "admin") {
    redirect("/login");
  }

  return session.user;
}

export async function getAllUsers() {
  await requireAuth();

  try {
    const user = await sql<UserDB[]>`
      SELECT id, name, email, usertype AS "userType"
      FROM users.usertb WHERE usertype = 'employee'
    `;

    return user;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw err;
  }
}

 

export async function getEmployeeWorkHistory(userid:string) {
  await requireAuth();
  try {
    const user = await sql<WorkHistory[]>`
      SELECT id, startwork, endwork, break, totalwork, totalafterbreak, address, startbreak, endbreak
      FROM users.employeehours  WHERE employeeid = ${userid}
    `;

    return user;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw err;
  }
}
