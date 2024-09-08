#!/bin/sh

source ~/.zshrc
nvm use

# Clean
npm run clean --force
rm -rf node_modules

# Install
cd fastlane
bundle install
cd ..
npx jetify
npm ci --ignore-scripts
node node_modules/\@sentry/cli/scripts/install.js
npx patch-package
node ./scripts/generate-assets.js
cp "node_modules/@mattermost/compass-icons/font/compass-icons.ttf" "assets/fonts/"
npm run font-download

# Build
cd fastlane
SENTRY_ENABLED=false bundle exec fastlane android build --env android.pr