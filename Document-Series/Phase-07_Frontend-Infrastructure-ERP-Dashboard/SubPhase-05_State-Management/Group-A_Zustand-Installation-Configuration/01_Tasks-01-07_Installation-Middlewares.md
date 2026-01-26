# Tasks 01-07: Installation & Middlewares

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** A - Zustand Installation & Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Selectors-Utilities-Verification.md](02_Tasks-08-14_Selectors-Utilities-Verification.md)

---

## Document Overview

This document covers the installation of Zustand and its essential middlewares. Establishes the store directory structure and configures the three core middlewares: immer for immutable state updates, persist for localStorage integration, and devtools for debugging. Creates a unified createStore utility that combines all middlewares in the correct order to provide a complete state management foundation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Zustand | Low | 5 min |
| 02 | Create Store Directory | Low | 5 min |
| 03 | Create Store Types | Low | 15 min |
| 04 | Configure Immer Middleware | Low | 15 min |
| 05 | Configure Persist Middleware | Low | 20 min |
| 06 | Configure DevTools Middleware | Low | 15 min |
| 07 | Create createStore Utility | Medium | 30 min |

---

## Task 01: Install Zustand

### Overview
Install Zustand as the primary client-side state management library for the ERP dashboard. Zustand is a lightweight, hook-based state management solution that provides a minimal API surface while maintaining powerful features for complex state scenarios.

### Dependencies
- SubPhase-04: Next.js project initialized
- npm or yarn package manager available
- Node.js environment configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend application directory

2. **Install Zustand core package**
   - Run package installation command
   - Install Zustand with exact version
   - Use npm or yarn based on project preference

3. **Install Immer for immutability**
   - Install immer package for immutable updates
   - Allows direct state mutation syntax
   - Produces immutable updates automatically

4. **Verify installation**
   - Check package.json dependencies
   - Confirm Zustand version is latest stable
   - Confirm immer is installed

5. **Check for peer dependencies**
   - Verify React version compatibility
   - Ensure TypeScript is available
   - No additional peer dependencies required

### Package Details

| Package | Purpose | Installation |
|---------|---------|--------------|
| zustand | State management core | npm install zustand |
| immer | Immutable updates | npm install immer |

### Version Requirements

| Package | Min Version | Recommended |
|---------|-------------|-------------|
| zustand | 4.4.0 | Latest 4.x |
| immer | 10.0.0 | Latest 10.x |
| React | 18.0.0 | 18.2+ |

### Why Zustand?

**Advantages Over Alternatives**
- Minimal boilerplate compared to Redux
- No context provider needed
- Excellent TypeScript support
- Small bundle size (~1KB)
- React 18 concurrent mode compatible
- Direct state updates with immer
- Built-in middleware ecosystem
- No mental model overhead

**Comparison with Other Solutions**
- Simpler than Redux Toolkit
- More flexible than Context API
- Less opinionated than MobX
- Better TypeScript than Recoil
- Lighter than Jotai for this use case

### Expected Outcome
- Zustand successfully installed
- Immer dependency available
- Package versions compatible
- Ready for store creation

### Verification Checklist
- [ ] package.json contains zustand dependency
- [ ] package.json contains immer dependency
- [ ] node_modules/zustand directory exists
- [ ] No installation errors
- [ ] TypeScript types available

---

## Task 02: Create Store Directory

### Overview
Establish a dedicated directory structure for all Zustand stores and related utilities. This organization separates client state management from server state (TanStack Query) and provides a clear location for state-related code.

### Dependencies
- Task 01: Install Zustand

### Instructions

1. **Create store directory**
   - Navigate to frontend/src or frontend/app
   - Create new directory named `store`
   - This houses all Zustand store files

2. **Plan store organization**
   - Determine store file structure
   - Plan for multiple store files
   - Consider domain-based separation

3. **Create store subdirectories (if needed)**
   - Consider `slices/` for store segments
   - Consider `middleware/` for custom middleware
   - Keep flat initially, expand as needed

4. **Create types directory**
   - Store TypeScript interfaces
   - Shared state types
   - Action types and signatures

5. **Create utils directory**
   - Store-related utilities
   - Helper functions
   - Common patterns

### Directory Structure

```
frontend/
└── store/
    ├── types.ts              # Store type definitions
    ├── utils.ts              # Store utilities
    ├── uiStore.ts           # UI state store (future)
    ├── authStore.ts         # Auth state store (future)
    └── index.ts             # Store exports
```

