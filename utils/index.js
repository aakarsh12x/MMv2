/**
 * Formats a number into a human-readable string with suffixes (e.g., 1K, 1.5M).
 * @param {number|string} num - The number to format.
 * @returns {string} - The formatted number as a string.
 */

const formatNumber = (num) => {
  // Convert to number if it's not already
  const value = typeof num === 'number' ? num : parseFloat(num || 0);
  
  // Handle NaN or invalid values
  if (isNaN(value)) return "0";
  
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  
  // For small numbers, show with 2 decimal places if needed
  return value.toFixed(2).replace(/\.00$/, "");
};

export default formatNumber;
