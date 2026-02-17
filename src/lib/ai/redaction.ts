const EMAIL_PATTERN =
  /([a-zA-Z0-9._%+-])[a-zA-Z0-9._%+-]*(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const LONG_NUMBER_PATTERN = /\b\d{7,}\b/g;

export function redactSensitiveText(value: string) {
  return value
    .replace(EMAIL_PATTERN, "$1***$2")
    .replace(LONG_NUMBER_PATTERN, (match) => `***${match.slice(-4)}`);
}
