'use server'

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { z, treeifyError } from "zod";
import { registerUser } from "@/ui/actions/actions";
import { sql } from "@/ui/actions/actions";
import bcrypt from "bcrypt";

const loginSchema = z.object({
    email: z.email({ error: "invalid Email" }),
    password: z.string().min(3, { error: "Invalid Password" }),
})

const registerSchema = z.object({
    name: z.string().min(6, { error: "Name Min 6 char" }),
    email: z.email({ error: "Invalid Email" }),
    password: z.string().min(6, { error: "Password Min 6 char" }),
    passwordrepeat: z.string().min(6, { error: "Password min 6 characters" }),
}).refine(
    (data) => data.password === data.passwordrepeat,
    {
        message: "Passwords do not match",
        path: ["passwordrepeat"], // erro aparece nesse campo
    }
);

export async function login(previusState: any, formData: FormData) {
    try {
        const result = loginSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });


        if (!result.success) {
            return { errors: treeifyError(result.error) };
        }

        await signIn('credentials', {
            email: result.data.email,
            password: result.data.password,
            redirectTo: "/dashboard",
        });

    } catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { message: "Invalid credentials." };
            } 
        }
        throw error;
    }
}

export async function register(previusState: any, formData: FormData) {
    try {
        const result = registerSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            passwordrepeat: formData.get('passwordrepeat'),
        });

        if (!result.success) {
            return { errors: treeifyError(result.error) };
        }

        const email = result.data.email;
        const hashedPassword = await bcrypt.hash(result.data.password, 10);
        const name = result.data.name;
        const userType = "admin";

        const verifyEmail = await sql`
        SELECT email
        FROM users.usertb
        WHERE email = ${email}
        LIMIT 1
        `;

        if (verifyEmail.count > 0) {
            return {
                message: "User already exist!!!"
            }
        }

        const user = await sql`
            INSERT INTO users.usertb (name, email, password, usertype)
            VALUES (${name}, ${email}, ${hashedPassword}, ${userType})
            RETURNING id, name, email, usertype
            `;

        console.log(user)
        return { success: true }
    } catch (error) {
        console.error("Register error:", error);
        return {
            message: "Something went wrong. Please try again later.",
        };
    }
    // redirect("/login");

}