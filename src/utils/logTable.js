const logTable = (title, data, radius = 2) => {
  const hiddenColumns = ["notes", "created_at", "updated_at"];

  const hasStatus = data.some((row) => "status" in row);

  const rows = hasStatus
    ? (() => {
        const currentIndex = data.findIndex(
          (week) => week.status === "current",
        );

        return currentIndex === -1
          ? data
          : data.filter((_, index) => Math.abs(index - currentIndex) <= radius);
      })()
    : data;

  console.group(
    `%c📊 ${title}`,
    "color:#00f7ff;font-weight:bold;font-size:19px;",
  );

  console.table(
    rows.map((week) => {
      const row = {
        Marker: week.status === "current" ? "👉" : " ",
        ...week,
      };

      hiddenColumns.forEach((key) => delete row[key]);

      return row;
    }),
  );

  console.groupEnd();
};
