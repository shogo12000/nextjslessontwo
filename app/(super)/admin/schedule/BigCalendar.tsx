"use client";
import { eachDayOfInterval } from "date-fns";
import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  getDay,
} from "date-fns";
import { deleteSchedule, getSchedule } from "@/ui/data/data";
import Link from "next/link";

type CalendarEvent = {
  id: string;
  idUnique: string;
  title: string;
  employees: string;
  tasks: string;
  start: Date;
  end: Date;
};

const NAV_HEIGHT = 64;

export default function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [schedule, setSchedule] = useState<CalendarEvent[]>([]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);

      setSchedule((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting schedule", error);
      alert("Error deleting schedule");
    }
  };

  useEffect(() => {
    const getSched = async () => {
      const result = await getSchedule();

      const formatted: CalendarEvent[] = result.flatMap((item: any) => {
        // Se a data vem no formato "YYYY-MM-DD", separar ano, mês e dia
        const startParts = item.start_date.split("-"); // ex: "2026-01-12"
        const endParts = item.end_date.split("-");

        // Criar datas apenas com ano, mês e dia (hora = 00:00)
        const localStart = new Date(
          Number(startParts[0]),
          Number(startParts[1]) - 1,
          Number(startParts[2])
        );
        const localEnd = new Date(
          Number(endParts[0]),
          Number(endParts[1]) - 1,
          Number(endParts[2])
        );

        // Cria TODOS os dias entre start e end
        const days = eachDayOfInterval({ start: localStart, end: localEnd });

        return days.map((day: Date) => ({
          id: `${item.id}`, // id único por dia
          idUnique: `${item.id}-${day.toISOString()}`,
          title: item.title ?? "Schedule",
          employees: item.employees ?? "Error",
          tasks: item.tasks ?? "No tasks",
          start: day,
          end: day,
        }));
      });

      setSchedule(formatted);
    };

    getSched();
  }, []);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    allDays.push(day);
    day = addDays(day, 1);
  }

  const isToday = (day: Date) => isSameDay(day, new Date());

  const getDayColor = (day: Date) => {
    const weekday = getDay(day);
    if (weekday === 0) return "bg-red-200"; // Domingo
    if (weekday === 6) return "bg-yellow-200"; // Sábado
    return "bg-blue-50"; // Dias da semana
  };

  return (
    <>
      {/* 🔒 NAVEGAÇÃO FIXA NO MOBILE */}
      <div
        className={`flex w-full justify-between items-center px-4 h-[${NAV_HEIGHT}px] bg-white    
          ${
            isMobile
              ? "fixed top-10 pb-3 pt-5 left-0 right-0"
              : "relative mb-4 pt-5"
          }`}
      >
        <button onClick={prevMonth} className="px-3 py-2 bg-gray-200 rounded">
          &lt; Back
        </button>

        <h2 className="text-lg font-semibold">
          {format(monthStart, "MMMM yyyy")}
        </h2>

        <button onClick={nextMonth} className="px-3 py-2 bg-gray-200 rounded">
          Next &gt;
        </button>
      </div>

      <div
        className={`p-0 bg-white rounded-lg shadow w-full
    ${isMobile ? `pt-[${NAV_HEIGHT + 16}px]` : ""}
  `}
      >
        {/* Dias da semana */}
        {!isMobile && (
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-semibold">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const isSaturday = day === "Sat";
              const isSunday = day === "Sun";

              return (
                <div
                  key={day}
                  className={`py-2 rounded
              ${
                isSunday
                  ? " text-red-500"
                  : isSaturday
                  ? " text-emerald-500"
                  : " text-gray-700"
              }
            `}
                >
                  {day}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ⬇️ CONTEÚDO (empurrado para baixo no mobile) */}
      <div
        className={`p-4 bg-white rounded-lg shadow w-full
          ${isMobile ? `pt-[${NAV_HEIGHT + 16}px]` : ""}
        `}
      >
        <div
          className={
            isMobile ? "flex flex-col gap-2 mt-16" : "grid grid-cols-7 gap-1"
          }
        >
          {(isMobile
            ? Array.from({ length: monthEnd.getDate() }).map((_, i) =>
                addDays(monthStart, i)
              )
            : allDays
          ).map((day) => {
            const dayEvents = schedule.filter((e) => isSameDay(e.start, day));
            const isCurrentMonth = day.getMonth() === monthStart.getMonth();

            // Evita mostrar dias fora do mês atual no mobile
            if (isMobile && !isCurrentMonth) return null;

            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded min-h-[90px] border transition-all 
                  ${
                    isToday(day)
                      ? "bg-green-200 border-green-600 ring-2 ring-green-500"
                      : isCurrentMonth
                      ? getDayColor(day)
                      : "bg-gray-100 opacity-50"
                  }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {format(day, "EEE d")}
                </div>

                {dayEvents.map((event) => (
                  <div
                    key={event.idUnique}
                    className="bg-blue-200 text-black p-3 rounded-lg mb-2 text-xs shadow-md flex flex-col gap-1"
                  >
                    {/* Title */}
                    <strong className="text-sm font-semibold">
                      {event.title}
                    </strong>

                    {/* Details */}
                    <div className="text-[11px] opacity-90">
                      <span className="font-medium">Employees:</span>{" "}
                      {event.employees}
                    </div>

                    <div className="text-[11px] opacity-90">
                      <span className="font-medium">Tasks:</span> {event.tasks}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] opacity-70">
                        ID: {event.id}
                      </span>

                      <div className="flex gap-1 text-white">
                        <Link
                          href={`/admin/schedule/create?mode=edit&id=${event.id}`}
                          className="text-[10px] bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-[10px] bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
