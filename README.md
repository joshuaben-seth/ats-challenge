# Code Modularization Guide

This document outlines the modular structure of the Amara Interview application and how to use the various utilities and components.

## Directory Structure

```
app/
├── lib/
│   ├── api/           # API-related functions and data fetching
│   ├── store/         # Zustand state management
│   ├── types.ts       # TypeScript type definitions
│   ├── ui/            # UI utilities and components
│   ├── utils/         # General utility functions
│   └── hooks/         # Custom React hooks
├── components/        # React components organized by feature
└── page.tsx          # Main application page
```

## UI Utilities (`app/lib/ui/`)

### Animations (`animations.ts`)
Centralized animation variants for consistent motion across the application.

```typescript
import { fadeInVariants, slideUpVariants, staggerContainerVariants } from '@/app/lib/ui/animations';

// Usage in components
<motion.div variants={fadeInVariants} initial="hidden" animate="visible">
  Content
</motion.div>
```

### Styles (`styles.ts`)
Predefined CSS class combinations for consistent styling.

```typescript
import { 
  glassmorphismClasses, 
  cardClasses,
  buttonClasses, 
  inputClasses,
  loadingClasses,
  statusClasses,
  layoutClasses,
  textClasses,
  spacingClasses,
  borderClasses
} from '@/app/lib/ui/styles';

// Usage
<div className={glassmorphismClasses.light}>
  <button className={buttonClasses.primary}>Click me</button>
</div>
```

### Components (`components.tsx`)
Reusable UI components with consistent styling and behavior.

```typescript
import { 
  LoadingSpinner,
  LoadingDots,
  StatusBadge,
  Card,
  Button, 
  Modal,
  Tooltip,
  Divider,
  EmptyState
} from '@/app/lib/ui/components';

// Usage
<Card variant="elevated">
  <Button variant="primary" onClick={handleClick}>
    Action
  </Button>
  <LoadingSpinner size="md" />
</Card>
```

## Data Utilities (`app/lib/utils/`)

### Data Utilities (`data.ts`)
Functions for data manipulation, normalization, and processing.

```typescript
import { 
  // Normalization
  normalizeText, 
  normalizeArray,
  
  // Matching
  hasMatch, 
  hasMatchSingle,

  // Array utilities
  chunkArray,
  uniqueArray,
  sortByProperty, 
  
  // Object utilities
  deepClone,
  pick,
  omit,

  // Candidate helpers
  getCandidateSkills,
  getCandidateLanguages,
  // ... and more
  
} from '@/app/lib/utils/data';

// Text normalization
const normalized = normalizeText("  Hello, World!  "); // "hello world"

// Array matching
const hasMatchResult = hasMatch(['react', 'typescript'], ['JavaScript', 'React']); // true

// Object sorting
const sorted = sortByProperty(users, 'name', 'asc');

// Deep cloning
const cloned = deepClone(complexObject);
```

### Format Utilities (`format.ts`)
Functions for formatting dates, numbers, text, and other data types.

```typescript
import { 
  // Date & Time
  formatDate, 
  formatDateTime,
  formatRelativeTime,
  formatTime,
  formatTimeWithSeconds,

  // Numbers
  formatNumber,
  formatCurrency, 
  formatPercentage,
  formatFileSize,

  // Text
  capitalizeFirst,
  capitalizeWords,
  truncateText,
  slugify,
  formatPhoneNumber,

  // Arrays
  formatList,
  formatArrayAsPills,

  // Durations
  formatDuration,
  formatDurationShort
} from '@/app/lib/utils/format';

// Date formatting
const formatted = formatDate(new Date(), { year: 'numeric', month: 'long' });

// Currency formatting
const price = formatCurrency(1234.56); // "$1,234.56"

// Duration formatting
const duration = formatDuration(3661); // "1h 1m 1s"

// Text truncation
const truncated = truncateText("Very long text", 20); // "Very long text..."
```

### Validation Utilities (`validation.ts`)
Functions for validating user inputs and data.

```typescript
import { 
  // String validation
  isNotEmpty,
  isMinLength,
  isAlphanumeric,
  // ... and more

  // Type-specific validation
  isValidEmail, 
  isValidUrl,
  isValidPhoneNumber,
  isValidDate,
  isStrongPassword, 
  getPasswordStrength,
  isValidCreditCard,

  // Number validation
  isPositiveNumber,
  isInRange,
  // ... and more

  // Array validation
  isNotEmptyArray,
  isArrayMinLength,
  // ... and more

  // Object validation
  isNotEmptyObject,
  hasRequiredKeys,
  // ... and more

  // File validation
  isValidFileSize,
  isValidFileType,

  // Composite validation
  validateRequired,
  validateField 
} from '@/app/lib/utils/validation';

// Email validation
const isValid = isValidEmail('user@example.com'); // true

// Password strength
const strength = getPasswordStrength('MyP@ssw0rd'); // 'strong'

// Field validation
const result = validateField('test', {
  required: true,
  minLength: 3,
  maxLength: 10
});
```

