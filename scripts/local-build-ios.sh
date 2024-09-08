#!/bin/sh

source ~/.zshrc
nvm use

# Clean
rm -rf node_modules ~/Library/Developer/Xcode/DerivedData
npm run clean --force

# Install
npm ci --ignore-scripts
node node_modules/\@sentry/cli/scripts/install.js
npx patch-package
node ./scripts/generate-assets.js
cp "node_modules/@mattermost/compass-icons/font/compass-icons.ttf" "assets/fonts/"
npm run ios-gems
npm run pod-install
npm run font-download

# Build
cd fastlane
bundle exec fastlane ios simulator --env ios.simulator
# SENTRY_ENABLED=false bundle exec fastlane ios build --env ios.beta

# Launch on booted simulator
# unzip -q Mattermost-simulator-x86_64.app.zip
# xcrun simctl install booted ./kChat.app