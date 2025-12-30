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

export type WorkHistory = {
  id: string;
  startwork: string;
  endwork: string;
  break: string;
  totalwork: string;
  totalafterbreak: string;
  address: string;
  startbreak:string;
  endbreak:string; 
}

export type ProjectAddress = { 
    workaddress: string;
}

export type ProjectPhotos = {
  url: string;
  datesaved: string;
  workaddress: string;
}