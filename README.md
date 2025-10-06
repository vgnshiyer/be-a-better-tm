# Be a better TM

## System Architecture

### Frontend Architecture

The application uses a modern React-based stack with the following key decisions:

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **class-variance-authority (CVA)** for managing component variants
- Implements a custom design system with CSS variables for theming

**State Management**
- **localStorage** for persistent data storage (no backend database integration)
- Custom `useLocalStorage` hook for reactive localStorage state management
- **@tanstack/react-query** for future server state management (currently minimal backend)

**Application Structure**
- Role-based page architecture with dedicated pages for each Toastmasters role
- Shared navigation component for consistent user experience
- Custom hooks for reusable logic (localStorage, mobile detection, toast notifications)

### Backend Architecture

The backend uses a minimal Express.js setup with the following characteristics:

**Server Framework**
- **Express.js** for HTTP server and routing
- **Vite middleware mode** for development with HMR support
- ESM module system throughout the codebase

**Data Layer (Prepared but Not Actively Used)**
- **Drizzle ORM** configured for PostgreSQL
- **Neon Database** serverless PostgreSQL driver
- In-memory storage implementation (`MemStorage`) currently active
- User schema defined but not actively used by the application

**Development vs Production**
- Development: Vite dev server with middleware mode
- Production: Static build served by Express
- Replit-specific plugins for enhanced development experience

### External Dependencies

**Database & ORM**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for database schema and queries
- Note: Database is configured but the app currently uses localStorage for all data

**UI Component Libraries**
- Radix UI primitives for accessible components (@radix-ui/*)
- Embla Carousel for carousel functionality
- Lucide React for icons
- date-fns for date formatting

**Form Management**
- React Hook Form with @hookform/resolvers
- Zod for schema validation (drizzle-zod integration)

**Development Tools**
- TypeScript for static type checking
- PostCSS with Autoprefixer for CSS processing
- ESBuild for server-side bundling in production

**Replit Integration**
- @replit/vite-plugin-runtime-error-modal for error display
- @replit/vite-plugin-cartographer for code intelligence
- @replit/vite-plugin-dev-banner for development branding

### Key Architectural Patterns

**Client-Side Data Persistence**
- All role-specific data stored in localStorage with unique keys per role
- Data persists across page refreshes and browser sessions
- Global "Reset All Data" functionality to clear localStorage

**Component Architecture**
- Atomic design with reusable UI components in `/client/src/components/ui`
- Page-level components in `/client/src/pages`
- Shared logic extracted to custom hooks in `/client/src/hooks`

**Routing Strategy**
- Client-side routing with role selection landing page
- Dedicated routes for each Toastmasters role
- Navigation component conditionally rendered based on current route

**Styling Approach**
- Utility-first CSS with Tailwind
- CSS custom properties for theming and design tokens
- Mobile-responsive design with breakpoint utilities
- Custom color palette inspired by Toastmasters branding