### Store Organization Strategy

| Store File | Responsibility | State Scope |
|------------|---------------|-------------|
| uiStore | UI state | Sidebar, theme, modals |
| authStore | Authentication | User, tenant, permissions |
| settingsStore | App settings | Preferences, config |

### Store vs Query Distinction

**Zustand Stores (Client State)**
- UI state (sidebar, modals, theme)
- Authentication state
- User preferences
- Transient application state

**TanStack Query (Server State)**
- Products, inventory, customers
- Sales orders, invoices
- Employee data
- API-fetched data

### Expected Outcome
- Clean store directory structure
- Organized location for state management
- Clear separation from other concerns
- Scalable organization pattern

### Verification Checklist
- [ ] frontend/store/ directory created
- [ ] Directory is in correct location
- [ ] Ready for store files
- [ ] Index file placeholder (optional)

---

## Task 03: Create Store Types

### Overview
Define comprehensive TypeScript types and interfaces for Zustand stores. These types ensure type safety across all store interactions, provide excellent IDE autocomplete, and prevent runtime errors from incorrect state access.

### Dependencies
- Task 02: Create Store Directory

### Instructions

1. **Create types.ts file**
   - Navigate to store/ directory
   - Create new file named `types.ts`
   - Add module documentation

2. **Define base store state interface**
   - Create interface for common state
   - Include reset method signature
   - Define action pattern

3. **Define state slice pattern**
   - Interface for state properties
   - Interface for actions
   - Combined store interface

4. **Create middleware types**
   - Type for persist options
   - Type for devtools configuration
   - Type for immer enabler

5. **Export all types**
   - Export individual interfaces
   - Export utility types
   - Export type helpers

### Core Type Definitions

**Base Store Interface**
```
State properties
Action methods
Reset functionality
```

**State Slice Pattern**
```
Data properties
Loading states
Error states
Actions to modify state
```

**Action Pattern**
```
Parameters typed
Return type specified
Side effects documented
```

### Store Type Categories

| Category | Purpose | Example |
|----------|---------|---------|
| State | Data structure | user, isAuthenticated |
| Actions | State modifiers | setUser, logout |
| Selectors | Derived state | hasPermission, canAccess |
| Utilities | Helper methods | reset, hydrate |

### TypeScript Benefits

**Type Safety**
- Compile-time error detection
- Prevents invalid state access
- Ensures action signatures correct

**Developer Experience**
- Full IDE autocomplete
- Inline documentation
- Refactoring support
- Jump to definition

**Maintainability**
- Self-documenting code
- Easier onboarding
- Reduced bugs
- Better tooling support

### Middleware Type Integration

**Persist Middleware**
```
Name for localStorage key
Partialize function type
Merge function type
```

**DevTools Middleware**
```
Store name for identification
Action names for debugging
Enabled flag type
```

**Immer Middleware**
```
Draft state type
Producer function type
Return type handling
```

### Expected Outcome
- Comprehensive type definitions
- Type-safe store creation
- Excellent IDE support
- Foundation for all stores

### Verification Checklist
- [ ] types.ts file created
- [ ] Base store interface defined
- [ ] State slice pattern established
- [ ] Action types defined
- [ ] Middleware types included
- [ ] All types exported

---

## Task 04: Configure Immer Middleware

### Overview
Configure the Immer middleware for Zustand stores to enable intuitive mutable-style state updates that produce immutable results. Immer allows developers to write straightforward state mutations while maintaining immutability benefits, simplifying complex nested state updates.

### Dependencies
- Task 01: Install Zustand (immer installed)
- Task 03: Create Store Types

### Instructions

1. **Import immer middleware**
   - Import from zustand/middleware
   - Import immer type definitions
   - Prepare for store configuration

2. **Create immer configuration utility**
   - Define immer options
   - Set up type inference
   - Create reusable pattern

3. **Document immer usage pattern**
   - Show mutable update syntax
   - Explain immutability guarantee
   - Provide usage examples

4. **Configure for nested updates**
   - Handle deep object updates
   - Array manipulation patterns
   - Complex state scenarios

5. **Test immer functionality**
   - Verify immutability maintained
   - Test nested updates
   - Confirm performance acceptable

### Immer Middleware Purpose

**Without Immer (Manual Immutability)**
```
Spread operators required
Nested spreads complex
Error-prone for deep updates
Verbose code
```

