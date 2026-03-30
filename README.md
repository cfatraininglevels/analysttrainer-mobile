# AnalystTrainer Mobile

React Native mobile app for CFA Level 1 exam preparation. Practice 2,000+ questions, take mock exams, and track your progress - all on your iOS or Android device.

## 🚀 Tech Stack

- **React Native** with Expo SDK
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Query** for API state management
- **Supabase** for authentication and data

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for testing)
- iOS Simulator (Mac only) or Android Emulator

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your environment variables:

```
EXPO_PUBLIC_API_URL=https://www.analysttrainer.com/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
npm start
```

This will open Expo DevTools. From there you can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

### 4. Run on Specific Platform

```bash
npm run ios     # iOS simulator (Mac only)
npm run android # Android emulator
npm run web     # Web browser
```

## 📱 Features

### Phase 1 (Current)
- [ ] User authentication (Supabase)
- [ ] Question bank browser
- [ ] Practice sessions
- [ ] Basic progress tracking

### Phase 2
- [ ] Mock exams
- [ ] Flashcards
- [ ] Offline mode
- [ ] Performance analytics

### Phase 3
- [ ] Study plans
- [ ] Formula sheets
- [ ] Social features
- [ ] Push notifications

## 📂 Project Structure

```
analysttrainer-mobile/
├── app/              # Expo Router pages
├── components/       # Reusable components
├── lib/             # Utilities and API clients
│   ├── api.ts       # API client
│   ├── supabase.ts  # Supabase client
│   └── types.ts     # TypeScript types
├── constants/       # App constants
├── assets/          # Images, fonts, etc.
└── .env             # Environment variables
```

## 🔧 Development

### Code Style

This project uses:
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode

Run checks:
```bash
npm run lint
npm run type-check
```

### Testing

```bash
npm test           # Run tests
npm run test:watch # Watch mode
```

## 🚢 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## 🔗 Related Projects

- [AnalystTrainer Web](https://github.com/sofian-ysf/analystqbank) - Main web application
- [AnalystTrainer API](https://www.analysttrainer.com/api) - Backend API

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or access, contact the development team.

---

**Need help?** Open an issue or contact support at support@analysttrainer.com
