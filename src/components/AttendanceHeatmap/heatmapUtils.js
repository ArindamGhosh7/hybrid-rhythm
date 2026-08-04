export const ATTENDANCE_STATUS = {
  OFFICE: "office",
  WFH: "wfh",
  HOLIDAY: "holiday",
  LEAVE: "leave",
  ABSENT: "absent",
  FUTURE: "future",
  EMPTY: "empty",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function buildAttendanceCalendar(attendance, year) {
  const calendar = [];

  for (let month = 0; month < 12; month++) {
    calendar.push(buildMonth(month, year, attendance));
  }

  return calendar;
}

function buildMonth(monthIndex, year, attendance) {
  const firstDay = new Date(year, monthIndex, 1);

  const lastDay = new Date(year, monthIndex + 1, 0);

  const weeks = [];

  let week = [];

  // Pad beginning

  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(null);
  }

  // Every day of month

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, monthIndex, day);

    week.push(buildDay(date, attendance));

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Pad end

  while (week.length > 0 && week.length < 7) {
    week.push(null);
  }

  if (week.length) {
    weeks.push(week);
  }

  return {
    month: MONTHS[monthIndex],
    year,
    weeks,
  };
}

function buildDay(date, attendance) {
  const today = new Date();

  const isoDate = date.toISOString().split("T")[0];

  const record = attendance.find((d) => d.date === isoDate);

  return {
    date: isoDate,

    day: date.getDate(),

    status:
      record?.status ??
      (date > today ? ATTENDANCE_STATUS.FUTURE : ATTENDANCE_STATUS.EMPTY),

    record,
  };
}
