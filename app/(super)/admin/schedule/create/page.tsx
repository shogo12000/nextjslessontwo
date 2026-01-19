"use client";

import CreateSchedule from "./CreateSchedule";
import { createSchedule } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import { updateScheduleById } from "@/app/lib/actions";

export default function Page() {
  const searchParams = useSearchParams();

  const mode = searchParams?.get("mode") === "create" ? "create" : "edit";
  const isCreate = searchParams?.get("mode") === "create";

  const action = isCreate ? createSchedule : updateScheduleById;

  const scheduleId = searchParams?.get("id") ?? "";

  return (
    <CreateSchedule
      createSchedule={action}
      mode={mode}
      scheduleId={scheduleId}
    />
  );
}
