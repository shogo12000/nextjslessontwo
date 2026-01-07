"use client";

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

type CalendarEvent = {
  id: string;
  title: string;
  employees: string;
  start: Date;
  end: Date;
};

type Props = {
  events: CalendarEvent[];
};

export default function MonthlyCalendar({ events }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

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

  // Dias para desktop: inclui extras
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    allDays.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Função que retorna a cor do dia
  const getDayColor = (day: Date) => {
    const weekday = getDay(day); // 0=Domingo, 6=Sábado
    if (weekday === 0) return "bg-red-200"; // domingo
    if (weekday === 6) return "bg-yellow-200"; // sábado
    return "bg-blue-50"; // dias de semana
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow w-full">
      {/* Navegação do mês */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &lt; Back
        </button>

        <h2 className="text-xl font-semibold">{format(monthStart, "MMMM yyyy")}</h2>

        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next &gt;
        </button>
      </div>

      {/* Cabeçalho dias da semana - só desktop */}
      {!isMobile && (
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((wd, idx) => {
            let colorClass = "text-black";
            if (idx === 5) colorClass = "text-yellow-600";
            if (idx === 6) colorClass = "text-red-600";
            return (
              <div key={wd} className={`text-center font-semibold ${colorClass}`}>
                {wd}
              </div>
            );
          })}
        </div>
      )}

      {/* Dias do mês */}
      <div className={isMobile ? "flex flex-col gap-2" : "grid grid-cols-7 gap-1"}>
        {(isMobile
          ? Array.from({ length: monthEnd.getDate() }).map((_, i) =>
              addDays(monthStart, i)
            )
          : allDays
        ).map((day) => {
          const dayEvents = events.filter((e) => isSameDay(e.start, day));
          const isCurrentMonth = day.getMonth() === monthStart.getMonth();

          // Mobile: não exibe dias extras
          if (isMobile && !isCurrentMonth) return null;

          return (
            <div
              key={day.toString()}
              className={`p-2 rounded min-h-[80px] border ${
                isMobile
                  ? getDayColor(day)
                  : isCurrentMonth
                  ? getDayColor(day)
                  : "bg-gray-100 opacity-50"
              }`}
            >
              <div
                className={`font-semibold mb-1 text-sm ${
                  isMobile ? "text-left" : "text-center"
                }`}
              >
                {format(day, "EEE d")}
              </div>

              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg shadow mb-1 break-words hover:scale-105 transform transition-all duration-200"
                >
                  <h1 className="text-yellow-300 font-semibold text-sm">{event.title}</h1>
                  <p className="text-white/90 text-xs">Employees: {event.employees}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
