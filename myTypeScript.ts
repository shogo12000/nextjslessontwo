import dayjs, { Dayjs } from "dayjs";

// export type WorkDayDB = {
//   startWork: string;
//   endWork: string;
//   totalBreak: string;
//   totalAfterBreak: string;
//   address: string;
// };
 
export type WorkDayDB = {
  startWork: string;
  endWork: string;
  startBreak: string;
  endBreak: string;
  totalWork: string;
  totalBreak: string;
  totalAfterBreak: string;
  address: string;
};

export type UserDB = {
  id: string;
  userType: string;
  name?: string | null;
  email?: string | null;
};