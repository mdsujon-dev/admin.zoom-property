import dayjs from "dayjs";

export const formatTime = (timeStr?: string) =>
  timeStr ? dayjs(`2000-01-01T${timeStr}:00`).format("h:mm A") : "";
