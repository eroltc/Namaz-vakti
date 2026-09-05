# Play Store upload pack — Rabbin için

Package: `app.miqat.namaz`  
Version: **1.2.1** (versionCode **5**)

## Contents

| File | Purpose |
|------|---------|
| `rabbin-icin.aab` | Signed Play App Bundle (upload this) |
| `PLAY_STORE_LISTING.md` | Name, short/full descriptions TR+EN, category, keywords, content rating, what's new |
| `privacy-policy.html` | Hostable privacy policy (TR+EN) — put on GitHub Pages or any HTTPS URL |
| `PLAY_SIGNING_CREDENTIALS.txt` | **SECRET** keystore passwords — back up offline; never commit |
| `play-screenshots/` | Phone-sized TR UI screenshots |
| `README_PLAY.md` | This file |

Also available next to the zip (not always inside): `rabbin-icin-release.apk` for sideload testing, `rabbin-icin-release.keystore`, `keystore.properties`.

## Steps to publish

1. **Create a Play Console account**  
   Go to [Google Play Console](https://play.google.com/console), pay the one-time registration fee, complete identity verification.

2. **Create the app**  
   Create app → name **Rabbin için** → default language Turkish (or English) → App / Free → declare policies as required.  
   Package name must match: **`app.miqat.namaz`**.

3. **Upload the AAB**  
   Release → Production (or Internal testing first) → Create release → upload `rabbin-icin.aab`.  
   Use Play App Signing (recommended). Keep your upload keystore (`rabbin-icin-release.keystore` + credentials) backed up forever.

4. **Fill the store listing**  
   Copy text from `PLAY_STORE_LISTING.md` (short/full descriptions, what's new).  
   Upload screenshots from `play-screenshots/` (phone). Add icon / feature graphic as needed.

5. **Privacy policy URL**  
   Host `privacy-policy.html` (e.g. GitHub Pages, raw.githubusercontent.com via a Pages site, or your domain).  
   Paste the **HTTPS** URL into Play Console → App content → Privacy policy.

6. **Complete questionnaires**  
   Content rating, Data safety (location for prayer/Qibla, local notifications; no account; data on device), Target audience, News apps, etc.

7. **Submit for review**  
   Fix any Console warnings, then send the release for review.

## Secrets warning

- **Do NOT** commit `*.keystore`, `keystore.properties`, or `PLAY_SIGNING_CREDENTIALS.txt` to GitHub.
- Losing the upload keystore (or passwords) blocks updates unless you use Play App Signing reset flows.
- The credentials file in this pack is highly sensitive — store it in a password manager / encrypted backup only.

## Rebuild notes (optional)

Signing is configured via `/workspace/keystore.properties` (gitignored) referenced from `android/app/build.gradle`.

```bash
cd namaz-vakti/android
./gradlew bundleRelease assembleRelease
```

Outputs: `app/build/outputs/bundle/release/app-release.aab` and `.../apk/release/app-release.apk`.
