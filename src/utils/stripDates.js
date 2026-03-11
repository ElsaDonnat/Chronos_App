/**
 * Strip date references from description text for use in date quiz questions.
 * Prevents descriptions from giving away the answer in "When did this happen?" questions.
 */

// Patterns that reveal dates in descriptions
const DATE_PATTERNS = [
  // Leading date phrases: "Around 300 BCE, ...", "In 1687, ...", "In the spring of 1989, ..."
  /^(?:Around|In|By|During|From|After|Before|Since|Until)\s+(?:the\s+(?:spring|summer|autumn|fall|winter|early|mid|late|beginning|end)\s+(?:of\s+)?)?(?:c\.\s*)?[\d,]+(?:\s*[\u2013–-]\s*[\d,]+)?\s*(?:BCE|CE|BC|AD|years?\s+ago)?\s*,\s*/i,
  // Parenthesized dates: "(1776)", "(330 CE)", "(1974–1980)"
  /\s*\((?:c\.\s*)?[\d,]+(?:\s*[\u2013–-]\s*[\d,]+)?\s*(?:BCE|CE|BC|AD)?\)/g,
  // "on June 4, 1989" or "on Christmas Day (800 CE)"
  /\bon\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Christmas\s+Day)\s+(?:\d{1,2},?\s+)?\(?\d{3,4}\s*(?:BCE|CE|BC|AD)?\)?\s*/gi,
  // "In 1024, " or "In 1609, " mid-sentence (after period or semicolon)
  /(?<=[.;])\s*In\s+(?:c\.\s*)?[\d,]+(?:\s*[\u2013–-]\s*[\d,]+)?\s*(?:BCE|CE|BC|AD)?\s*,\s*/g,
];

export function stripDatesFromDescription(text, maxLen = 100) {
  if (!text) return '';

  let cleaned = text;

  // Apply each pattern
  for (const pattern of DATE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Capitalize first letter if we stripped a leading phrase
  cleaned = cleaned.replace(/^\s+/, '');
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Truncate and add ellipsis
  if (cleaned.length > maxLen) {
    cleaned = cleaned.substring(0, maxLen) + '\u2026';
  } else {
    cleaned += '\u2026';
  }

  return cleaned;
}
