"use server";

import postgres from "postgres";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { signOut } from "@/auth";

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUserLogin() {
  const user = await auth();
  return user?.user;
}

export async function registerUser() {
  const hashedPassword = await bcrypt.hash("teste", 10);

  const user = await sql`
        INSERT INTO users.usertb (name, email, password, usertype)
        VALUES ('shogo', 'shogo12000@hotmail.com', ${hashedPassword}, 'admin')
        RETURNING id, name, email, usertype
      `;
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function loginUser(email: string) {
  const user = await sql`
      SELECT id, name, email, password, usertype
      FROM users.usertb
      WHERE email = ${email}
      LIMIT 1
    `;

  return user;

  //  if(user.count === 0) return null;

  //  const isValid = await bcrypt.compare(password, user[0].password);

  //  if (!isValid) return null;

  //  return {
  //   id: user[0].id,
  //   name: user[0].name,
  //   userType: user[0].userType,
  //  }
}

export async function savePhoto(
  uploadResult: any,
  file: { name: string },
  user: { id: string },
  workAddress: string
) {
  try {
    await sql`
            INSERT INTO users.photos (url, publicid, originalname, userid, workaddress)
            VALUES (${uploadResult.secure_url}, ${uploadResult.public_id}, ${file.name}, ${user.id}, ${workAddress})
        `;
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to save Photo in database." };
  }
}
