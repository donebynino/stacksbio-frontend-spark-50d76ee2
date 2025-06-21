# StacksBio Deployment Guide

This guide covers deploying StacksBio smart contracts and frontend to various environments.

## 📋 Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- [Node.js 18+](https://nodejs.org/) installed
- Stacks wallet with STX for deployment
- Access to deployment environments

## 🔧 Environment Setup

### 1. Local Development

```bash
# Clone the repository
git clone <repository-url>
cd stacksbio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start local development
clarinet integrate
npm run dev
```

### 2. Environment Variables

Create `.env.local` with the following configuration:

```bash
# Network Configuration
NODE_ENV=development
NEXT_PUBLIC_NETWORK=mocknet

# Smart Contract Addresses (update after deployment)
NEXT_PUBLIC_PROFILE_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.profile
NEXT_PUBLIC_LINKS_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.links
NEXT_PUBLIC_ANALYTICS_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.analytics

# API URLs
NEXT_PUBLIC_STACKS_API_URL=http://localhost:3999
NEXT_PUBLIC_STACKS_CORE_API_URL=http://localhost:20443
```

## 🚀 Smart Contract Deployment

### 1. Local Deployment (Mocknet)

```bash
# Start local Stacks node
clarinet integrate

# Deploy contracts to local network
clarinet deploy --local
```

### 2. Testnet Deployment

```bash
# Configure testnet in Clarinet.toml
# Update network settings for testnet

# Deploy to testnet
clarinet deploy --testnet

# Verify deployment
clarinet console --testnet
```

### 3. Mainnet Deployment

```bash
# Configure mainnet settings
# Ensure sufficient STX balance for deployment

# Deploy to mainnet
clarinet deploy --mainnet

# Verify deployment on Stacks Explorer
```

### 4. Post-Deployment Configuration

After deploying contracts, update your environment variables:

```bash
# Update contract addresses in .env.local
NEXT_PUBLIC_PROFILE_CONTRACT=<deployed-address>.profile
NEXT_PUBLIC_LINKS_CONTRACT=<deployed-address>.links
NEXT_PUBLIC_ANALYTICS_CONTRACT=<deployed-address>.analytics

# Update API URLs for target network
NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.mainnet.stacks.co
NEXT_PUBLIC_STACKS_CORE_API_URL=https://stacks-node-api.mainnet.stacks.co
```

## 🌐 Frontend Deployment

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod

# Set environment variables in Vercel dashboard
```

### 2. Netlify Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload dist/ folder or connect GitHub repository
```

### 3. Custom Server Deployment

```bash
# Build for production
npm run build

# Serve static files
# Upload dist/ folder to your web server
```

## 🔍 Verification Steps

### 1. Smart Contract Verification

```bash
# Test contract functions
clarinet console

# Verify contract deployment
(contract-call? .profile get-total-profiles)

# Test profile creation
(contract-call? .profile create-profile "testuser" u"Test User" none none)
```

### 2. Frontend Verification

1. **Wallet Connection**: Test wallet connection with deployed contracts
2. **Profile Creation**: Create a test profile
3. **Link Management**: Add, edit, and delete links
4. **Analytics**: Verify click tracking works
5. **Network Switching**: Test on different networks

### 3. Integration Testing

```bash
# Run smart contract tests
clarinet test

# Test frontend integration
npm test

# End-to-end testing
npm run e2e
```

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] Smart contract security audit completed
- [ ] Input validation tested thoroughly
- [ ] Access control mechanisms verified
- [ ] Gas optimization reviewed
- [ ] Error handling tested
- [ ] Edge cases covered in tests

### Post-Deployment Security

- [ ] Contract addresses verified
- [ ] Admin functions tested
- [ ] Ownership verification working
- [ ] Rate limiting implemented
- [ ] Monitoring and alerting set up
- [ ] Backup and recovery procedures documented

## 📊 Monitoring and Maintenance

### 1. Contract Monitoring

```bash
# Monitor contract calls
# Set up alerts for unusual activity
# Track gas usage and optimization opportunities
```

### 2. Frontend Monitoring

```bash
# Set up error tracking (Sentry, LogRocket)
# Monitor performance metrics
# Track user engagement and conversion
```

### 3. Regular Maintenance

- **Weekly**: Review error logs and performance metrics
- **Monthly**: Security audit and dependency updates
- **Quarterly**: Comprehensive testing and optimization review

## 🆘 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check STX balance for deployment fees
   - Verify network configuration
   - Review contract syntax with `clarinet check`

2. **Frontend Can't Connect to Contracts**
   - Verify contract addresses in environment variables
   - Check network configuration matches deployed contracts
   - Ensure API URLs are correct for target network

3. **Wallet Connection Issues**
   - Verify wallet is on correct network
   - Check browser compatibility
   - Clear browser cache and cookies

### Debug Commands

```bash
# Check contract syntax
clarinet check

# Run specific tests
clarinet test tests/profile_test.ts

# Debug contract calls
clarinet console

# Check frontend build
npm run build
```

## 📞 Support

For deployment issues:

1. Check the [Clarinet documentation](https://docs.hiro.so/clarinet)
2. Review [Stacks documentation](https://docs.stacks.co)
3. Join the [Stacks Discord](https://discord.gg/stacks)
4. Open an issue in the repository

## 🔄 Rollback Procedures

### Contract Rollback

Smart contracts on Stacks are immutable, so rollback involves:

1. Deploy new contract version
2. Update frontend to use new contract addresses
3. Migrate data if necessary
4. Communicate changes to users

### Frontend Rollback

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy previous version
git checkout <previous-commit>
npm run build
vercel --prod
```

---

**Last Updated**: June 4, 2025
**Version**: 0.2.0
**Network Compatibility**: Mainnet, Testnet, Mocknet
