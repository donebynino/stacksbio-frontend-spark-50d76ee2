
# StacksBio Frontend

A decentralized link-in-bio application built on the Stacks blockchain. This repository contains the **frontend-only** implementation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stacksbio-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) to view the application.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # Shadcn/ui components (read-only)
│   ├── Header.tsx      # Main navigation header
│   ├── Hero.tsx        # Landing page hero section
│   ├── Features.tsx    # Features showcase
│   └── ProfilePreview.tsx # Profile preview component
├── hooks/              # Custom React hooks
│   ├── useWallet.ts    # Wallet connection (placeholder)
│   ├── useProfile.ts   # Profile management (placeholder)
│   └── useLinks.ts     # Link management (placeholder)
├── pages/              # Route-based page components
│   ├── Index.tsx       # Landing page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   └── index.ts        # Core application types
└── styles/             # Global styles and Tailwind config
```

## 🎨 Design System

### Color Palette
- **Yellow (#F4D03F)**: Primary accent, CTAs, highlights
- **Blue (#87CEEB)**: Secondary elements, backgrounds
- **Navy (#1B365D)**: Text, professional elements

### Key Components
- `Header`: Navigation with wallet connection
- `Hero`: Landing page hero section
- `Features`: Feature showcase grid
- `ProfilePreview`: Live preview of user profiles

## 🔌 Integration Points

### Wallet Integration
- **File**: `src/hooks/useWallet.ts`
- **Purpose**: Stacks wallet connection logic
- **Status**: Placeholder implementation
- **Next Steps**: Implement actual Stacks wallet connectivity

### Backend API
- **Files**: `src/hooks/useProfile.ts`, `src/hooks/useLinks.ts`
- **Purpose**: User data and link management
- **Status**: Mock data and placeholder functions
- **Next Steps**: Connect to actual backend/smart contracts

### Analytics
- **Location**: ProfilePreview component link clicks
- **Purpose**: Track link performance
- **Status**: Console logging placeholder
- **Next Steps**: Implement actual analytics tracking

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in `src/components/`
2. Add proper TypeScript types
3. Include JSDoc comments
4. Update this README if it's a major component

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the established color palette
- Implement responsive design (mobile-first)
- Add smooth transitions for interactive elements

## 📝 Mock Data

The application currently uses mock data for demonstration:

- **User Profile**: Demo user with sample bio and theme
- **Links**: Sample links with different styles and click counts
- **Wallet**: Mock wallet connection state

## 🚧 TODO for Backend Integration

1. **Smart Contract Integration**
   - Replace mock data in hooks with actual blockchain calls
   - Implement link storage and retrieval from contracts
   - Add profile ownership verification

2. **Wallet Connection**
   - Integrate Stacks wallet (Leather, Xverse)
   - Handle wallet state persistence
   - Implement transaction signing

3. **API Endpoints**
   - User profile CRUD operations
   - Link management endpoints
   - Analytics data collection
   - Image upload handling

4. **Authentication**
   - Wallet-based authentication
   - Session management
   - Protected routes

## 📖 Documentation

- All components include inline documentation
- Type definitions are comprehensive
- Integration points are clearly marked
- Mock data structure matches expected real data

## 🤝 Contributing

1. Follow the established code structure
2. Add proper TypeScript types
3. Include component documentation
4. Test responsive design
5. Update this README for significant changes

## 📄 License

[License information will be added]

---

**Note**: This is a frontend-only implementation. Blockchain logic, smart contracts, and backend functionality will be implemented separately.