**With Immer (Automatic Immutability)**
```
Direct property assignment
Array push/splice/sort works
Natural JavaScript syntax
Concise code
```

### Immer Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| autoFreeze | true (dev) | Freeze draft in development |
| useProxies | true | Use Proxy for drafts |

### Usage Patterns

**Simple Property Update**
- Direct assignment syntax
- No spread operators needed
- Clear intent

**Nested Object Update**
- Navigate to nested property
- Assign new value directly
- Immer handles immutability

**Array Operations**
- Use push, splice, sort directly
- No need for concat, slice, map
- Natural array methods work

**Conditional Updates**
- Write normal if statements
- Multiple property updates
- Complex logic simplified

### Immer Benefits

| Benefit | Description |
|---------|-------------|
| Readability | Code reads like requirements |
| Maintainability | Easy to understand updates |
| Performance | Only changes are cloned |
| Safety | Immutability guaranteed |

### Common Immer Patterns

**Object Update Pattern**
- Access state property
- Assign new value
- Return undefined (Immer handles)

**Array Add Pattern**
- Use state.array.push()
- Works with multiple items
- Maintains immutability

**Array Remove Pattern**
- Use state.array.splice()
- Remove by index
- Filter also works

**Nested Update Pattern**
- Navigate nested path
- Update leaf property
- Entire tree updated immutably

### Expected Outcome
- Immer middleware ready to use
- Simplified state updates
- Maintained immutability
- Developer-friendly API

### Verification Checklist
- [ ] Immer imported from middleware
- [ ] Configuration pattern established
- [ ] Usage documented
- [ ] Ready for store integration

---

## Task 05: Configure Persist Middleware

### Overview
Configure the Persist middleware to automatically synchronize store state with browser localStorage. This enables state persistence across page refreshes, browser sessions, and provides offline-first capabilities for the ERP dashboard.

### Dependencies
- Task 01: Install Zustand
- Task 03: Create Store Types

### Instructions

1. **Import persist middleware**
   - Import from zustand/middleware
   - Import PersistOptions type
   - Import storage interface

2. **Define persist configuration**
   - Set localStorage key name
   - Configure what to persist
   - Set up rehydration handling

3. **Create partialize function**
   - Select which state to persist
   - Exclude sensitive data
   - Exclude temporary state

4. **Configure storage options**
   - Use localStorage as default
   - Handle storage errors
   - Set up fallback behavior

5. **Set up rehydration callback**
   - Handle state restoration
   - Validate persisted data
   - Migrate old versions

6. **Handle SSR considerations**
   - Check for window availability
   - Skip persistence on server
   - Prevent hydration errors

### Persist Middleware Options

| Option | Type | Purpose |
|--------|------|---------|
| name | string | localStorage key identifier |
| storage | Storage | Storage backend (localStorage) |
| partialize | function | Select state to persist |
| onRehydrateStorage | function | Callback on restore |
| version | number | Schema version for migration |
| migrate | function | Migrate old state versions |

### Partialize Strategy

**What to Persist**
- User preferences (theme, language)
- UI state (sidebar collapsed)
- Authentication tokens
- Cached form data

**What NOT to Persist**
- Loading states
- Error messages
- Temporary UI state
- Sensitive data (if not secure)

### Storage Key Naming

| Store | Key Name | Example |
|-------|----------|---------|
| UI Store | lcc-ui-store | lcc-ui-store |
| Auth Store | lcc-auth-store | lcc-auth-store |
| Settings Store | lcc-settings-store | lcc-settings-store |

**Key Prefix: "lcc-"** (LankaCommerce Cloud)

### Rehydration Process

**Step 1: Check Storage**
- Look for persisted state
- Validate data exists
- Check version compatibility

**Step 2: Parse State**
- Parse JSON from localStorage
- Handle parse errors
- Validate structure

**Step 3: Merge State**
- Merge with initial state
- Override defaults
- Preserve new fields

**Step 4: Trigger Callback**
- Run onRehydrateStorage
- Update UI if needed
- Log restoration success

### Version Migration

**When to Migrate**
- State structure changed
- Properties renamed
- Types modified
- Breaking changes

**Migration Function**
- Check persisted version
- Transform old structure
- Return new structure
- Handle errors gracefully

### SSR Considerations

**Client-Only Persistence**
- Check typeof window !== 'undefined'
- Skip storage operations on server
- Prevent hydration mismatches

