# Changelog

## [Unreleased]

### Added
- Initial groundwork for Wise statement format support
- New utility file for Wise data transformation
- Basic format detection for Wise CSV files
- Placeholder structure for future Wise import implementation
- User-friendly notifications for Wise format detection
- Confirmation dialog for statement format changes
- Warning message for format changes
- Improved user feedback for format updates
- Enhanced date parsing using date-fns library
- Robust date format handling for both Wise and Revolut formats
- Improved date validation and error handling
- Support for multiple date formats (DD/MM/YYYY, YYYY/MM/DD)
- Comprehensive date parsing validation
- Detailed logging for debugging date parsing issues
- Format normalization for consistent date handling
- Import validation warnings with statement type confirmation
- Statement type indicator on import page
- Improved import flow with user preferences validation

### Changed
- Modified Create New Savings Goal form to use existing MonthPicker component for date selection
- Improved consistency by reusing existing component
- Maintained all existing form functionality
- Enhanced CSV import to conditionally handle different statement formats
- Improved error messages for format-specific validation
- Updated import logic to check user's preferred statement format
- Preserved existing Revolut import functionality
- Added safety check before changing statement format
- Simplified date parsing logic using date-fns
- Standardized date display format across the application
- Improved date parsing error handling and logging
- Enhanced validation for date string inputs
- Normalized date separators for consistent parsing
- Added detailed logging for debugging purposes
- Updated import UI with clear format indicators
- Enhanced import flow with confirmation dialogs
- Standardized card title styling across all dashboard components
  - Unified font size to text-xl
  - Consistent font weight using font-semibold
  - Added tracking-tight for improved readability
  - Standardized spacing in CardHeader components
- Updated title styling for:
  - Monthly Budget card
  - Monthly Income card
  - Transactions card
  - Upcoming Reminders section

### Technical Details
- Added wiseTransformer.ts for handling Wise-specific transformations
- Enhanced format validation with statement_format awareness
- Added logging for future Wise format implementation
- Maintained backward compatibility with Revolut format
- Added AlertDialog component for format change confirmation
- Implemented robust date parsing using date-fns library
- Added comprehensive error handling for date parsing
- Implemented defensive programming for date handling
- Added support for multiple date format detection
