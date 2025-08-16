import moment from 'moment';

/**
 * Format price to currency display
 * @param {number} price - Price in cents or dollars
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  if (!price && price !== 0) return `${currency}0.00`;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return `${currency}0.00`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericPrice).replace('$', currency);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Moment.js format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'MMM DD, YYYY HH:mm') => {
  if (!date) return 'Invalid date';

  const momentDate = moment(date);
  if (!momentDate.isValid()) return 'Invalid date';

  return momentDate.format(format);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';

  const momentDate = moment(date);
  if (!momentDate.isValid()) return 'Unknown';

  return momentDate.fromNow();
};

/**
 * Calculate time remaining until end date
 * @param {string|Date} endDate - End date
 * @returns {Object} Time remaining object
 */
export const calculateTimeRemaining = (endDate) => {
  const now = moment();
  const end = moment(endDate);

  if (!end.isValid() || end.isBefore(now)) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const duration = moment.duration(end.diff(now));

  return {
    expired: false,
    days: Math.floor(duration.asDays()),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate slug from string
 * @param {string} text - Text to slugify
 * @returns {string} Slug string
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Check if auction is active based on dates
 * @param {string|Date} startTime - Auction start time
 * @param {string|Date} endTime - Auction end time
 * @returns {string} Auction status: 'pending', 'active', or 'ended'
 */
export const getAuctionStatus = (startTime, endTime) => {
  const now = moment();
  const start = moment(startTime);
  const end = moment(endTime);

  if (now.isBefore(start)) return 'pending';
  if (now.isAfter(end)) return 'ended';
  return 'active';
};
