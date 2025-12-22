"use client";

import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { lusitana } from "@/ui/fonts/fonts";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { Button } from "@/ui/Button";
import { TextField } from "@mui/material";

type WorkDay = {
  startWork: Dayjs | null;
  endWork: Dayjs | null;
  totalWork: string;
  totalBreak: string;
  totalAfterBreak: string;
  address: string;
};

function daysWorked(
  startWork: Dayjs | null,
  endWork: Dayjs | null,
  totalWork: string,
  totalBreak: string,
  totalAfterBreak: string,
  address: string,
  setWorkedDays: React.Dispatch<React.SetStateAction<WorkDay[]>>,
  setStartWork: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  setEndWork: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  setStartBreak: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  setEndBreak: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  setAddress: React.Dispatch<React.SetStateAction<string>>
) {
  setWorkedDays((prev) => [
    ...prev,
    {
      startWork,
      endWork,
      totalWork,
      totalBreak,
      totalAfterBreak,
      address,
    },
  ]);
  setAddress("");
  setStartWork(null);
  setEndWork(null);
  setStartBreak(null);
  setEndBreak(null);
}

export default function MyHours() {
  const [startWork, setStartWork] = useState<Dayjs | null>(null);
  const [endWork, setEndWork] = useState<Dayjs | null>(null);
  const [workedDays, setWorkedDays] = useState<WorkDay[]>([]);
  const [startBreak, setStartBreak] = useState<Dayjs | null>(null);
  const [endBreak, setEndBreak] = useState<Dayjs | null>(null);
  const [address, setAddress] = useState<string>("");

  // Total de horas trabalhadas sem descontar o break
  const totalWork = useMemo(() => {
    if (!startWork || !endWork) return "--";
    if (endWork.isBefore(startWork)) return "Invalid work time";

    const minutes = endWork.diff(startWork, "minute");
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }, [startWork, endWork]);

  // Total de horas de break
  const totalBreak = useMemo(() => {
    if (!startBreak || !endBreak) return "--";
    if (endBreak.isBefore(startBreak)) return "Invalid break time";

    const minutes = endBreak.diff(startBreak, "minute");
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }, [startBreak, endBreak]);

  // Total de horas trabalhadas descontando o break
  const totalAfterBreak = useMemo(() => {
    if (!startWork || !endWork) return "--";
    if (endWork.isBefore(startWork)) return "Invalid work time";

    let workMinutes = endWork.diff(startWork, "minute");

    if (startBreak && endBreak && endBreak.isAfter(startBreak)) {
      const breakMinutes = endBreak.diff(startBreak, "minute");
      workMinutes -= breakMinutes;
      if (workMinutes < 0) return "Invalid break time";
    }

    const hours = Math.floor(workMinutes / 60);
    const mins = workMinutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }, [startWork, endWork, startBreak, endBreak]);

  const removeWorkedDay = (indexToRemove: number) => {
    setWorkedDays((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <form className="bg-gray-50 w-full p-6 max-w-3xl m-auto">
        <div className="mb-6">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>Address</h1>
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </div>

        {/* Work Time */}
        <div className="mb-6">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>Work Time</h1>
          <div className="flex gap-4">
            <DateTimePicker
              label="Start Work"
              ampm={false}
              value={startWork}
              onChange={setStartWork}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DateTimePicker
              label="End Work"
              ampm={false}
              value={endWork}
              onChange={setEndWork}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
        </div>

        {/* Break Time */}
        <div className="mb-6">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>Break Time</h1>
          <div className="flex gap-4">
            <TimePicker
              label="Start Break"
              ampm={false}
              value={startBreak}
              onChange={setStartBreak}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="End Break"
              ampm={false}
              value={endBreak}
              onChange={setEndBreak}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-rol gap-2 justify-between">
          <div className="rounded-md   p-4 text-lg font-medium">
            Total Work (without break):{" "}
            <div className="font-bold text-blue-600">{totalWork ?? "--"}</div>
          </div>
          <div className="rounded-md  p-4 text-lg font-medium">
            Total Break:{" "}
            <div className="font-bold text-red-600">{totalBreak ?? "--"}</div>
          </div>
          <div className="rounded-md  p-4 text-lg font-medium">
            Total Work (after break):{" "}
            <div className="font-bold text-green-600">
              {totalAfterBreak ?? "--"}
            </div>
          </div>
        </div>
        {totalWork !== "--" && totalWork !== "Invalid work time" && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              daysWorked(
                startWork,
                endWork,
                totalWork,
                totalBreak,
                totalAfterBreak,
                address,
                setWorkedDays,
                setStartWork,
                setEndWork,
                setStartBreak,
                setEndBreak,
                setAddress
              );
            }}
            className="flex-1"
          >
            Add
          </Button>
        )}
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Worked Days</h2>

        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Start Time</th>
              <th className="border px-4 py-2 text-left">End Time</th>
              <th className="border px-4 py-2 text-left">Break</th>
              <th className="border px-4 py-2 text-left">
                Total Hours - Break
              </th>
              <th className="border px-4 py-2 text-left">Address</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {workedDays.map((day, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border px-4 py-2">
                  {day.startWork
                    ? day.startWork.format("YYYY-MM-DD HH:mm")
                    : "--"}
                </td>
                <td className="border px-4 py-2">
                  {day.endWork ? day.endWork.format("YYYY-MM-DD HH:mm") : "--"}
                </td>
                <td className="border px-4 py-2">{day.totalBreak}</td>
                <td className="border px-4 py-2">{day.totalAfterBreak}</td>
                <td className="border px-4 py-2">{day.address}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => removeWorkedDay(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workedDays.length > 0 && (
          <Button
            onClick={async () => {
              try {
                const res = await fetch("/api/send-email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    workedDays: workedDays.map((day) => ({
                      startWork: day.startWork
                        ? day.startWork.format("YYYY-MM-DD HH:mm")
                        : "--",
                      endWork: day.endWork
                        ? day.endWork.format("YYYY-MM-DD HH:mm")
                        : "--",
                      totalBreak: day.totalBreak,
                      totalAfterBreak: day.totalAfterBreak,
                      address: day.address,
                    })),
                  }),
                });

                if (!res.ok) throw new Error("Failed to send email");

                alert("Email enviado com sucesso!");
              } catch (err) {
                console.error(err);
                alert("Erro ao enviar email");
              }
            }}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
