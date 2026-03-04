---
description: How to set up and fix the Android build for the Chronos Capacitor app
---

# Android Build Setup for Chronos

## Problem
The Chronos app uses Vite + Capacitor. The Vite config has `base: '/Chronos_App/'` for GitHub Pages deployment, but this breaks the Android app because Capacitor's WebView serves assets from the local filesystem — it can't resolve paths prefixed with `/Chronos_App/`. The result is a blank white screen when opening the app on Android.

## Changes Required

### 1. `vite.config.js` — Conditional base path

Make the `base` option conditional so it uses `./` (relative) for Android builds and `/Chronos_App/` for GitHub Pages:

```js
export default defineConfig(({ command }) => ({
  base: process.env.CAPACITOR_BUILD ? './' : '/Chronos_App/',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
}))
```

Key points:
- When `CAPACITOR_BUILD` env var is set to `"true"`, base becomes `./` (works in Android WebView)
- Otherwise, base stays `/Chronos_App/` (works for GitHub Pages at elsadonnat.github.io/Chronos_App/)
- The `defineConfig` call changes from taking an object to taking a function that returns an object: `defineConfig(({ command }) => ({ ... }))`

### 2. `package.json` — Updated npm scripts

Add a `cap:build` script and update `cap:sync` and `release` to use it:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "cap:build": "set CAPACITOR_BUILD=true && npm run build",
  "cap:sync": "npm run cap:build && npx cap sync",
  "cap:open": "npx cap open android",
  "release": "npm run lint && npm run cap:build && npx cap sync"
}
```

- `cap:build` sets the env var and runs vite build with relative paths
- `cap:sync` uses `cap:build` instead of plain `build`
- `release` uses `cap:build` instead of plain `build`
- Plain `build` is unchanged and still builds for GitHub Pages

### 3. Building the Android APK

The JDK bundled with Android Studio is at `C:\Program Files\Android\Android Studio\jbr`. To build:

```powershell
# Set JAVA_HOME to Android Studio's bundled JDK
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Build the release APK
cd android
.\gradlew assembleRelease
cd ..
```

The APK output is at: `android\app\build\outputs\apk\release\app-release.apk`

## Full Deploy Workflow

```powershell
npm run cap:sync                    # Build for Android + sync web assets
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
cd android; .\gradlew assembleRelease; cd ..   # Build APK
# Test on phone via Android Studio Run button
npm run build                       # Rebuild for GitHub Pages (optional, CI rebuilds anyway)
git add -A
git commit -m "your message"
git push origin main                # GitHub Actions auto-deploys to Pages
```
