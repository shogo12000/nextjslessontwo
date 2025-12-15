'use server'

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { z } from "zod";

const loginSchema = z.object({
    email: z.email({ error: "invalid Email" }),
    password: z.string().min(6, { error: "Invalid Password" }),
})

export async function authenticate(previusState: any, formData: FormData) { 
    try {
        await signIn('credentials', formData);
    } catch (error) { 
        console.log(error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }

}