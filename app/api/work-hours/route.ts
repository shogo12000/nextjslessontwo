import { NextResponse } from "next/server";
import { saveWorkHours } from "@/ui/data/data";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user, workedDays } = body;

        console.log(workedDays);
        console.log("?????????????????")
        await saveWorkHours(user, workedDays);

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to save work hours" },
            { status: 500 }
        );
    }
}