**Next.js Integration**
- Use useEffect for client-side checks
- Don't access localStorage on server
- Handle initial render carefully

### Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| QuotaExceeded | localStorage full | Clear old data |
| SecurityError | Blocked by browser | Fallback to memory |
| Parse Error | Corrupted data | Reset to defaults |

### Expected Outcome
- State persists across sessions
- Automatic localStorage sync
- Graceful error handling
- SSR-compatible implementation

### Verification Checklist
- [ ] Persist middleware imported
- [ ] Storage key configured
- [ ] Partialize function defined
- [ ] Rehydration callback created
- [ ] SSR handled properly
- [ ] Error handling in place

---

## Task 06: Configure DevTools Middleware

### Overview
Configure the DevTools middleware to enable Zustand store debugging through browser DevTools extensions. This provides visibility into state changes, action dispatches, time-travel debugging, and state inspection capabilities essential for development and troubleshooting.

### Dependencies
- Task 01: Install Zustand

### Instructions

1. **Import devtools middleware**
   - Import from zustand/middleware
   - Import DevtoolsOptions type
   - Prepare for configuration

2. **Configure devtools options**
   - Set store name for identification
   - Enable in development only
   - Configure action names

3. **Set up store naming convention**
   - Use descriptive store names
   - Follow naming pattern
   - Easy identification in DevTools

4. **Configure action naming**
   - Enable automatic action names
   - Custom action names for clarity
   - Group related actions

5. **Document DevTools usage**
   - How to open DevTools
   - How to inspect state
   - How to time-travel debug

### DevTools Middleware Options

| Option | Type | Purpose |
|--------|------|---------|
| name | string | Store identifier in DevTools |
| enabled | boolean | Enable/disable DevTools |
| anonymousActionType | string | Default action name |
| store | string | Store name in DevTools |

### Store Naming Convention

| Store | DevTools Name | Purpose |
|-------|---------------|---------|
| UI Store | "LCC/UI" | UI state tracking |
| Auth Store | "LCC/Auth" | Auth state tracking |
| Settings Store | "LCC/Settings" | Settings tracking |

**Naming Pattern: "LCC/{Domain}"**

### Action Naming Strategies

**Automatic Naming**
- Uses function name as action
- Works for simple cases
- May not be descriptive enough

**Custom Naming**
- Provide explicit action names
- Better debugging experience
- Clearer state change tracking

**Naming Convention**
```
Pattern: DOMAIN/ACTION
Examples: 
- UI/TOGGLE_SIDEBAR
- AUTH/LOGIN
- AUTH/LOGOUT
```

### DevTools Features

| Feature | Description |
|---------|-------------|
| State Inspector | View current state |
| Action Log | See all dispatched actions |
| State Diff | View state changes |
| Time Travel | Jump to previous states |
| Export/Import | Save and restore state |

### Development vs Production

**Development Mode**
- DevTools enabled
- Full action logging
- State snapshots kept
- Performance overhead acceptable

**Production Mode**
- DevTools disabled
- No logging overhead
- Minimal bundle impact
- Security consideration

### Environment Detection

**Automatic Detection**
- Check process.env.NODE_ENV
- Enable only in 'development'
- Disable in 'production'

**Manual Override**
- Allow manual enable/disable
- Useful for staging environments
- Control via environment variable

### DevTools Extension Requirements

**Browser Extensions**
- Redux DevTools Extension
- Available for Chrome, Firefox, Edge
- Free and open source

**Installation**
- Install from browser extension store
- Open browser DevTools
- Find Redux/Zustand tab

### Expected Outcome
- DevTools middleware configured
- Store debuggable in development
- Clear action and state visibility
- Production-safe configuration

### Verification Checklist
- [ ] DevTools middleware imported
- [ ] Store name configured
- [ ] Development-only enabled
- [ ] Action naming set up
- [ ] Documentation created

---

## Task 07: Create createStore Utility

### Overview
Create a comprehensive store creation utility that combines all three middlewares (immer, persist, devtools) in the correct order with proper TypeScript typing. This utility serves as the foundation for all Zustand stores, ensuring consistent configuration and reducing boilerplate across the application.

### Dependencies
- Task 04: Configure Immer Middleware
- Task 05: Configure Persist Middleware
- Task 06: Configure DevTools Middleware

### Instructions

1. **Create utils.ts file**
   - Navigate to store/ directory
   - Create new file named `utils.ts`
   - Add module documentation

