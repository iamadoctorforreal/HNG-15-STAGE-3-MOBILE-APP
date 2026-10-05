# Sawfy White Enterprises — Mobile E-Commerce Application 🐟📱

> High-performance Android mobile application for **Sawfy White Enterprises** (`shop.sawfywhite.com`), built with **React Native**, **Expo SDK**, **TypeScript**, and **Supabase**.

---

## 🌟 Overview & Key Requirements

1. **Shared Unified Authentication**:
   - Web application and mobile app share the **exact same Supabase authentication pool**.
   - Users can register on the web and immediately log in on mobile with the same credentials (and vice versa).
2. **Instant Real-Time Bi-Directional Cart Synchronization**:
   - **Web → Mobile**: Items added, modified, or removed on the web storefront (`shop.sawfywhite.com`) instantly update in the mobile app cart.
   - **Mobile → Web**: Items added, modified, or removed inside the mobile app instantly reflect in the web storefront cart.
   - Backed by the shared Supabase PostgreSQL `carts` and `cart_items` tables, live REST `/api/cart` routes, and Supabase Realtime channel listeners (`postgres_changes` on `cart_items`).
3. **Physical Phone Verification**:
   - Engineered and optimized for physical Android smartphone testing and smooth APK distribution.

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 57)
- **Language**: TypeScript (`^5.x` / `~6.x`)
- **Database & Auth**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **State & Storage**: React Context + `@react-native-async-storage/async-storage`
- **Web Storefront Backend**: Next.js 15 App Router (`https://shop.sawfywhite.com`)
- **Branding**: Abeokuta Heritage Palette (Forest Green `#008751`, Royal Gold `#D4A843`, Warm Cream `#FAF8F5`)

---

## 📂 Project Structure

```
sawfy-white-mobile/
├── assets/                     # App icon, splash screen, and adaptive icons
├── src/
│   ├── components/
│   │   └── Header.tsx          # Branded Abeokuta crest & status header
│   ├── context/
│   │   ├── AuthContext.tsx     # Unified Supabase Auth session provider
│   │   └── CartContext.tsx     # Real-time bi-directional cart sync engine
│   ├── lib/
│   │   ├── constants.ts        # 10 Curated products catalog, brand colors, API URL
│   │   └── supabase.ts         # Supabase client with AsyncStorage session persistence
│   └── screens/
│       ├── AuthScreen.tsx      # Login, registration, and user profile
│       ├── CartScreen.tsx      # Live synced cart with quantity modifiers & sync badge
│       └── ProductsScreen.tsx  # 10 Curated dried catfish selections with instant add
├── App.tsx                     # Main navigation shell with live cart badge
├── app.json                    # Expo project configuration & package definitions
├── package.json
└── tsconfig.json
```

---

## 🚀 Running the App Locally

### Prerequisites
- Node.js (v18+)
- Android device or Android Studio emulator
- Expo Go app on Android phone (optional, for rapid local preview)

### Setup & Run
```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on connected Android device / emulator
npm run android
```

---

## 📦 Building Standalone Release APK

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure & build preview release APK for Android
eas build -p android --profile preview
```

---

## 📹 Video Demonstration Guide (Single Continuous Take)

For submission, record a single continuous video with zero cuts demonstrating:
1. **Step 1**: Open the web application (`shop.sawfywhite.com`) and register/sign in with a new account. Show successful logged-in state.
2. **Step 2**: Add a dried catfish product to the cart on the web application. Show the item in the web cart.
3. **Step 3**: Open the mobile application on your phone or screen. Log in to the mobile application using the exact same account credentials.
4. **Step 4**: Show that the product added from the website is visible in the mobile application's cart.
5. **Step 5**: Add another dried catfish product to the cart from inside the mobile application.
6. **Step 6**: Return to the web application and demonstrate that the product added from the mobile application is now also visible in the web application's cart.

---

## 📄 Repository & Submission Information

- **Repository**: [https://github.com/iamadoctorforreal/HNG-15-STAGE-3-MOBILE-APP.git](https://github.com/iamadoctorforreal/HNG-15-STAGE-3-MOBILE-APP.git)
- **Live Web Storefront**: [https://shop.sawfywhite.com](https://shop.sawfywhite.com)
- **Parent Organization**: Sawfy White Enterprises, Abeokuta, Ogun State, Nigeria 🇳🇬
