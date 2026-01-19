 
import { Button } from "@/ui/Button";
import MonthlyCalendar from "./BigCalendar";
 
import { BtnCreateSchedule } from "@/ui/super/ButtonSchedule";

export default function page() {
 
 
  return (
    <>  
       <BtnCreateSchedule />
      <MonthlyCalendar  />
    </>
  );
}
