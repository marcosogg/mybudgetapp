
import { Circle, Diamond, Square, Triangle } from "lucide-react";

/**
 * Hash function to get consistent index for tags
 */
const getHashIndex = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
};

/**
 * Normalize tags to consistent format
 */
export const normalizeTags = (input: string): string[] => {
  return input
    .split(',')
    .map(tag => 
      tag
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Whitelist valid chars
        .replace(/[_ ]+/g, '-')     // Convert spaces/underscores to hyphens
        .replace(/-+/g, '-')        // Collapse consecutive hyphens
    )
    .filter(tag => tag.length >= 2 && tag.length <= 25)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
};

// Fixed color palette for tags
export const TAG_COLORS = [
  { bg: "bg-red-100 hover:bg-red-200", text: "text-red-700", icon: Circle },
  { bg: "bg-blue-100 hover:bg-blue-200", text: "text-blue-700", icon: Square },
  { bg: "bg-green-100 hover:bg-green-200", text: "text-green-700", icon: Diamond },
  { bg: "bg-purple-100 hover:bg-purple-200", text: "text-purple-700", icon: Triangle },
];

/**
 * Get consistent style for a tag
 */
export const getTagStyle = (tag: string) => {
  const index = getHashIndex(tag, TAG_COLORS.length);
  return TAG_COLORS[index];
};
