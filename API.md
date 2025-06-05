# StacksBio Smart Contract API Documentation

This document provides comprehensive API documentation for StacksBio smart contracts.

## 📋 Contract Overview

StacksBio consists of three main smart contracts:

- **Profile Contract**: User profile management and ownership
- **Links Contract**: Link storage and management with styling
- **Analytics Contract**: View and click tracking with privacy

## 🔗 Profile Contract API

### Public Functions

#### `create-profile`

Creates a new user profile with unique username.

**Parameters:**
- `username` (string-ascii 50): Unique username (3-50 characters)
- `display-name` (string-utf8 100): Display name for the profile
- `bio` (optional string-utf8 500): Profile bio/description
- `avatar-url` (optional string-ascii 200): Avatar image URL

**Returns:** `(response uint uint)`
- Success: Profile ID
- Error codes: 102 (profile exists), 103 (invalid username)

**Example:**
```clarity
(contract-call? .profile create-profile "johndoe" u"John Doe" (some u"Web developer") none)
```

#### `update-profile`

Updates profile information for the calling user.

**Parameters:**
- `display-name` (optional string-utf8 100): New display name
- `bio` (optional string-utf8 500): New bio
- `avatar-url` (optional string-ascii 200): New avatar URL

**Returns:** `(response bool uint)`
- Success: true
- Error codes: 101 (profile not found), 100 (not authorized)

#### `update-theme`

Updates profile theme settings.

**Parameters:**
- `primary-color` (string-ascii 7): Primary color hex code
- `secondary-color` (string-ascii 7): Secondary color hex code
- `background-color` (string-ascii 7): Background color hex code
- `text-color` (string-ascii 7): Text color hex code
- `button-style` (string-ascii 20): Button style ("rounded", "square", "pill")
- `layout` (string-ascii 20): Layout style ("centered", "left", "right")

**Returns:** `(response bool uint)`

### Read-Only Functions

#### `get-profile-by-username`

Retrieves profile data by username.

**Parameters:**
- `username` (string-ascii 50): Username to lookup

**Returns:** `(optional profile-data)`

#### `get-profile-by-owner`

Retrieves profile data by wallet address.

**Parameters:**
- `owner` (principal): Wallet address

**Returns:** `(optional profile-data)`

#### `is-username-available`

Checks if a username is available.

**Parameters:**
- `username` (string-ascii 50): Username to check

**Returns:** `bool`

#### `get-total-profiles`

Returns the total number of profiles created.

**Returns:** `uint`

### Admin Functions

#### `verify-profile`

Verifies a profile (admin only).

**Parameters:**
- `profile-id` (uint): Profile ID to verify

**Returns:** `(response bool uint)`

## 🔗 Links Contract API

### Public Functions

#### `create-link`

Creates a new link for the user's profile.

**Parameters:**
- `title` (string-utf8 100): Link title
- `url` (string-ascii 500): Link URL
- `description` (optional string-utf8 200): Link description
- `icon` (optional string-utf8 10): Link icon/emoji
- `style-background` (string-ascii 7): Background color
- `style-text` (string-ascii 7): Text color
- `style-border` (optional string-ascii 7): Border color
- `style-border-width` (uint): Border width in pixels
- `style-border-radius` (string-ascii 10): Border radius style
- `style-shadow` (string-ascii 10): Shadow style

**Returns:** `(response uint uint)`
- Success: Link ID
- Error codes: 202 (invalid input), 203 (profile not found), 204 (max links reached)

#### `update-link`

Updates an existing link.

**Parameters:**
- `link-id` (uint): Link ID to update
- `title` (optional string-utf8 100): New title
- `url` (optional string-ascii 500): New URL
- `description` (optional string-utf8 200): New description
- `icon` (optional string-utf8 10): New icon
- `is-active` (optional bool): Active status

**Returns:** `(response bool uint)`

#### `update-link-style`

Updates link styling.

**Parameters:**
- `link-id` (uint): Link ID to update
- `style-background` (string-ascii 7): Background color
- `style-text` (string-ascii 7): Text color
- `style-border` (optional string-ascii 7): Border color
- `style-border-width` (uint): Border width
- `style-border-radius` (string-ascii 10): Border radius
- `style-shadow` (string-ascii 10): Shadow style

**Returns:** `(response bool uint)`

#### `delete-link`

Deletes a link.

**Parameters:**
- `link-id` (uint): Link ID to delete

**Returns:** `(response bool uint)`

#### `increment-click-count`

Increments the click count for a link.

**Parameters:**
- `link-id` (uint): Link ID

**Returns:** `(response bool uint)`

### Read-Only Functions

#### `get-link`

Retrieves link data by ID.

