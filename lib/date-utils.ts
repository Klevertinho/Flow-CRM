export function toIsoNow() {
  return new Date().toISOString();
}

export function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR");
}

export function formatDateTime(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleString("pt-BR");
}

export function isToday(date: string | null) {
  if (!date) return false;

  const today = new Date();
  const target = new Date(date);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

export function isOverdue(date: string | null) {
  if (!date) return false;

  const today = new Date();
  const target = new Date(date);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return target < today;
}

export function isFuture(date: string | null) {
  if (!date) return false;

  const today = new Date();
  const target = new Date(date);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return target > today;
}

export function toInputDateValue(date: string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function getRelativeFollowUpLabel(date: string | null) {
  if (!date) return "Sem follow-up";

  if (isOverdue(date)) return "Atrasado";
  if (isToday(date)) return "Hoje";
  if (isFuture(date)) return "Agendado";

  return "Sem follow-up";
}

export function daysSince(date: string | null) {
  if (!date) return null;

  const now = new Date();
  const target = new Date(date);

  const diff = now.getTime() - target.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getInactivityLabel(date: string | null) {
  const days = daysSince(date);

  if (days === null) return "Sem interação registrada";
  if (days === 0) return "Interagido hoje";
  if (days === 1) return "Sem interação há 1 dia";
  return `Sem interação há ${days} dias`;
}

export function getInactivityLevel(date: string | null) {
  const days = daysSince(date);

  if (days === null) return "none";
  if (days <= 0) return "ok";
  if (days <= 3) return "attention";
  if (days <= 7) return "warning";
  return "critical";
}