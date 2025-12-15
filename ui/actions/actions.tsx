'use server'

import { auth } from "@/auth"


export async function getUserLogin(){
    const user = await auth();
    return user?.user;
}