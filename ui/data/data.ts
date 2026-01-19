"use server"

import postgres from "postgres";
import bcrypt from "bcrypt";
import { UserDB, WorkDayDB, ProjectsTable } from "@/myTypeScript";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function fetchFilterProjects(query: string, currentPage: number) {
  const ITEMS_PER_PAGE = 6;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const projects = await sql<ProjectsTable[]>`
      SELECT
        id,
        projectname, 
        address, 
        description,
        startdate,
        enddate,
        projectmanager,
        clientname,
        projecttype,
        status,
        budget,
        employees,
        notes,
        emp::jsonb
      FROM users.project WHERE 
        projectname ILIKE ${`%${query}%`} OR
        address ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        startdate ILIKE ${`%${query}%`} OR
        enddate ILIKE ${`%${query}%`} OR
        projectmanager ILIKE ${`%${query}%`} OR
        clientname ILIKE ${`%${query}%`} OR
        projecttype ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`} OR
        budget ILIKE ${`%${query}%`} OR
        employees ILIKE ${`%${query}%`} OR
        notes ILIKE ${`%${query}%`}
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    return projects;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}


export async function fetchProjectById(id: string) {
  try {
    const data = await sql<ProjectsTable[]>`
      SELECT 
        id,
        projectname,
        address,
        description,
        userid,
        startdate,
        enddate,
        projectmanager,
        clientname,
        projecttype,
        status,
        budget,
        employees,
        notes
      FROM users.project 
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}

export async function fetchProjectPages(query: string) {
  const ITEMS_PER_PAGE = 6;
  try {
    const data = await sql`SELECT COUNT(*)
    FROM users.project
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function getAllEmployees() {
  try {
    const data = await sql<{ id: string, name: string }[]> `SELECT id, name FROM users.usertb WHERE usertype= ${"employee"}`;
    return data;
  } catch (error) {
    throw new Error('Failed to get employees.')
  }

}

export async function getAllProjects() {
  try {
    const allProjects = await sql<{ id: string, projectname: string }[]>`
            SELECT id, projectname FROM users.project; 
        `;

    return allProjects;
  } catch (error) {
    throw new Error("Failed to get project!")
  }

}

export async function getSchedule() {
  try {
    const allSchedules = await sql<{ id: string, title: string, employees: String, tasks: String, start_date: string, end_date: string }[]>`
            SELECT id, title, employees, tasks, start_date, end_date FROM users.schedule; 
        `;

    return allSchedules;
  } catch (error) {
    throw new Error("Failed to get schedule")
  }

}

export async function deleteSchedule(id: string) {
  try {
    if (!id) {
      throw new Error("ID is required");
    }

    await sql`
    DELETE FROM users.schedule
    WHERE id = ${id}
  `;

    return { success: true };
  } catch (error) {
    throw new Error("Error try Again!!!")
  }
}



export async function getScheduleById(id: string) {
  try {

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await sql`
    SELECT * FROM users.schedule
    WHERE id = ${id}
  `;

    return result;

  } catch (error) {
    throw new Error("ID Error try Again!!!")
  }
}