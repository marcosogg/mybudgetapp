# Changelog

## [Unreleased]

### Added
- New budget calculation utilities in `src/utils/budget/calculations.ts`
- New custom hook `useBudgetMetrics` for centralized budget calculations
- Improved code organization with dedicated budget utilities folder
- Added Period Overview card with month picker to dashboard
- Reorganized dashboard top cards layout for better visual hierarchy

### Changed
- Refactored budget calculations into reusable utility functions
- Simplified budget calculation logic with pure functions
- Improved type safety for budget calculations
- Updated dashboard layout to group summary cards under a period overview
- Integrated month picker with existing MonthContext
- Redesigned Monthly Budget card with improved visual hierarchy and progress tracking
- Enhanced budget progress visualization with new progress bar design
- Improved number formatting and accessibility in budget display

### Technical Details
- Created pure calculation functions for better testability
- Implemented memoization for performance optimization
- Centralized budget calculation logic to reduce code duplication
- Enhanced dashboard component organization
- Improved responsive layout handling
- Added ARIA labels for better accessibility
- Enhanced number formatting for better readability