# Smart Receipt Scanner & Expense Tracker

A modern, offline-first React Native (Expo) app designed to effortlessly track expenses. Users can manually log their transactions or utilize the built-in AI scanner to automatically extract total amounts from physical receipts using the device's native camera.

## ✨ Features
- **Offline First**: All expenses are stored instantly on the device using `react-native-mmkv` v4 (with Nitro Modules) and `zustand`. No loading spinners, no waiting.
- **Smart Scanner**: Integrated with `react-native-vision-camera`, users can point their camera at a receipt and smoothly transition into auto-filled entry flows.
- **Analytics Visualizer**: Beautiful pie charts using `react-native-chart-kit` providing categorical spending insights and percentage breakdowns.
- **Premium UI & UX**: Styled via `NativeWind v4` (Tailwind CSS) and `expo-linear-gradient`. Includes micro-interactions like haptic feedback (`expo-haptics`), dynamic category chips, and native blur overlays (`expo-blur`).

## 🛠 Tech Stack
- **Framework**: React Native with Expo SDK 52+
- **Routing**: Expo Router (File-based navigation)
- **State**: Zustand
- **Storage**: `react-native-mmkv` v4 & `react-native-nitro-modules`
- **Styling**: NativeWind (Tailwind CSS v3/v4), `react-native-safe-area-context`
- **Visuals**: `react-native-chart-kit`, `expo-linear-gradient`, `expo-blur`, Expo Haptics
- **Camera**: `react-native-vision-camera`

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- iOS Simulator or an Android Emulator (Or physical device with an Expo Development Build)

### Setup Instructions
1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo servers:
   ```bash
   npx expo start -c
   ```
4. For the Camera integration & Nitro Modules, you must run the project in a **Development Build** instead of standard Expo Go (due to custom native code). Run:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

## 🏗 Architecture Decisions
I opted for **Zustand + MMKV v4** over standard Redux + AsyncStorage. MMKV's C++ bindings bypass the asynchronous bridge entirely, giving the app 0ms read/write latency, meaning the UI never blocks. NativeWind was chosen for styling to align with modern web design tokens ensuring a perfectly cohesive 60fps design system. The UI utilizes `react-native-safe-area-context` for edge-to-edge rendering without deprecation warnings.
