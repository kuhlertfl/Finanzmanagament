# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KM Finanzmanagement is a customized German version of Frappe Books, an open-source accounting software. This Electron application is specifically designed for German small businesses and freelancers, featuring expense and income management with a localized interface.

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **Desktop App**: Electron with offline capability
- **Database**: SQLite with Frappe Books ORM (fyo.db)
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Feather Icons
- **Build**: Vite for development, custom build scripts for production

## Development Commands

### Core Development
```bash
# Install dependencies (required: Node.js v20.18.1, yarn)
yarn

# Start development server (Electron app with hot reload)
yarn dev

# Build production app
yarn build

# Lint code
yarn lint

# Format code
yarn format

# Run tests
yarn test

# Run UI tests
yarn uitest
```

### Key Notes
- First startup in dev mode takes several seconds as each file is served individually
- Electron runs with `--inspect` flag for debugging on port 5858
- Use `chrome://inspect` to debug the main process

## Code Architecture

### Core Structure
- **Schemas** (`schemas/app/`): JSON schema definitions for database entities
- **Pages** (`src/pages/`): Vue.js page components organized by feature
- **Utils** (`src/utils/`): Shared utilities including sidebar config, UI helpers, PDF generation
- **Router** (`src/router.ts`): Vue Router configuration with custom routes
- **Translations** (`translations/de.csv`): German localization file

### Custom Entities
The application extends Frappe Books with custom German business entities:

1. **OneTimeExpense** - Single business expenses with invoice uploads
2. **RecurringExpense** - Recurring payments with automated tracking
3. **OneTimeIncome** - Single income entries (tips, payments, etc.)
4. **PaymentVerificationRecord** - Bank transaction matching records
5. **SubscriptionCustomer** - Customer subscription management

### Database Schema Pattern
All custom entities use manual naming with timestamp-based unique IDs:
```typescript
const timestamp = Date.now();
const uniqueName = `OTE-${timestamp}`; // OneTimeExpense
const uniqueName = `RE-${timestamp}`;  // RecurringExpense
```

### Navigation Structure
The app features a German sidebar structure defined in `src/utils/sidebarConfig.ts`:
- Dashboard
- Kunden (Customers) - Customer and group management
- Einnahmen (Income) - Income overview, payment verification, one-time income
- Ausgaben (Expenses) - Expense overview, recurring and one-time expenses

Hidden sections include traditional Frappe Books modules (Sales, Purchases, Reports, POS, Setup).

### Vue.js Patterns

#### Standard Component Structure
```vue
<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { fyo } from 'src/initFyo';

const entries = ref<any[]>([]);
const showAddForm = ref(false);

// Always include both mount hooks for proper data loading
onMounted(async () => {
  await loadEntries();
});

onActivated(async () => {
  await loadEntries();
});

// Computed properties for reactive data
const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

// Form validation pattern
const isFormValid = computed(() => {
  return newEntry.value.amount > 0 &&
         newEntry.value.description.trim() !== '';
});
</script>
```

#### Database Operations
```typescript
// Creating new entries
const timestamp = Date.now();
const doc = fyo.doc.getNewDoc('OneTimeExpense');
await doc.set('name', `OTE-${timestamp}`);
await doc.set('amount', amount);
await doc.sync();

// Loading entries with error handling
async function loadEntries() {
  try {
    const entries = await fyo.db.getAll('OneTimeExpense', {
      fields: ['name', 'amount', 'description', 'date'],
    });
    return entries || [];
  } catch (error) {
    if (error.message?.includes('no such table')) {
      console.log('Table will be created when first entry is saved.');
    }
    return [];
  }
}
```

### Modal Design Pattern
All modals follow a consistent responsive structure:
```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
    <!-- Fixed Header -->
    <div class="p-6 pb-0 flex-shrink-0">
      <h3 class="text-lg font-medium">Title</h3>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6 pt-4">
      <!-- Form content -->
    </div>

    <!-- Fixed Footer -->
    <div class="p-6 pt-0 flex-shrink-0 border-t dark:border-gray-700">
      <div class="flex justify-end gap-3">
        <!-- Buttons -->
      </div>
    </div>
  </div>
</div>
```

### File Upload Implementation
PDF invoice uploads are handled with FileReader API:
```typescript
const uploadedFile = ref<File | null>(null);

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type === 'application/pdf') {
      uploadedFile.value = file;
    } else {
      alert('Nur PDF-Dateien sind erlaubt.');
    }
  }
}
```

## Common Issues and Solutions

### Schema Validation Errors
- Ensure all required fields have `"required": true` in schema
- Set default values for Check fields: `"default": false`
- Use proper field types: Data, Float, Date, Check, Text

### Database Constraints
- NOT NULL errors: Add missing required fields to schema
- Use manual naming for all custom entities
- Handle table creation gracefully (tables created on first save)

### Vue Template Issues
- Balance all HTML tags properly
- Use exact string matching in Edit tool
- Preserve indentation when editing files
- Include line numbers in file references: `src/pages/Income/OneTimeIncome.vue:156`

## File Organization

### Key Files
- `src/utils/sidebarConfig.ts` - Application navigation structure
- `src/router.ts` - Vue Router configuration
- `schemas/app/` - Database schema definitions
- `src/pages/Expenses/` - Expense management components
- `src/pages/Income/` - Income management components
- `translations/de.csv` - German translations

### Styling
- Tailwind CSS with dark mode support
- Consistent color scheme: `bg-white dark:bg-gray-875`
- Form inputs: `border border-gray-300 dark:border-gray-700`
- Buttons: `bg-green-600 hover:bg-green-700` for primary actions

## Development Best Practices

- Always read existing code patterns before implementing new features
- Use the existing sidebar configuration for navigation changes
- Follow the established modal design pattern for consistency
- Include proper error handling for all database operations
- Add German translations to `translations/de.csv` for new strings
- Test both light and dark mode themes
- Ensure responsive design for all new components