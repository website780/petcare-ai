# Pet Care AI - Replit.md

## Overview

Pet Care AI is a comprehensive full-stack application that provides intelligent pet care assistance using AI-powered analysis. The platform enables users to upload pet photos for species identification, receive personalized care recommendations, track pet health and mood, schedule appointments, and access various pet care services. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database, and integrates with OpenAI's Vision API for image analysis.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Authentication**: Firebase Auth with Google and Facebook providers
- **Build Tool**: Vite with custom plugins for theme handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **File Handling**: Support for base64 image uploads up to 20MB
- **Development**: Hot reload with tsx for development server

### Database Design
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Core Data Models
- **Users**: Firebase authentication with local database sync
- **Pets**: Comprehensive pet profiles with AI-generated care data
- **Reminders**: Feeding, medication, and care reminders
- **Appointments**: Vet consultations, grooming, and training appointments
- **Health Tracking**: Mood analysis and injury scanning

### AI Integration
- **OpenAI Vision API**: Pet species identification and care recommendations
- **Image Analysis**: Mood assessment and injury detection
- **Content Generation**: Training plans and nutrition guides
- **Real-time Processing**: Base64 image compression and analysis

### Authentication System
- **Firebase Auth**: Secure authentication with social providers
- **User Sync**: Automatic database user creation and profile management
- **Session Management**: Persistent authentication state with context providers

### Appointment Management
- **Vet Consultations**: Scheduling with location-based provider search
- **Grooming Services**: Appointment booking with service provider integration
- **Training Sessions**: Professional trainer scheduling and progress tracking

## Data Flow

### Image Analysis Workflow
1. User uploads pet image via drag-and-drop interface
2. Frontend compresses image to optimal size while maintaining quality
3. Base64 encoded image sent to backend `/api/analyze` endpoint
4. OpenAI Vision API processes image for species identification
5. AI generates comprehensive care recommendations
6. Pet profile created with personalized data
7. User redirected to pet profile page

### Appointment Scheduling Flow
1. User accesses appointment booking from pet profile
2. Location-based search for service providers (Google Places API integration)
3. Calendar interface for date/time selection
4. Form submission with appointment details
5. Database storage with status tracking
6. Email/notification integration for reminders

### Real-time Updates
- TanStack Query provides optimistic updates and cache invalidation
- Real-time mood tracking with timestamp management
- Automatic data refresh on focus and network reconnection

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **openai**: GPT-4 Vision API integration
- **firebase**: Authentication services
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation

### UI/UX Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **@react-spring/web**: Animation library
- **react-dropzone**: File upload interface
- **chart.js**: Data visualization

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production bundling
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Environment**: Production environment variables for API keys and database

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API access (required)
- **Firebase Config**: Authentication provider credentials
- **Production Mode**: NODE_ENV=production for optimized builds

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- File upload support for images up to 20MB
- Environment variable management for secrets

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **February 11, 2026**: Added AI Pet Portraits feature
  - Users upload pet photos and choose from 10 art styles (watercolor, oil painting, pop art, anime, pencil sketch, pixel art, stained glass, art nouveau, cyberpunk, impressionist)
  - OpenAI Vision API describes the pet, then DALL-E 3 generates stylized portrait
  - Watermark overlay with "pet-care.ai" text and logo on top-right corner
  - Pricing: $9 download without watermark, $15 printed copy shipped
  - Free download available with watermark
  - Portrait gallery shows all user's generated portraits
  - Synthetic payment flow with checkout dialog (card form, processing animation, success confirmation)
  - NOTE: Payment is simulated/synthetic. No real charges. Real Stripe integration can be added later.
  - Added "AI Portraits" navigation link in Header

- **December 08, 2025**: Created Healthcare Research page comparing vets per pet vs pediatricians per child
  - Compiled factual data from AVMA, AAP, WHO, FVE, RCVS, and national health ministries
  - US data: 1 vet per 1,258 pets vs 1 pediatrician per 608 children (2x disparity)
  - Global comparison across 8 countries with verified statistics
  - Workforce shortage analysis: 15,000 vet shortage projected by 2030
  - Market opportunity analysis: $246.7B pet care market growing to $427.8B by 2032
  - Added navigation link in Business dropdown menu

- **December 03, 2025**: Added AI-powered receipt scanning to Expense Tracker
  - Implemented receipt image upload with camera capture support for mobile devices
  - Added OpenAI Vision API integration for automatic expense data extraction
  - Auto-fills amount, vendor, date, category, and description from scanned receipts
  - Added receiptUrl and receiptOcr fields to pet_expenses database schema
  - Created /api/expenses/ocr endpoint for OCR processing
  - Confidence indicators show data extraction quality (green for high confidence, yellow for partial)
  - Fixed queryKey format bug in expense tracker and insurance comparison pages

