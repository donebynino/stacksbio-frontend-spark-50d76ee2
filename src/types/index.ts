
/**
 * Core types and interfaces for StacksBio application
 * These define the data structures used throughout the frontend
 */

// User profile data structure
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  walletAddress?: string; // Placeholder for Web3 integration
  theme: ProfileTheme;
  createdAt: Date;
  updatedAt: Date;
}

// Link data structure for link-in-bio functionality
export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  clickCount: number;
  order: number;
  style: LinkStyle;
  createdAt: Date;
}

// Link styling options
export interface LinkStyle {
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow: 'none' | 'sm' | 'md' | 'lg';
}

// Profile theme configuration
export interface ProfileTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  layout: 'centered' | 'left' | 'right';
}

// Analytics data structure
export interface Analytics {
  totalClicks: number;
  dailyClicks: DailyClick[];
  topLinks: Link[];
  visitorCount: number;
  conversionRate: number;
}

export interface DailyClick {
  date: string;
  clicks: number;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Wallet connection status for Stacks blockchain
export interface WalletState {
  isConnected: boolean;
  address?: string;
  balance?: number;
  network?: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation item for dashboard
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  isActive?: boolean;
}
