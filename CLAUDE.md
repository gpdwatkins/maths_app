# Puzzles App - Codebase Summary

> **Important:** If you make significant changes to the codebase structure, features, or architecture, please update this summary to keep it accurate for future sessions.

## Overview

This is a **React Native mobile application** built with **Expo** that functions as a puzzle-solving social platform. Users can solve daily math/logic puzzles, share achievements, join clusters (private groups), and interact with other puzzle solvers.

**Platforms:** iOS, Android, Web (via Expo)

## Technology Stack

- **Framework:** React Native 0.73.0 + React 18.2.0
- **Build System:** Expo ~50.0.0 with expo-router (file-based routing)
- **Language:** TypeScript 5.3.0
- **Backend:** Supabase (PostgreSQL + Auth)
- **Auth Providers:** Email/password, Google, Apple, GitHub OAuth
- **Local Storage:** AsyncStorage for session persistence

## Directory Structure

```
maths_app/
├── app/                    # Expo Router screens & navigation
│   ├── (auth)/             # Auth flow (login, register)
│   ├── (tabs)/             # Main tabbed interface (home, puzzles, clusters, profile)
│   ├── puzzle/[id].tsx     # Individual puzzle detail
│   ├── puzzle-channel/[id].tsx  # Channel's puzzle list
│   ├── cluster/[id].tsx    # Cluster detail
│   └── admin/              # Admin features (create puzzle)
│
├── components/             # Reusable UI components
│   ├── ui/                 # Base elements (Button, Card, Input, LoadingSpinner, EmptyState,
│   │                       #   WebHeader, WebTabBar, WebContentContainer, SubPageLayout)
│   ├── auth/               # Auth forms (EmailAuthForm, OAuthButtons)
│   ├── puzzle/             # Puzzle display (PuzzleCard, PuzzleImage, answer inputs)
│   ├── feed/               # Social feed (FeedItem, PuzzlePost, CompletionPost)
│   └── profile/            # User profile (ProfileHeader, StatsCard)
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.tsx         # Auth context & state management
│   ├── usePuzzles.ts       # Puzzle/channel data loading
│   ├── useFeed.ts          # Feed posts with interactions
│   └── useClusters.ts      # Cluster data loading
│
├── services/               # Backend API integration
│   ├── supabase.ts         # Supabase client config
│   ├── auth.service.ts     # Authentication operations
│   ├── puzzle.service.ts   # Puzzle CRUD & submissions
│   ├── feed.service.ts     # Feed/post operations
│   ├── cluster.service.ts  # Cluster management
│   ├── profile.service.ts  # User profile operations
│   └── notification.service.ts  # Push notifications (stub)
│
├── types/                  # TypeScript type definitions
│   ├── auth.types.ts       # User, session, credentials
│   ├── puzzle.types.ts     # Puzzle, channel, submission
│   ├── feed.types.ts       # Post types
│   ├── cluster.types.ts    # Cluster, member types
│   └── profile.types.ts    # Profile, stats types
│
├── utils/                  # Utility functions
│   ├── constants.ts        # Colors, spacing, typography, routes
│   └── helpers.ts          # Date formatting, validation, text utils
│
├── __tests__/              # Jest test files
└── assets/                 # App icons and images
```

## Core Features

1. **Authentication:** Email/password, OAuth (Google, Apple, GitHub), guest mode
2. **Puzzles:** Browse channels, solve puzzles (MCQ or numerical), track completions
3. **Social Feed:** View puzzle posts, completion celebrations, "root" (like) posts
4. **Clusters:** Join private groups (schools, clubs), view members
5. **Profiles:** User stats (puzzles solved, streaks, followers), follow other users

## Key Data Models

- **User:** id, email, username, profilePictureUrl, bio, isGuest, stats
- **Puzzle:** id, channelId, title, imageUrl, answerType, correctAnswer, options
- **PuzzleChannel:** id, name, description, imageUrl, subscriberCount, puzzleCount
- **Cluster:** id, name, description, memberCount, inviteCode, isMember
- **Post:** id, type (puzzle/completion), userId, rootCount, isRooted

## Architecture Patterns

- **Routing:** File-based with Expo Router (`app/` directory)
- **State:** React Context for auth (`useAuth`), custom hooks for data fetching
- **Data Flow:** Screen → Hook → Service → Supabase → State → UI
- **Components:** Functional with hooks, UI components are reusable and style-driven

## Page Layout System

The app distinguishes between **main pages** and **sub-pages**:

### Main Pages
Pages accessible from the bottom navigation tabs (Home, Puzzles, Clusters, Profile). These are located in `app/(tabs)/` and automatically get the standard layout with:
- Header with centered logo and profile menu (via `WebHeader`)
- Bottom tab navigation (via `WebTabBar`)
- Centered content container on web (via `WebContentContainer`)

### Sub-Pages
Pages accessed from main pages (e.g., cluster detail, puzzle detail). These should:
1. **Wrap content with `SubPageLayout`** - provides consistent header, footer, and centered content
2. **Show a back button** - `WebHeader` with `showBackButton={true}` (handled by SubPageLayout)
3. **Match styling of related list pages** - e.g., member cards should match cluster cards styling

**Example sub-page structure:**
```tsx
import SubPageLayout from '@/components/ui/SubPageLayout';

export default function DetailScreen() {
  return (
    <SubPageLayout>
      <View style={styles.container}>
        {/* Page content */}
      </View>
    </SubPageLayout>
  );
}
```

### When Creating New Pages
- **Main page (in tabs)?** → Add to `app/(tabs)/`, wrap content with `WebContentContainer`
- **Sub-page (detail view)?** → Add to `app/`, wrap with `SubPageLayout`
- **Style consistency:** Lists on sub-pages should match the styling of parent page lists

## Design System

Located in `utils/constants.ts`:
- **Primary:** #A8DADC (light blue), #457B9D (dark blue)
- **Accent:** #E63946 (red)
- **Text:** #1D3557 (dark)
- **Spacing:** xs(4), sm(8), md(16), lg(24), xl(32)

## Development Status

- Many service functions have TODO comments for Supabase implementation
- Some mock data is used in services
- Notification service is stubbed
- Tests are placeholders

## Environment Variables

Required in Supabase config (`services/supabase.ts`):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Running the App

```bash
npm install
npx expo start           # Development server
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
npx expo start --web     # Web browser
npm test                 # Run Jest tests
```

---

## Maintenance Instructions

**When to update this document:**
- Adding new screens or major components
- Changing the directory structure
- Adding new services or data models
- Modifying the tech stack or dependencies
- Implementing previously stubbed features
- Changing authentication methods or providers

**How to update:**
Keep descriptions concise and accurate. Focus on what someone new to the codebase needs to understand the architecture and find their way around.
