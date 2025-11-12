# Testing Documentation - VinhXuan CMS Frontend

## Overview

This document describes the testing strategy, tools, and practices for the VinhXuan CMS frontend application.

## Testing Stack

### Core Testing Libraries
- **Vitest** (v1.6.0) - Fast unit test framework powered by Vite
- **React Testing Library** (v16.3.0) - Testing utilities for React components
- **jsdom** (v23.0.1) - JavaScript implementation of web standards for Node.js
- **@testing-library/user-event** (v14.5.1) - User interaction simulation
- **@testing-library/jest-dom** (v6.1.5) - Custom matchers for DOM elements

### Additional Tools
- **@vitest/ui** (v1.6.0) - Beautiful UI for viewing test results
- **Happy DOM** - Alternative to jsdom (lightweight DOM implementation)

## Test Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
```

### Test Setup (src/test/setup.ts)

The setup file configures the testing environment:
- Cleanup after each test
- Mock window.matchMedia for responsive design tests
- Mock IntersectionObserver for lazy loading tests
- Mock ResizeObserver for size-dependent components
- Suppress console errors in tests

## Running Tests

### NPM Scripts

```bash
# Run tests in watch mode (default)
npm run test

# Run tests once
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npx vitest --ui
```

## Test Categories

### 1. Unit Tests

#### Utility Functions
**Location:** `src/utils/*.test.ts`

**Example:** exportUtils.test.ts
- ✅ formatCurrencyForExport() - Formats Vietnamese currency with dots
- ✅ formatDateForExport() - Formats dates to DD/MM/YYYY
- ✅ exportToExcel() - Exports data to Excel files
- ✅ Handles edge cases (null, undefined, invalid values)

**Coverage:**
- ✅ formatCurrencyForExport: 100%
- ✅ formatDateForExport: 100%
- ✅ exportToExcel: 100%

#### State Management
**Location:** `src/store/*.test.ts`

**Example:** auth.store.test.ts
- ✅ Initial state verification
- ✅ setAuth() - Sets user and tokens correctly
- ✅ clearAuth() - Clears authentication
- ✅ localStorage integration
- ✅ Multiple user roles (ADMIN, STAFF, CUSTOMER)

**Coverage:**
- ✅ auth.store: 100%

### 2. Component Tests

#### Layout Components
**Location:** `src/layouts/**/*.test.tsx`

**Planned Tests:**
- [ ] Sidebar.test.tsx
  - Render with different user roles
  - Menu items visibility based on permissions
  - Collapsible behavior
  - Active route highlighting
  - Responsive behavior (mobile/desktop)

- [ ] Header.test.tsx
  - User dropdown functionality
  - Login/Register buttons for non-authenticated
  - User info display for authenticated users
  - Logout action
  - Notifications badge

- [ ] MainLayout.test.tsx
  - Renders sidebar, header, and content
  - Breadcrumb generation
  - Responsive margin adjustments
  - Outlet rendering

#### Page Components
**Location:** `src/pages/**/*.test.tsx`

**Priority Tests:**
- [ ] LoginPage.test.tsx - Authentication flow
- [ ] Dashboard.test.tsx - Dashboard metrics
- [ ] Statistics pages - Chart rendering and data display

### 3. Integration Tests

#### Authentication Flow
- [ ] Complete login flow (email/password → token storage → redirect)
- [ ] Token refresh mechanism
- [ ] Logout and cleanup
- [ ] Protected route access control

#### API Integration
- [ ] API service layer testing
- [ ] Request/response handling
- [ ] Error handling
- [ ] Token injection

### 4. E2E Tests (Future - Cypress/Playwright)

#### Critical User Journeys
- [ ] User Registration → Email verification → Login
- [ ] Admin Login → Create Service → Publish
- [ ] Customer Login → Create Record → Submit
- [ ] Staff Login → Approve Record → Notify User
- [ ] Fee Calculator → Calculate → View History
- [ ] Article Creation → Approval → Public View

### 5. Accessibility Tests

**Tools:** @axe-core/react

**Checklist:**
- [ ] All interactive elements are keyboard accessible
- [ ] Form inputs have proper labels
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] ARIA attributes are correct
- [ ] Focus indicators are visible

### 6. Responsive Design Tests

**Breakpoints:**
- Desktop: ≥1200px
- Tablet: 768px - 1199px
- Mobile: <768px

**Tests:**
- [ ] Sidebar auto-collapse on mobile
- [ ] Header responsive layout
- [ ] Table horizontal scroll
- [ ] Form layout adjustments

## Writing Tests

### Best Practices

#### 1. Use describe/it blocks
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

#### 2. Setup and teardown
```typescript
beforeEach(() => {
  // Reset state, clear mocks
});

afterEach(() => {
  // Cleanup
});
```

#### 3. Test user interactions
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should handle button click', () => {
  render(<Button onClick={mockFn} />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

#### 4. Test asynchronous code
```typescript
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<DataComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

#### 5. Mock API calls
```typescript
import { vi } from 'vitest';
import * as api from './api';

vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: [] })),
}));
```

## Code Coverage Goals

### Current Coverage
- **Statements:** 0% (initial setup)
- **Branches:** 0%
- **Functions:** 0%
- **Lines:** 0%

### Target Coverage
- **Statements:** ≥80%
- **Branches:** ≥75%
- **Functions:** ≥80%
- **Lines:** ≥80%

### Critical Paths (Must have 100% coverage)
- Authentication flow
- Role-based access control
- Payment calculations
- Data export functions

## Continuous Integration

### Pre-commit Hooks
```bash
# Run tests before commit
npm run test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### GitHub Actions (Future)
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module 'jsdom'"
```bash
npm install --save-dev jsdom
```

#### 2. "window.matchMedia is not a function"
Add mock in test setup:
```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

#### 3. "Cannot access 'X' before initialization"
Ensure imports are in correct order and modules are properly mocked.

## Testing Checklist

### Before Commit
- [ ] All tests pass
- [ ] No console errors
- [ ] Coverage meets targets
- [ ] TypeScript compiles without errors

### Before Pull Request
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Integration tests pass
- [ ] Accessibility checks pass
- [ ] Documentation updated

### Before Release
- [ ] Full test suite passes
- [ ] E2E tests pass
- [ ] Performance tests pass
- [ ] Cross-browser testing complete
- [ ] Accessibility audit complete

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Testing Playground](https://testing-playground.com/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)

## Maintenance

This testing documentation should be updated:
- When adding new testing tools
- When changing test patterns
- When discovering new best practices
- When coverage goals are met
- After major refactorings

---

**Last Updated:** November 10, 2025
**Next Review:** December 2025
**Maintained by:** VinhXuan Development Team
