import WeeklyCalendar from "./BigCalendar";

export default function page() {
  const events = [
    
    {
      id: "1",
      title: "Shop",
      employees: "Ricardo, Douglas, Jose",
 
      start: new Date(2026, 0, 6),  
      end: new Date(2026, 0, 6),
    },
    {
      id: "4",
      title: "Access/Decking",
      employees: "Ricardo, Douglas, Jose",
  
      start: new Date(2026, 0, 6),  
      end: new Date(2026, 0, 6),
    },
    {
      id: "2",
      title: "Laburnum",
      employees: "Ricardo, Douglas, Jose",
      start: new Date(2026, 0, 7),  
      end: new Date(2026, 0, 7),
    },
    {
      id: "3",
      title: "Shop",
      employees: "Ricardo, Douglas, Jose",
      start: new Date(2026, 0, 8),  
      end: new Date(2026, 0, 8),
    },
  ];
  return (
    <>
      <h1>uol</h1>

      <WeeklyCalendar events={events} />
    </>
  );
}
