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

### Changed
- Enhanced CSV import to conditionally handle different statement formats
- Improved error messages for format-specific validation
- Updated import logic to check user's preferred statement format
- Preserved existing Revolut import functionality
- Added safety check before changing statement format

### Technical Details
- Added wiseTransformer.ts for handling Wise-specific transformations
- Enhanced format validation with statement_format awareness
- Added logging for future Wise format implementation
- Maintained backward compatibility with Revolut format
- Added AlertDialog component for format change confirmation