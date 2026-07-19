export function formatMemorialDates(
  dateOfBirth: Date | null,
  dateOfDeath: Date | null,
  locale: string
): string {
  const intlLocale = locale === "ru" ? "ru-RU" : "en-US";

  const formatYear = (date: Date) =>
    date.toLocaleDateString(intlLocale, { year: "numeric" });

  if (dateOfBirth && dateOfDeath) {
    return `${formatYear(dateOfBirth)} — ${formatYear(dateOfDeath)}`;
  }

  if (dateOfDeath) {
    return formatYear(dateOfDeath);
  }

  if (dateOfBirth) {
    return formatYear(dateOfBirth);
  }

  return "—";
}
