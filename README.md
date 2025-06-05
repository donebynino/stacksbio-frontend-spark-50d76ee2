
# StacksBio

A decentralized link-in-bio application built on the Stacks blockchain. This repository contains the complete full-stack implementation with smart contracts, Web3 integration, and modern React frontend.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser
- Clarinet (for smart contract development)
- Stacks wallet (Hiro Wallet, Xverse, etc.)

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

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) to view the application.

### Smart Contract Development

1. Install Clarinet:
```bash
# macOS
brew install clarinet

# Other platforms: https://github.com/hirosystems/clarinet
```

2. Test smart contracts:
```bash
clarinet test
```

3. Deploy to local devnet:
```bash
clarinet integrate
```

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
│   ├── useWallet.ts    # Stacks wallet integration
│   ├── useProfile.ts   # Profile management with smart contracts
│   └── useLinks.ts     # Link management with smart contracts
├── lib/                # Utility libraries
│   └── stacks.ts       # Smart contract interaction utilities
├── pages/              # Route-based page components
│   ├── Index.tsx       # Landing page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   └── index.ts        # Core application types
└── styles/             # Global styles and Tailwind config

contracts/              # Smart contracts (Clarity)
├── profile.clar        # User profile management
├── links.clar          # Link storage and management
└── analytics.clar      # Analytics and tracking

tests/                  # Smart contract tests
├── profile_test.ts     # Profile contract tests
└── links_test.ts       # Links contract tests
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

## 🔗 Smart Contracts

### Profile Contract (`contracts/profile.clar`)
- **Purpose**: User profile management on Stacks blockchain
- **Features**: Profile creation, updates, theme customization, verification
- **Functions**: create-profile, update-profile, update-theme, get-profile-by-username
- **Security**: Ownership verification, username uniqueness, admin controls

### Links Contract (`contracts/links.clar`)
- **Purpose**: Decentralized link storage and management
- **Features**: CRUD operations, styling, click tracking, ordering
- **Functions**: create-link, update-link, delete-link, increment-click-count
- **Security**: Owner-only modifications, input validation, max limits

### Analytics Contract (`contracts/analytics.clar`)
- **Purpose**: Track views, clicks, and user engagement
- **Features**: Profile views, link clicks, visitor tracking, daily analytics
- **Functions**: record-profile-view, record-link-click, get-profile-totals
- **Privacy**: Hash-based visitor identification, no personal data storage

## 🔌 Integration Status

### Wallet Integration ✅
- **File**: `src/hooks/useWallet.ts`
- **Status**: Complete Stacks wallet integration
- **Features**: Hiro Wallet, Xverse support, session persistence, balance tracking

### Smart Contract Integration ✅
- **Files**: `src/hooks/useProfile.ts`, `src/hooks/useLinks.ts`, `src/lib/stacks.ts`
- **Status**: Full smart contract integration
- **Features**: Real-time blockchain operations, type-safe contract calls

### Analytics Integration ✅
- **File**: `contracts/analytics.clar`
- **Status**: On-chain analytics tracking
- **Features**: View/click tracking, visitor analytics, performance metrics

## 🛠️ Development

### Available Scripts

**Frontend Development**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Smart Contract Development**
- `clarinet test` - Run smart contract tests
- `clarinet check` - Check contract syntax
- `clarinet integrate` - Start local devnet
- `clarinet deploy` - Deploy contracts

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

## � Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# Network Configuration
NODE_ENV=development
NEXT_PUBLIC_NETWORK=mocknet

# Smart Contract Addresses (set after deployment)
NEXT_PUBLIC_PROFILE_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.profile
NEXT_PUBLIC_LINKS_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.links
NEXT_PUBLIC_ANALYTICS_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.analytics

# API URLs
NEXT_PUBLIC_STACKS_API_URL=http://localhost:3999
NEXT_PUBLIC_STACKS_CORE_API_URL=http://localhost:20443
```

## 🧪 Testing

### Smart Contract Tests
```bash
# Run all contract tests
clarinet test

# Run specific test file
clarinet test tests/profile_test.ts
```

### Frontend Tests
```bash
# Run frontend tests (when implemented)
npm test
```

## 🚀 Deployment

### Smart Contracts
1. Deploy to testnet:
```bash
clarinet deploy --testnet
```

2. Deploy to mainnet:
```bash
clarinet deploy --mainnet
```

### Frontend
1. Build for production:
```bash
npm run build
```

2. Deploy to Vercel/Netlify or your preferred hosting platform

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

## 🔒 Security

### Smart Contract Security
- Ownership verification for all write operations
- Input validation and sanitization
- Access control with proper authorization
- Nonce-based replay attack prevention
- Gas optimization to prevent DoS attacks

### Wallet Security
- Private keys never stored or transmitted
- Secure session management
- Signature verification for all transactions
- Network validation for contract calls

### Frontend Security
- XSS prevention with proper sanitization
- CSRF protection with wallet signatures
- Secure environment variable handling
- HTTPS enforcement in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run tests: `clarinet test` and `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow the established code structure
- Add proper TypeScript types
- Include component documentation
- Test responsive design
- Update tests for new functionality
- Update this README for significant changes

---

**Status**: Full-stack implementation complete with smart contracts and Web3 integration
**Network**: Compatible with Stacks mainnet, testnet, and local development
**Security**: Production-ready with comprehensive security measures
**Last Updated**: June 4, 2025
