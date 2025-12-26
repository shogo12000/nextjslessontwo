"use server"

import postgres from "postgres";
import bcrypt from "bcrypt";
import { UserDB, WorkDayDB } from "@/myTypeScript";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function createUser(name: string, email: string, password: string, userType: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await sql`
    INSERT INTO usertb (name, email, password, usertype)
    VALUES (${name}, ${email}, ${hashedPassword}, ${userType})
    RETURNING id, name, email, usertype
  `;

  return user[0];
}


export async function saveWorkHours(user: UserDB, workedDays: WorkDayDB[]) {
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  if (workedDays.length === 0) {
    throw new Error("No work hours to save");
  }  

  for (const day of workedDays) {
    console.log("comec................")
    console.log(day);
    console.log("..............")
    await sql`
      INSERT INTO users.employeehours ( 
        employeeid, 
        startwork,
        endwork,
        totalwork,
        break,
        totalafterbreak,
        startbreak,
        endbreak,
        address
      )
        VALUES(
          ${user.id}, 
          ${day.startWork},
          ${day.endWork},
          ${day.totalWork},
          ${day.totalBreak},
          ${day.totalAfterBreak},
          ${day.startBreak},
          ${day.endBreak},
          ${day.address}
        )`;
  } 

  return { success: true };
}

