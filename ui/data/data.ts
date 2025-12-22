"use server"

import postgres from "postgres";
import bcrypt from "bcrypt";

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