2. **Import all middlewares**
   - Import immer from zustand/middleware
   - Import persist from zustand/middleware
   - Import devtools from zustand/middleware
   - Import create from zustand

3. **Define createStore function signature**
   - Generic type parameters for state
   - Options parameter for configuration
   - Return type is store hook

4. **Configure middleware order**
   - Apply devtools first (outermost)
   - Apply persist second (middle)
   - Apply immer last (innermost)

5. **Handle optional middlewares**
   - Make persist optional
   - Make devtools configurable
   - Always apply immer

6. **Create typed return value**
   - Return properly typed hook
   - Include all middleware features
   - Maintain type inference

7. **Add JSDoc documentation**
   - Document parameters
   - Provide usage examples
   - Explain middleware order

### Middleware Application Order

**Order Matters!**

```
┌─────────────────────────────────────┐
│ DevTools (outermost)                │
│  ┌─────────────────────────────┐   │
│  │ Persist (middle)            │   │
│  │  ┌─────────────────────┐   │   │
│  │  │ Immer (innermost)   │   │   │
│  │  │                     │   │   │
│  │  │   Store State       │   │   │
│  │  │                     │   │   │
│  │  └─────────────────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Why This Order?**
1. DevTools wraps everything for debugging
2. Persist handles storage before/after updates
3. Immer provides mutable update syntax

### createStore Function Design

**Function Signature**
```
Generic type for State
Options object parameter
Returns store hook
```

**Options Object**
```
name: Store identifier
persist: Persist configuration
devtools: DevTools configuration
```

**Return Type**
```
Zustand store hook
Includes setState, getState, subscribe
Full TypeScript support
```

### Persist Options in createStore

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| enabled | boolean | No | Enable persistence |
| storage | Storage | No | Storage backend |
| partialize | function | No | Select persisted state |
| version | number | No | Schema version |

### DevTools Options in createStore

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| enabled | boolean | No | Enable DevTools |
| name | string | Yes | Store name |

### Usage Pattern

**Creating a Simple Store**
```
Use createStore utility
Pass name and initializer
Return configured store hook
```

**Creating a Persisted Store**
```
Use createStore utility
Enable persist option
Configure partialize
Return persisted store
```

**Creating Store with All Features**
```
Use createStore utility
Enable persist with config
Enable DevTools with name
Apply immer automatically
```

### TypeScript Type Inference

**Automatic Type Inference**
- State type inferred from initializer
- Actions typed automatically
- No manual type annotations needed

**Type Safety Benefits**
- Compile-time checking
- Autocomplete support
- Refactoring safety

### Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Type Error | Incorrect state type | Check initializer |
| Persist Error | localStorage blocked | Catch and fallback |
| DevTools Error | Extension missing | Gracefully disable |

### Performance Considerations

**Middleware Overhead**
- DevTools: Minimal in prod (disabled)
- Persist: Small overhead on updates
- Immer: Efficient structural sharing

**Optimization Tips**
- Use partialize to reduce persist size
- Disable DevTools in production
- Keep state normalized

### Expected Outcome
- Reusable store creation utility
- All middlewares integrated
- Type-safe implementation
- Consistent configuration across stores

### Verification Checklist
- [ ] utils.ts file created
- [ ] All middlewares imported
- [ ] createStore function defined
- [ ] Middleware order correct
- [ ] TypeScript types complete
- [ ] JSDoc documentation added
- [ ] Usage examples provided

---

## Summary

This document established the foundation for Zustand state management by installing the library, creating the store directory structure, and configuring three essential middlewares. The createStore utility combines immer for intuitive state updates, persist for localStorage integration, and devtools for debugging capabilities. This infrastructure provides a solid base for creating all application stores with consistent configuration and excellent developer experience.

### Completed Tasks

| Task | Status | Key Deliverable |
|------|--------|----------------|
| 01 | ✓ | Zustand and immer installed |
| 02 | ✓ | store/ directory structure |
| 03 | ✓ | TypeScript type definitions |
| 04 | ✓ | Immer middleware configured |
| 05 | ✓ | Persist middleware configured |
| 06 | ✓ | DevTools middleware configured |
| 07 | ✓ | createStore utility function |

### Next Steps

The next document covers selector patterns, store utilities for reset and hydration, index file organization, DevTools extension documentation, and final setup verification. These elements complete the Zustand infrastructure before building specific stores for UI, authentication, and other domains.
