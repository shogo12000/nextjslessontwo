"use client";

import { useSearchParams } from "next/navigation";
import CreateSchedule from "./CreateSchedule";
import { createSchedule, updateScheduleById } from "@/app/lib/actions";

export default function PageClient() {
  const searchParams = useSearchParams();

  const isCreate = searchParams.get("mode") === "create";
  const mode = isCreate ? "create" : "edit";

  const action = isCreate ? createSchedule : updateScheduleById;
  const scheduleId = searchParams.get("id") ?? "";

  return (
    <CreateSchedule
      createSchedule={action}
      mode={mode}
      scheduleId={scheduleId}
    />
  );
}
