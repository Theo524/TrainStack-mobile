# Command Fit Mobile

A phone-first workout and personal command centre app.

The app starts as a workout logger with rest timers, session notes, and future modules built into the structure. It is made with Expo and React Native so it can run on Android, iOS, and web from one codebase.

## Run On Your Phone

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run start
```

Then install **Expo Go** on your phone and scan the QR code from the terminal/browser.

## Build An Android APK

Install EAS CLI:

```bash
npm install -g eas-cli
```

Log in:

```bash
eas login
```

Build an APK:

```bash
eas build -p android --profile preview
```

The `preview` profile in `eas.json` is configured to produce an APK for direct Android installation.

## Push To GitHub

```bash
git init
git add .
git commit -m "Initial Command Fit mobile app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Next Features

- Save workouts locally
- Exercise templates
- Better rest timer flows
- Weekly progress dashboard
- AI coach module
- Website/release monitoring module
