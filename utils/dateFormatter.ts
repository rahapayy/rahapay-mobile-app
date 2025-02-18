// utils/dateFormatter.ts

/**
 * Format a timestamp into a human-readable date string
 *
 * @param {number|string|Date} timestamp - The timestamp to format (can be Unix timestamp in ms/s, ISO string, or Date object)
 * @param {boolean} includeTime - Whether to include the time in the formatted string (default: true)
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (
    timestamp: number | string | Date,
    includeTime: boolean = true,
    locale: string = "en-US"
  ): string => {
    let date: Date;
  
    // Handle different timestamp formats
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      // Parse ISO string
      date = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
      if (timestamp.toString().length <= 10) {
        // Convert from seconds to milliseconds
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else {
      return "Invalid date";
    }
  
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
  
    // Options for date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    // Add time options if includeTime is true
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.second = "2-digit";
      options.hour12 = true;
    }
  
    // Format the date according to locale and options
    return date.toLocaleString(locale, options);
  };
  
  /**
   * Get relative time (e.g. "2 hours ago", "yesterday", etc.)
   *
   * @param {number|string|Date} timestamp - The timestamp to format
   * @param {string} locale - The locale to use for formatting (default: 'en-US')
   * @returns {string} Relative time string
   */
  export const getRelativeTime = (
    timestamp: number | string | Date,
    locale: string = "en-US"
  ): string => {
    let date: Date;
  
    // Handle different timestamp formats (same as formatDate)
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      if (timestamp.toString().length <= 10) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else {
      return "Invalid date";
    }
  
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
  
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
    // Convert difference to appropriate unit
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, "second");
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), "minute");
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), "hour");
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 86400), "day");
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), "month");
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), "year");
    }
  };
  
  /**
   * Format date to short form (e.g. "Jan 01, 2023")
   *
   * @param {number|string|Date} timestamp - The timestamp to format
   * @param {string} locale - The locale to use for formatting (default: 'en-US')
   * @returns {string} Short formatted date string
   */
  export const formatShortDate = (
    timestamp: number | string | Date,
    locale: string = "en-US"
  ): string => {
    let date: Date;
  
    // Handle different timestamp formats (same as formatDate)
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      if (timestamp.toString().length <= 10) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else {
      return "Invalid date";
    }
  
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
  
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
  
    return date.toLocaleDateString(locale, options);
  };