### DOM Utilities (`dom.ts`)
Browser and DOM manipulation utilities.

```typescript
import { 
  // Element selection
  getElementById,
  getElementBySelector,
  // ... and more

  // Focus management
  focusElement, 
  focusFirstInput,

  // Scrolling
  scrollToElement,
  scrollToTop,
  isElementInViewport,

  // Events
  addEventListener,
  addGlobalEventListener,
  addClickOutsideListener,
  addKeyboardListener,

  // Clipboard
  copyToClipboard, 
  readFromClipboard,

  // Downloads
  downloadFile,
  
  // File reading
  readFileAsText,
  readFileAsDataURL,

  // Viewport
  getViewportSize,
  isMobile,
  isTablet,

  // Storage
  setLocalStorage,
  getLocalStorage,
  // ... and more
} from '@/app/lib/utils/dom';

// Clipboard operations
await copyToClipboard('Text to copy');

// Focus management
focusElement(document.getElementById('input'));

// Scroll utilities
scrollToElement(element, 'smooth');

// Viewport information
const { width, height } = getViewportSize();
```

### Constants (`constants.ts`)
Application-wide constants and configuration values.

```typescript
import { 
  // App info
  APP_NAME,
  APP_VERSION,

  // API
  API_BASE_URL,
  API_TIMEOUT, 
  HTTP_STATUS,

  // UI
  ANIMATION_DURATION, 
  Z_INDEX,
  BREAKPOINTS,

  // Configs
  CHAT_CONFIG,
  TIMELINE_CONFIG,
  CANDIDATE_CONFIG,

  // Rules & Messages
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,

  // Storage
  STORAGE_KEYS,
  SESSION_KEYS,

  // Feature flags & Environment
  FEATURES,
  IS_DEVELOPMENT,

  // Performance & Security
  PERFORMANCE,
  SECURITY
} from '@/app/lib/utils/constants';

// API configuration
const timeout = API_TIMEOUT; // 30000ms

// Animation timing
const duration = ANIMATION_DURATION.NORMAL; // 300ms

// Error messages
const message = ERROR_MESSAGES.REQUIRED_FIELD; // "This field is required"

// Responsive breakpoints
const isMobile = window.innerWidth < BREAKPOINTS.MD;
```

## Custom Hooks (`app/lib/hooks/`)

The `app/lib/hooks` directory is available for custom React hooks. As of the latest refactor, all initial hooks were removed as they were not in use. If you add new custom hooks, you should document their purpose and usage here.

```

## Frontend/USA/Experience Jest Test

This project includes a Jest test that verifies the candidate search and ranking logic for the following scenario:

**Test Input:**
- Query: "frontend, usa, sort by experience desc"

**Expectation:**
- The system should find all Frontend Engineers located in the USA and sort them by years of experience in descending order.
- According to the current data, there is only one Frontend Engineer in the USA: **Quinn Smith** (ID: 6, New York, USA, 18 years experience).
- The test also includes a broader check for all engineers in the USA, verifying that candidates are sorted by experience and that Quinn Smith appears above less experienced candidates (e.g., Jess Garcia, ID: 5).

**How to Run the Test:**

```
pnpm test:frontend-usa-experience
```

**Expected Output:**
- The test should pass, confirming that:
  - Quinn Smith is the only Frontend Engineer in the USA and is found by the filter.
  - In a broader USA search, candidates are sorted by experience, with higher-experience candidates (e.g., Riley Davis, Quinn Smith) appearing above those with less experience (e.g., Jess Garcia).
- The test logs the ranked results for verification.

**Sample Output:**

```
Frontend Engineers in USA (by experience desc):
1. Quinn Smith (ID: 6) - 18 years - New York, USA
✅ Quinn Smith (ID: 6, 18 years) is the only Frontend Engineer in USA

Engineers in USA (by experience desc):
1. Riley Davis (ID: 20) - 20 years - QA Engineer - New York, USA
2. Jamie Allen (ID: 26) - 20 years - Mobile Developer - San Francisco, USA
3. Quinn Smith (ID: 6) - 18 years - Frontend Engineer - New York, USA
...
✅ Riley Davis (ID: 20, 20 years) appears at position 1
✅ Quinn Smith (ID: 6, 18 years) appears at position 3
✅ Jess Garcia (ID: 5, 8 years) appears at position 8
```
