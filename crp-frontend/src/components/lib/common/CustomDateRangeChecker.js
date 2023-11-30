import dayjs from "dayjs";

export const CustomDateRangeChecker = (values) => {
  const [startDate, endDate] = values.customDateRange || "";
  let range_start;
  let range_end;
  if (values.created_at === "today") {
    range_start = dayjs().format("YYYY-MM-DD");
    range_end = dayjs().format("YYYY-MM-DD");
  }
  if (values.created_at === "last") {
    range_start = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    range_end = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  }
  if (values.created_at === "lastWeek") {
    range_start = dayjs().subtract(1, "week").format("YYYY-MM-DD");
    range_end = dayjs().format("YYYY-MM-DD");
  }
  if (values.created_at === "lastMonth") {
    range_start = dayjs().subtract(2, "month").format("YYYY-MM-DD");
    range_end = dayjs().subtract(1, "month").format("YYYY-MM-DD");
  }
  if (values.created_at === "custom") {
    range_start = startDate?.format("YYYY-MM-DD");
    range_end = endDate?.format("YYYY-MM-DD");
  }
  const modifiedData = {
    range_start: range_start,
    range_end: range_end,
  };
  return modifiedData;
};