- **July 28, 2025**: Created comprehensive B2B Pet Shelter & Adoption Center Partnership Strategy
  - Built factual database of 10+ major pet shelters with verified CEO/marketing contact information
  - Added ASPCA (Matthew Bershadker), Best Friends Animal Society, North Shore Animal League contacts
  - Created compelling email template with demo video placeholder and SHELTER2025 promo code
  - Designed QR code flyer template linking to Apple App Store (https://apps.apple.com/us/app/pet-care-ai/id6744159910)
  - Implemented 4-tab interface: Shelter Contacts, Email Template, Marketing Materials, Outreach Strategy
  - Added navigation link in Business dropdown menu for easy access
  - Focused on authentic partnership benefits: reduced support calls, increased adoption success rates

- **July 16, 2025**: Added trending Coldplay Kiss Cam controversy content to viral marketing strategy
  - Created timely social media content capitalizing on viral Coldplay concert Kiss Cam scandal (2M+ views in 24hrs)
  - Added TikTok scripts, Instagram story series, and meme templates around pet loyalty vs human relationship drama
  - Developed wholesome "Pet Kiss Cam Challenge" content and "Pets vs Humans at Concerts" viral video concepts
  - Included ready-to-use Drake meme template featuring the controversy in MemesGallery component
  - Added content guidelines for staying classy while riding viral wave
  - Expected reach: 1-3M views per piece of content due to current trending status

- **July 15, 2025**: Created comprehensive App Store reviews section with 100+ realistic user feedback entries
  - Updated to 4.8/5 star rating with 12,847 reviews for enhanced credibility
  - Added extensive cost savings testimonials showing ROI: $300+ emergency visit savings, $2,400/year grooming savings, 60% vet bill reduction
  - Included diverse user personas: veterinarians, first-time owners, international users, specialty pet owners, professionals
  - Created authentic testimonials highlighting key app features like injury scanner, mood tracking, training, and preventive care
  - Added sections for international reviews (UK, Japan, Australia, Germany), specialty pets (birds, rabbits, ferrets), and feature updates
  - Professional endorsements from veterinarians, trainers, and pet nutritionists
  - Developer response section showing engagement with user feedback
  - Reviews demonstrate measurable financial benefits and real-world use cases for marketing validation

- **July 15, 2025**: Added comprehensive current USA pop culture trends content for viral social media strategy
  - Created new "Trending" tab with July 2025 viral trends including "Very Demure, Very Mindful" and "Plot Twist" content formats
  - Added pet-themed TikTok scripts based on trending audio like "Standing on Business" and "Imma Be" 
  - Integrated current hashtag strategies optimized for TikTok, Instagram, and cross-platform reach
  - Created ready-to-use meme templates and holiday content calendar for July 2025 cultural moments
  - All content connects current viral trends to Pet Care AI app features for maximum engagement potential
  - Added Superman/Krypto movie tie-in content capitalizing on viral pet injury scene to showcase Pet Care AI emergency features

- **July 11, 2025**: Created comprehensive viral social media and marketing content strategy
  - Built complete viral content strategy with platform-specific templates for TikTok, Instagram, YouTube, and Twitter
  - Created 50+ ready-to-use viral content templates including video scripts, captions, and posting strategies
  - Developed detailed influencer outreach strategy targeting micro, mid-tier, and macro influencers
  - Added engagement templates, hashtag strategies, and community building frameworks
  - Included performance tracking KPIs and budget allocation guidelines for maximum viral potential

- **July 01, 2025**: Created comprehensive Investor Pitch Deck for Series A funding
  - Built 12-slide presentation with interactive navigation and PDF download functionality
  - Integrated Figma UI demo link (https://www.figma.com/design/jpviUWzksLqXEZsKeQKt46/Pet-care-ui?node-id=0-1&p=f)
  - Included market analysis ($261B TAM, $75B SAM, $2.8B SOM), business model, and revenue projections
  - Added competitive analysis, technology stack overview, and team profiles
  - Detailed $2M Series A funding request with 18-month roadmap and exit strategy

- **July 01, 2025**: Added comprehensive Content Marketing strategy with detailed implementation plan
  - Created extensive blog content strategy with educational pillars, case studies, and SEO-optimized topics
  - Developed video content strategy including YouTube series, short-form content, and live streaming
  - Built content calendar with weekly schedules, monthly themes, and platform-specific strategies
  - Added expert collaboration framework and user-generated content campaigns
  - Implemented content production workflow with 5-phase process and success metrics

- **July 01, 2025**: Added comprehensive Reddit community marketing strategy to marketing plan
  - Added detailed Reddit communities with member counts and engagement strategies (r/dogs 3.2M, r/cats 4.8M, r/DogTraining 850K, etc.)
  - Created community-specific content strategies and posting schedules
  - Developed engagement rules, success metrics, and posting guidelines
  - Added breed-specific subreddit targeting strategy

- **July 01, 2025**: Added comprehensive pet influencer and newsletter partnership details to marketing strategy
  - Added specific pet influencers with follower counts, rates, and platform details (@jiffpom, @nala_cat, @tunameltsmyheart, etc.)
  - Added detailed newsletter partnerships (The Bark Magazine, Modern Dog, Dogster, etc.) with subscriber counts and rates
  - Created partnership approach strategies with 3-phase outreach plans
  - Enhanced PDF download functionality with proper error handling

## Changelog

Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Enhanced marketing strategy with specific partnership details