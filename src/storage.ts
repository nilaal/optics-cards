import { z } from "zod";
import { cards } from "./cards";

export const STORAGE_KEY = "lumen.optics.v1";
const progressSchema = z.object({
  version: z.literal(1),
  currentCard: z.string(),
  ratings: z.record(z.string(), z.enum(["again", "known"])),
  notes: z.record(z.string(), z.string().max(4000)),
});
export type Progress = z.infer<typeof progressSchema>;
export type Rating = Progress["ratings"][string];

export function initialProgress(): Progress {
  return { version: 1, currentCard: cards[0].id, ratings: {}, notes: {} };
}

export function readProgress(): { progress: Progress; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { progress: initialProgress(), warning: "" };
    const parsed = progressSchema.safeParse(JSON.parse(raw) as unknown);
    if (!parsed.success) throw new Error("Invalid saved progress");
    const ids = new Set(cards.map((card) => card.id));
    return {
      progress: {
        ...parsed.data,
        currentCard: ids.has(parsed.data.currentCard)
          ? parsed.data.currentCard
          : cards[0].id,
        ratings: Object.fromEntries(
          Object.entries(parsed.data.ratings).filter(([id]) => ids.has(id)),
        ),
        notes: Object.fromEntries(
          Object.entries(parsed.data.notes).filter(([id]) => ids.has(id)),
        ),
      },
      warning: "",
    };
  } catch {
    return {
      progress: initialProgress(),
      warning:
        "Saved progress could not be read. You can keep studying with a fresh session.",
    };
  }
}

export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
