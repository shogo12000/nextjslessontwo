'use server'

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { z, treeifyError } from "zod";
import { getUserLogin, sql } from "@/ui/actions/actions";
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

const projectSchema = z.object({
    projectName: z
        .string()
        .min(3, "Valid Project name is required"),

    address: z
        .string()
        .min(5, "Valid Address is required"),

    description: z
        .string()
        .optional()
        .or(z.literal("")),

    startDate: z
        .string()
        .optional()
        .or(z.literal("")),

    endDate: z
        .string()
        .optional()
        .or(z.literal("")),

    projectManager: z
        .string()
        .optional()
        .or(z.literal("")),

    clientName: z
        .string()
        .optional()
        .or(z.literal("")),

    projectType: z
        .string()
        .optional()
        .or(z.literal("")),

    status: z.enum(["pending", "in_progress", "completed"]),

    budget: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Budget must be a number"
        ),

    employees: z
        .array(z.string())
        .optional(),

    notes: z
        .string()
        .optional()
        .or(z.literal("")),
});


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
            //redirectTo: "/admin",
            redirect: false
        });


        return { success: true };


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
        const userType = "employee";

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

export async function createProject(previusState: any, formData: FormData) {
    try {
        const user = (await getUserLogin()) ?? { id: "default", name: "Guest" };

        const result = projectSchema.safeParse({
            projectName: formData.get("projectName"),
            address: formData.get("address"),
            description: formData.get("description"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            projectManager: formData.get("projectManager"),
            clientName: formData.get("clientName"),
            projectType: formData.get("projectType"),
            status: formData.get("status"),
            budget: formData.get("budget"),
            employees: formData.getAll("employees"),
            notes: formData.get("notes"),
        });

        if (!result.success) {
            return { errors: treeifyError(result.error) };
        }

        const projectName = result.data.projectName;
        const address = result.data.address;
        const description = result.data.description?.toString() ?? "";
        const startDate = result.data.startDate?.toString() ?? "";
        const endDate = result.data.endDate?.toString() ?? "";

        const projectManager = result.data.projectManager?.toString() ?? "";
        const clientName = result.data.clientName?.toString() ?? "";
        const projectType = result.data.projectType?.toString() ?? "";
        const status = result.data.status?.toString() ?? "";
        const budget = result.data.budget?.toString() ?? "";
        const employees= result.data.employees?.toString() ?? "";
        // const employees: string[] = result.data.employees ?? [];
        const employeesJson = JSON.stringify(employees);
        const notes = result.data.notes?.toString() ?? "";

        const createProject = await sql`
            INSERT INTO users.project(
                userid, 
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
                emp
            )
            VALUES (
                ${user.id}, 
                ${projectName}, 
                ${address}, 
                ${description}, 
                ${startDate}, 
                ${endDate}, 
                ${projectManager}, 
                ${clientName},
                ${projectType},
                ${status},
                ${budget},
                ${employees},
                ${notes},
                ${employeesJson}::jsonb
            )
            RETURNING id
        `;


    } catch (error) {
        console.error("Register error:", error);
        return {
            message: "Something went wrong. Please try again later.",
        };
    }

}