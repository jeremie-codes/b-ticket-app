export const formatTimeWithoutMinutes = (timeString: string) => {
  const hours = timeString.slice(0, 2); // Extract the hour portion of the time string
  return hours + "H";
};

export function formatTimeRange(startTime: string, endTime: string) {
  const start = startTime.slice(0, 5);
  const end = endTime.slice(0, 5);
  return `de ${start} à ${end}`;
}
