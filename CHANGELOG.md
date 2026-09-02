# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-07-26

### Added
- Professional repository files: `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `SECURITY.md`, `CONTRIBUTING.md`.
- `.env.example` for environment variable management.
- ESLint and Prettier for code quality and consistent formatting.
- GitHub Actions workflow for Continuous Integration (`ci.yml`).
- `public/` directory for static assets.

### Changed
- **Major Architectural Refactor**: Migrated project to a more scalable and production-grade folder structure.
- Reorganized `src/modules` into `src/features` for better feature-slicing.
- Consolidated `src/hooks`, `src/context`, and `src/store` into `src/lib`.
- Moved all UI components into `src/components` and organized them into `layout`, `system`, `ui`, and `shared` subdirectories.
- Updated all import paths across the entire application to reflect the new structure.

## [1.0.0] - 2024-07-25

### Added
- Initial project setup with Next.js, TypeScript, ShadCN, and TailwindCSS.
- Complete UI for a global job portal including public-facing pages and a comprehensive admin panel.
- Feature-sliced architecture using a `modules` directory.
- Service adapter pattern for decoupling UI from a mock data layer.
- Role-Based Access Control (RBAC) system with static and dynamic rules.
- Mock services for all data entities (Jobs, Candidates, Users, etc.).
