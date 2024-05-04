# B-Event Ticket

<p>
  <!-- iOS -->
  <a href="https://itunes.apple.com/app/apple-store/id982107779">
    <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  </a>
  <!-- Android -->
  <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=blankexample">
    <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  </a>
  <!-- Web -->
  <a href="https://docs.expo.dev/workflow/web/">
    <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
  </a>
</p>

## 🚀 How to use

## How to run the iOS/Android Simulator on Mac/Windows

Step 1. **Install Xcode** from the Mac [App Store](https://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12) if you
are using Mac or **Android Studio** if you have Windows
OS [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)

Step 2. Install Node.js with [Homebrew](https://treehouse.github.io/installation-guides/mac/homebrew)

```bash
brew install node (if you are using Mas OS)
```

Step 2.1 Skip the previous step if you are using Windows and download directly
NodeJs [NodeJs for windows](https://nodejs.org/en/download/)

Step 3. Install React Native Expo. On your terminal run

```bash
npm install --global expo-cli
```

Step 4. Clone the repository. On your terminal run

```bash
git clone https://github.com/Gptimus/B-Ticket.git
```

Step 5,. Install NPM packages. On your terminal run

```bash
Access the containing project with the command `cd the folder name (B-Ticket)`. ; and run npm install
```

Step 5.1. Pre open the iOS simulator (Optional)

```
open -a Simulator.app
```

Step 6. Start the iOS demo. On your terminal run

```bash
npx ios
```

or

```bash
npx android
```

## 📝 Notes

- Don't forget to create an .env file in the root of the project.
  This file should contain two keys: BASE_URL and ASSET_BASE_URL.
  Below is an example of the .env file
