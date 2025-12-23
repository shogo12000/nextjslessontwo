import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { workedDays, user } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const rows = workedDays
      .map(
        (day: any) => `
          <tr>
            <td>${day.startWork}</td>
            <td>${day.endWork}</td>
            <td>${day.totalBreak}</td>
            <td>${day.totalAfterBreak}</td>
            <td>${day.address}</td>
          </tr>
        `
      )
      .join("");

    const html = ` 
      <h1>${user.name}</h1>
      <h1>${user.email}</h1>
      <h2>Worked Days</h2>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Break</th>
            <th>Total After Break</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "Worked Hours Report",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
