import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string.
 * 
 * @param inputs - The class names to combine.
 * @returns - The combined class names.
 * 
 * @example
 * cn("text-red-500", "bg-blue-500"); // Returns "text-red-500 bg-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to title case, respecting small words and ignoring specified indexes.
 * 
 * @param input - The string to convert.
 * @param ignoreIndexes - Array of word indexes to ignore (keep lowercase).
 * @returns - The title-cased string.
 * 
 * @example
 * autoTitleCase("the quick brown fox jumps over the lazy dog"); // Returns "The Quick Brown Fox Jumps Over the Lazy Dog"
 * @example
 * autoTitleCase("the quick brown fox jumps over the lazy dog", [0, 4]); // Returns "the Quick Brown Fox jumps Over the Lazy Dog"
 */

export function autoTitleCase(input: string, ignoreIndexes: number[] = []): string {
  if (!input) return "";

  // Common short words (lowercase in titles, except first word)
  const smallWords = new Set([
    "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "per", "the", "to", "vs", "via"
  ]);

  // Normalize string: remove extra spaces, replace _ and - with space
  const words = input
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/);

  return words
    .map((word, index) => {
      if (ignoreIndexes.includes(index)) return word; // Respect ignored indexes

      const lower = word.toLowerCase();

      // Always capitalize first word, otherwise lowercase small words
      if (index !== 0 && smallWords.has(lower)) {
        return lower;
      }

      // Capitalize first letter, leave rest lowercase
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    month: "long", // Full month name
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