**Parameters:**
- `link-id` (uint): Link ID

**Returns:** `(optional link-data)`

#### `get-profile-link-count`

Gets the number of links for a profile.

**Parameters:**
- `profile-id` (uint): Profile ID

**Returns:** `uint`

#### `is-link-owner`

Checks if a user owns a specific link.

**Parameters:**
- `link-id` (uint): Link ID
- `user` (principal): User address

**Returns:** `bool`

## 📊 Analytics Contract API

### Public Functions

#### `record-profile-view`

Records a profile view for analytics.

**Parameters:**
- `profile-id` (uint): Profile ID being viewed
- `visitor-hash` (buff 32): Visitor identification hash

**Returns:** `(response uint uint)`
- Success: Event ID

#### `record-link-click`

Records a link click for analytics.

**Parameters:**
- `profile-id` (uint): Profile ID
- `link-id` (uint): Link ID being clicked
- `visitor-hash` (buff 32): Visitor identification hash

**Returns:** `(response uint uint)`
- Success: Event ID

### Read-Only Functions

#### `get-daily-profile-analytics`

Gets daily analytics for a profile.

**Parameters:**
- `profile-id` (uint): Profile ID
- `date` (uint): Date (block height / 144)

**Returns:** `(optional analytics-data)`

#### `get-daily-link-analytics`

Gets daily analytics for a link.

**Parameters:**
- `link-id` (uint): Link ID
- `date` (uint): Date

**Returns:** `(optional link-analytics-data)`

#### `get-profile-totals`

Gets total analytics for a profile.

**Parameters:**
- `profile-id` (uint): Profile ID

**Returns:** `(optional profile-totals)`

#### `get-link-totals`

Gets total analytics for a link.

**Parameters:**
- `link-id` (uint): Link ID

**Returns:** `(optional link-totals)`

#### `get-current-analytics-date`

Gets the current analytics date.

**Returns:** `uint`

## 🔧 Error Codes

### Profile Contract
- `100`: ERR_NOT_AUTHORIZED - User not authorized for operation
- `101`: ERR_PROFILE_NOT_FOUND - Profile does not exist
- `102`: ERR_PROFILE_EXISTS - Profile or username already exists
- `103`: ERR_INVALID_USERNAME - Username validation failed
- `104`: ERR_INVALID_INPUT - Invalid input parameters

### Links Contract
- `200`: ERR_NOT_AUTHORIZED - User not authorized for operation
- `201`: ERR_LINK_NOT_FOUND - Link does not exist
- `202`: ERR_INVALID_INPUT - Invalid input parameters
- `203`: ERR_PROFILE_NOT_FOUND - Profile does not exist
- `204`: ERR_MAX_LINKS_REACHED - Maximum links per profile reached

### Analytics Contract
- `300`: ERR_NOT_AUTHORIZED - User not authorized for operation
- `301`: ERR_INVALID_INPUT - Invalid input parameters
- `302`: ERR_PROFILE_NOT_FOUND - Profile does not exist

## 📝 Data Structures

### Profile Data
```clarity
{
  owner: principal,
  username: (string-ascii 50),
  display-name: (string-utf8 100),
  bio: (optional (string-utf8 500)),
  avatar-url: (optional (string-ascii 200)),
  is-verified: bool,
  theme-primary: (string-ascii 7),
  theme-secondary: (string-ascii 7),
  theme-background: (string-ascii 7),
  theme-text: (string-ascii 7),
  theme-button-style: (string-ascii 20),
  theme-layout: (string-ascii 20),
  created-at: uint,
  updated-at: uint
}
```

### Link Data
```clarity
{
  owner: principal,
  profile-id: uint,
  title: (string-utf8 100),
  url: (string-ascii 500),
  description: (optional (string-utf8 200)),
  icon: (optional (string-utf8 10)),
  is-active: bool,
  click-count: uint,
  order: uint,
  style-background: (string-ascii 7),
  style-text: (string-ascii 7),
  style-border: (optional (string-ascii 7)),
  style-border-width: uint,
  style-border-radius: (string-ascii 10),
  style-shadow: (string-ascii 10),
  created-at: uint
}
```

## 🔒 Security Considerations

### Access Control
- All write operations require wallet signature
- Ownership verification for profile and link operations
- Admin functions restricted to contract deployer

### Input Validation
- Username length and character validation
- URL format validation for links
- Color code validation for themes
- Maximum limits enforced (50 links per profile)

### Privacy
- Visitor tracking uses hash-based identification
- No personal data stored on-chain
- Analytics data aggregated for privacy

---

**Last Updated**: June 4, 2025
**Contract Version**: 0.2.0
**Clarity Version**: 2.0
