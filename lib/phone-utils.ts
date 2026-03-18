export function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string) {
  const cleaned = cleanPhone(value);
  return cleaned.length >= 10 && cleaned.length <= 13;
}

export function formatPhone(value: string) {
  const cleaned = cleanPhone(value);

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return cleaned;
}

export function toWhatsAppLink(value: string) {
  const cleaned = cleanPhone(value);

  if (!isValidPhone(cleaned)) return null;

  if (cleaned.startsWith("55")) {
    return `https://wa.me/${cleaned}`;
  }

  return `https://wa.me/55${cleaned}`;
}