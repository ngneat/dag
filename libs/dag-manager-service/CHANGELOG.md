# Changelog

## [3.0.0] - 2026-02-13

### ⚠ BREAKING CHANGES

- **Strict Typing**: Public service methods now have strict argument and return types. Consumers relying on implicit `any` may face compilation errors.
- **Error Handling**: `addNewRelation` now throws an error instead of swallowing it. Applications must handle potential errors when adding invalid relations.
- **Immutability**: The service now uses immutable state updates. `getCurrentDagModel()` returns a reference that will not be mutated by subsequent service operations.

### Features

- **Performance**: Converted recursive methods (`convertArrayToDagModel`, `removeItem`, `getNodeDepth`) to iterative implementations to prevent stack overflows with deep graphs.
- **Modernization**: Updated array handling to use modern ES6+ syntax (`flat()`, `map()`, `filter()`).

### Bug Fixes

- Fixed swallowed stack traces in `addNewRelation`.
- Fixed in-place mutation of arrays in `addItem`, `addRelation`, `removeItem`, and `insertNode`.
