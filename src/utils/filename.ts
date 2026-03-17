/**
 * Generates a filesystem-safe filename from a given string.
 * Replaces non-standard characters with underscores and limits the length.
 * @param title The original string to sanitize.
 * @returns A sanitized string suitable for use as a filename.
 */
export const sanitizeFilename = (title: string): string => {
  // Replaces characters that are not alphanumeric, Japanese characters, or safe symbols with an underscore.
  // Limits the filename length to 50 characters to prevent issues with path length limits.
  return title.replace(/[^a-z0-9ぁ-んァ-ン一-龯_.-]/gi, '_').substring(0, 50);
};
