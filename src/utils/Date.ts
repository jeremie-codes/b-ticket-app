const date = new Date();

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "2-digit",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", options);
const formattedDate = dateFormatter.format(date);

const formattedDateWithComma = formattedDate.replace(
  /(\w+)(\s+)(\d+)/,
  "$1, $3"
);

export const formattedDateUpper =
  formattedDateWithComma.charAt(0).toUpperCase() +
  formattedDateWithComma.slice(1);

export const formatDateFr = (dateString: string) => {
  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return dateFormatter.format(date).toLocaleUpperCase();
};
