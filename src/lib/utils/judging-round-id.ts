import { randomBytes } from "crypto";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateJudgingRoundId(): string {
  const bytes = randomBytes(8);
  return Array.from(bytes)
    .map((b) => CHARS[b % CHARS.length])
    .join("");
}
