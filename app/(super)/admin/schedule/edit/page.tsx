import { changeSchedule } from "@/app/lib/actions";
import CreateSchedule from "../create/CreateSchedule";

export default function page(){
    return(
        <CreateSchedule createSchedule={changeSchedule}/>
    )
}