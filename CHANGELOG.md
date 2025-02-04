# Changelog

## [Unreleased]

### Added
- Initial groundwork for Wise statement format support
- New utility file for Wise data transformation
- Basic format detection for Wise CSV files
- Placeholder structure for future Wise import implementation
- User-friendly notifications for Wise format detection

### Changed
- Enhanced CSV import to conditionally handle different statement formats
- Improved error messages for format-specific validation
- Updated import logic to check user's preferred statement format
- Preserved existing Revolut import functionality

### Technical Details
- Added wiseTransformer.ts for handling Wise-specific transformations
- Enhanced format validation with statement_format awareness
- Added logging for future Wise format implementation
- Maintained backward compatibility with Revolut format
