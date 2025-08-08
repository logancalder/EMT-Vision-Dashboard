/**
 * Utility functions for formatting data consistently across the application
 */

/**
 * Capitalizes the first letter of each word in a string
 */
export function capitalizeWords(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats a list of items (either JSON array or comma-separated string)
 * into a nicely formatted string with capitalized words
 */
export function formatList(list: string | null | undefined): string {
  if (!list) return "";
  
  try {
    // Check if it's a JSON array
    const parsed = JSON.parse(list);
    if (Array.isArray(parsed)) {
      return parsed
        .map(item => typeof item === 'string' ? capitalizeWords(item) : item)
        .join(', ');
    }
  } catch (e) {
    // Not a JSON array, treat as string
  }
  
  // If it's a comma-separated string
  return list
    .split(',')
    .map(item => capitalizeWords(item.trim()))
    .join(', ');
}

/**
 * Formats a single value with proper capitalization
 */
export function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === 'number') return value.toString();
  return capitalizeWords(value);
}

/**
 * Formats an address with proper capitalization
 */
export function formatAddress(address: string | null | undefined): string {
  if (!address) return "No address on file";
  return capitalizeWords(address);
}

/**
 * Formats a name with proper capitalization
 */
export function formatName(name: string | null | undefined): string {
  if (!name) return "Unknown";
  return capitalizeWords(name);
}

/**
 * Formats a medical condition or diagnosis with proper capitalization
 */
export function formatMedicalCondition(severity: string | null | undefined): string {
  if (!severity) return "None recorded";
  return capitalizeWords(severity);
}

/**
 * Formats a list of medical conditions with proper capitalization
 */
export function formatMedicalConditions(conditions: string | null | undefined): string {
  if (!conditions) return "None recorded";
  return formatList(conditions);
} 