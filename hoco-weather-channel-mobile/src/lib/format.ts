export function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function compactHour(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric"
  }).format(new Date(value));
}
