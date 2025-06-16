# SisInCop - Sistema de Inventário e Controle de Pallets

## Overview

SisInCop is a comprehensive inventory and pallet control system designed for warehouse management. The application is built as a full-stack web application with a React frontend and Express.js backend, featuring user authentication, inventory management, service order tracking, pallet destruction management, and comprehensive reporting capabilities.

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

**Frontend**: React with TypeScript, using Vite as the build tool and development server
**Backend**: Express.js with TypeScript for API endpoints and business logic
**Database**: PostgreSQL with Drizzle ORM for type-safe database operations
**Authentication**: Session-based authentication with user roles (admin, operador, inventariante)
**UI Components**: shadcn/ui component library with Tailwind CSS for styling

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation schemas
- **UI Components**: Custom shadcn/ui components with consistent design system
- **Styling**: Tailwind CSS with custom green color palette reflecting company branding

### Backend Architecture
- **API Layer**: RESTful API built with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Authentication**: Express sessions with bcrypt for password hashing
- **Middleware**: Custom logging, error handling, and session management

### Database Schema
The system uses a comprehensive PostgreSQL schema with the following key entities:
- **Users**: Multi-role user system (admin, operador, inventariante)
- **Clients**: Customer management with CNPJ tracking
- **Service Orders**: Order tracking with fiscal documentation
- **Pallets**: Individual pallet tracking with weight and location data
- **Inventory**: Inventory management with status tracking
- **Destruction**: Pallet destruction tracking with machine and destination logging
- **Configuration Tables**: Flexible configuration for cargo types, materials, classifications, etc.

## Data Flow

1. **Authentication Flow**: Users authenticate via login form, session stored server-side
2. **Service Order Creation**: Operators create service orders with client and fiscal information
3. **Pallet Registration**: Pallets are registered against service orders with detailed tracking
4. **Inventory Management**: Items are inventoried with location and status tracking
5. **Destruction Process**: Pallets can be marked for destruction with audit trail
6. **Reporting**: Dashboard provides metrics and activity logging

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript support
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Data Fetching**: TanStack React Query for server state
- **Form Validation**: React Hook Form with Zod schemas
- **Styling**: Tailwind CSS with custom configuration

### Backend Dependencies
- **Database**: Neon PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: bcrypt for password hashing, express-session for session management
- **API**: Express.js with TypeScript support

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:
- **Development**: Hot-reload development server using Vite and tsx
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Production**: Node.js serves the bundled application
- **Database**: PostgreSQL connection via environment variables
- **Port Configuration**: Configures for port 5000 with external port 80

The deployment uses autoscale targeting with build and run commands configured for production deployment.

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Fixed unit selection navigation and React DOM error by implementing proper state management and creating simplified receiving page
- June 14, 2025. Completed major system updates: agendamento field changed to numeric/optional, user edit/delete functionality implemented, profile management with permissions and unit access control added, logout behavior updated to return to unit selection, login footer updated to "2025 Desenvolvido por Artedigit@l"
- June 14, 2025. Enhanced system with barcode scanning capabilities for inventory management SKU input, integrated advanced dashboard analytics with charts and performance metrics, fixed SelectItem errors in receiving consultas filters, and added comprehensive data visualization with Recharts library
- June 14, 2025. Fixed 500 error in user creation by adding duplicate username validation and proper error handling, added logout button to unit selection screen for improved user experience
- June 14, 2025. Implemented comprehensive unit access control system: added Unidades field to user management allowing administrators to select which units (RJ, GO, SP) each user can access, updated user interface to display unit permissions with visual badges, enhanced backend validation for array fields
- June 14, 2025. Completed comprehensive permissions management system: implemented granular permission controls for all modules (dashboard, receiving, pallets, destruction, inventory, clients, configuration, system administration), created role-based default permissions with visual permission interface, added detailed pallets endpoint for Controle de Entradas feature, enhanced user management with comprehensive access control including unit restrictions and module-specific permissions (view, create, edit, delete)
- June 15, 2025. Completed system finalization: replaced RCR logo with RCR Ambiental branding across login and unit selection pages, implemented complete pallet receipt printing with CODE128 barcode generation, cleaned demonstration data from database and analytics dashboard, improved dashboard card colors with softer pastel tones, fixed TypeScript errors throughout system, installed @types/file-saver for proper type definitions, resolved all form validation and data access issues
- June 15, 2025. Updated pallet numbering system to pure numeric sequential format: modified backend to generate 6-digit sequential numbers (000001, 000002, etc.), updated Registrar submenu interface to display automatic numbering, removed old mixed format generation function, implemented cache invalidation for next sequential number generation
- June 15, 2025. Enhanced user interface: added "Sair" button alongside "Atualizar Usuário" in Sistema screen for better dialog management, moved "Tipos de Tara" configuration from Destruição section to Recebimento section for improved logical organization
- June 15, 2025. Fixed API configuration errors: corrected apiRequest parameter order (HTTP method first), added missing PUT/DELETE routes for caçambas, implemented proper dialog state management for user editing with functional "Sair" button
- June 15, 2025. Enhanced destruction registration form: converted caçamba field to dropdown populated from system configuration, updated máquinas and destinos finais to use dynamic dropdowns with real data from configuration management
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```