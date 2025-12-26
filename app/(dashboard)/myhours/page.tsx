"use client";

import { useState, useMemo, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { lusitana } from "@/ui/fonts/fonts";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { Button } from "@/ui/Button";
import { TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { getUserLogin } from "@/ui/actions/actions";
import { saveWorkHours } from "@/ui/data/data";

type WorkDay = {
  startWork: Dayjs | null;
  endWork: Dayjs | null;
  startBreak: Dayjs | null;
  endBreak: Dayjs | null;
  totalWork: string;
  totalBreak: string;
  totalAfterBreak: string;
  address: string;
};

type User = {
  id: string;
  userType: string;
  name?: string | null;
  email?: string | null;
};

function daysWorked(
  startWork: Dayjs | null,
  endWork: Dayjs | null,
  startBreak: Dayjs | null,
  endBreak: Dayjs | null,
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
      startBreak,
      endBreak,
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

function workedDaysF(workedDays: WorkDay[]) {
  const WorkedToString = workedDays.map((day) => ({
    startWork: day.startWork?.format("YYYY-MM-DD HH:mm") ?? "--",
    endWork: day.endWork?.format("YYYY-MM-DD HH:mm") ?? "--",
    startBreak: day.startBreak?.format("HH:mm") ?? "--",
    endBreak: day.endBreak?.format("HH:mm") ?? "--",
    totalWork: day.totalWork,
    totalBreak: day.totalBreak,
    totalAfterBreak: day.totalAfterBreak,
    address: day.address,
  }));

  return WorkedToString;
}

export default function MyHours() {
  const [startWork, setStartWork] = useState<Dayjs | null>(null);
  const [endWork, setEndWork] = useState<Dayjs | null>(null);
  const [workedDays, setWorkedDays] = useState<WorkDay[]>([]);
  const [startBreak, setStartBreak] = useState<Dayjs | null>(null);
  const [endBreak, setEndBreak] = useState<Dayjs | null>(null);
  const [address, setAddress] = useState<string>("");
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({
    id: "",
    userType: "",
    name: null,
    email: null,
  });

  useEffect(() => {
    const getUser = async () => {
      const user = await getUserLogin();
      if (user) {
        setUser(user);
      }
    };
    getUser();
  }, [status]);

  const totalWork = useMemo(() => {
    if (!startWork || !endWork) return "--";
    if (endWork.isBefore(startWork)) return "Invalid work time";
    const minutes = endWork.diff(startWork, "minute");
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }, [startWork, endWork]);

  const totalBreak = useMemo(() => {
    if (!startBreak || !endBreak) return "--";
    if (endBreak.isBefore(startBreak)) return "Invalid break time";
    const minutes = endBreak.diff(startBreak, "minute");
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }, [startBreak, endBreak]);

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
          <h1 className={`${lusitana.className} mb-3 text-lg sm:text-sm`}>
            Address
          </h1>
          <TextField
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mb-6">
          <h1 className={`${lusitana.className} mb-3 text-lg sm:text-sm`}>
            Work Time
          </h1>
          <div className="flex gap-4 flex-wrap">
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

        <div className="mb-6">
          <h1 className={`${lusitana.className} mb-3 text-lg sm:text-sm`}>
            Break Time
          </h1>
          <div className="flex gap-4 flex-wrap">
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

        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="rounded-md p-4 text-base sm:text-sm font-medium">
            Total Work (without break):{" "}
            <div className="font-bold text-blue-600">{totalWork}</div>
          </div>
          <div className="rounded-md p-4 text-base sm:text-sm font-medium">
            Total Break:{" "}
            <div className="font-bold text-red-600">{totalBreak}</div>
          </div>
          <div className="rounded-md p-4 text-base sm:text-sm font-medium">
            Total Work (after break):{" "}
            <div className="font-bold text-green-600">{totalAfterBreak}</div>
          </div>
        </div>

        {totalWork !== "--" && totalWork !== "Invalid work time" && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              daysWorked(
                startWork,
                endWork,
                startBreak,
                endBreak,
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
            className="flex-1 mt-4"
          >
            Add
          </Button>
        )}
      </form>

      {workedDays.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h2 className="text-lg sm:text-base font-bold mb-2">Worked Days</h2>
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm sm:text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Start Time</th>
                <th className="border px-2 py-1 text-left">End Time</th>
                <th className="border px-2 py-1 text-left">Break</th>
                <th className="border px-2 py-1 text-left">
                  Total Hours - Break
                </th>
                <th className="border px-2 py-1 text-left">Address</th>
                <th className="border px-2 py-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workedDays.map((day, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">
                    {day.startWork
                      ? day.startWork.format("YYYY-MM-DD HH:mm")
                      : "--"}
                  </td>
                  <td className="border px-2 py-1">
                    {day.endWork
                      ? day.endWork.format("YYYY-MM-DD HH:mm")
                      : "--"}
                  </td>
                  <td className="border px-2 py-1">{day.totalBreak}</td>
                  <td className="border px-2 py-1">{day.totalAfterBreak}</td>
                  <td className="border px-2 py-1">{day.address}</td>
                  <td className="border px-2 py-1 text-center">
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

          <Button
            onClick={async () => { 
              const myWork = workedDaysF(workedDays);
              console.log(myWork);
              try {
                const res = await fetch("/api/send-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: user,
                    workedDays: myWork,
                  }),
                });
                if (!res.ok) throw new Error("Failed to send email");

                await fetch("/api/work-hours", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user,
                    workedDays: myWork,
                  }),
                });

                setWorkedDays([]);
                alert("Email enviado com sucesso!");
              } catch (err) {
                console.error(err);
                alert("Erro ao enviar email");
              }
            }}
            className="mt-4"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
