// Application constants
export const APP_NAME = 'Amara Interview';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-powered candidate screening and interview platform';

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];
export const MAX_FILES_PER_UPLOAD = 5;

// Pagination constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Search and filtering constants
export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_LENGTH = 100;
export const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds
export const MAX_FILTER_VALUES = 50;

// UI constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Chat constants
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_PER_CONVERSATION: 100,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_TIMEOUT: 30000,
  AUTO_SCROLL_THRESHOLD: 100
} as const;

// Timeline constants
export const TIMELINE_CONFIG = {
  MAX_ENTRIES: 50,
  AUTO_CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  ENTRY_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
} as const;

// Candidate constants
export const CANDIDATE_CONFIG = {
  MAX_SKILLS_PER_CANDIDATE: 20,
  MAX_LANGUAGES_PER_CANDIDATE: 10,
  MAX_TAGS_PER_CANDIDATE: 15,
  MIN_EXPERIENCE_YEARS: 0,
  MAX_EXPERIENCE_YEARS: 50,
  MIN_SALARY: 0,
  MAX_SALARY: 1000000,
  MIN_AVAILABILITY_WEEKS: 0,
  MAX_AVAILABILITY_WEEKS: 52,
  MIN_NOTICE_PERIOD_WEEKS: 0,
  MAX_NOTICE_PERIOD_WEEKS: 52
} as const;

// Validation constants
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  },
  EMAIL: {
    MAX_LENGTH: 254
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  },
  URL: {
    MAX_LENGTH: 2048
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128
  },
  BIO: {
    MAX_LENGTH: 1000
  },
  SKILL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50
  },
  TAG: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  UPLOADED: 'File uploaded successfully',
  COPIED: 'Copied to clipboard',
  EXPORTED: 'Data exported successfully',
  IMPORTED: 'Data imported successfully'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_COLUMNS: 'table_columns',
  FILTERS: 'filters',
  SORT_PREFERENCES: 'sort_preferences',
  CHAT_HISTORY: 'chat_history',
  TOUR_COMPLETED: 'tour_completed'
} as const;

// Session storage keys
export const SESSION_KEYS = {
  CURRENT_USER: 'current_user',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  TEMP_DATA: 'temp_data'
} as const;

// Feature flags
export const FEATURES = {
  CHAT_ENABLED: true,
  TIMELINE_ENABLED: true,
  EXPORT_ENABLED: true,
  IMPORT_ENABLED: true,
  ADVANCED_FILTERS: true,
  BULK_ACTIONS: true,
  REAL_TIME_UPDATES: true,
  OFFLINE_MODE: false
} as const;

// Environment constants
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

// Performance constants
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  LAZY_LOAD_THRESHOLD: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100
} as const;

// Security constants
export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000 // 5 minutes
} as const; 