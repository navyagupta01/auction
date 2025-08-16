// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

// Auction Constants
export const AUCTION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  ENDED: 'ended'
};

export const BID_TYPES = {
  REGULAR: 'regular',
  COUNTER_OFFER: 'counter_offer'
};

// Time Constants
export const TIME_FORMATS = {
  STANDARD: 'MMM DD, YYYY HH:mm',
  SHORT: 'MMM DD, YYYY',
  TIME_ONLY: 'HH:mm',
  FULL: 'MMMM DD, YYYY [at] HH:mm'
};

// Validation Constants
export const VALIDATION = {
  MIN_BID_INCREMENT: 1,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_AUCTION_DURATION: 1, // hours
  MAX_AUCTION_DURATION: 168, // 1 week
  MAX_IMAGES: 5
};

// UI Constants
export const ITEMS_PER_PAGE = 12;
export const DEBOUNCE_DELAY = 300;

// Default Values
export const DEFAULT_CURRENCY = '$';
export const DEFAULT_TIMEZONE = 'UTC';

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  AUCTION_ENDED: 'This auction has already ended.',
  INVALID_BID: 'Please enter a valid bid amount.',
  LOGIN_REQUIRED: 'Please log in to continue.'
};
