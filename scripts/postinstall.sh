#!/usr/bin/env bash

function installPods() {
    echo "Getting Cocoapods dependencies"
    npm run pod-install
}

function installPodsM1() {
    echo "Getting Cocoapods dependencies"
    npm run pod-install-m1
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  if [[ $(uname -p) == 'arm' ]]; then
    installPodsM1
  else
    installPods
  fi
fi

COMPASS_ICONS="node_modules/@mattermost/compass-icons/font/compass-icons.ttf"
if [ -z "$COMPASS_ICONS" ]; then
    echo "Compass Icons font not found"
    exit 1
else
    echo "Configuring Compass Icons font"
    cp "$COMPASS_ICONS" "assets/fonts/"
    cp "$COMPASS_ICONS" "android/app/src/main/assets/fonts"
fi

ASSETS=$(node scripts/generate-assets.js)
if [ -z "$ASSETS" ]; then
    echo "Error Generating app assets"
    exit 1
else
    echo "Generating app assets"
fi

SOUNDS="assets/sounds"
if [ -z "$SOUNDS" ]; then
    echo "Sound assets not found"
    exit 1
else
    echo "Copying sound assets for bundling"
    mkdir -p "android/app/src/main/res/raw/"
    cp $SOUNDS/* "android/app/src/main/res/raw/"
fi

K_CHAT_SOUNDS="assets/base/sounds/"
K_TONE_WAV="${K_CHAT_SOUNDS}/kchat-ringtone.wav"
K_TONE_MP3="${K_CHAT_SOUNDS}/kchat-ringtone.mp3"
JITSI_MODULE="node_modules/@jitsi/react-native-sdk/sounds"
if [ -z "$K_CHAT_SOUNDS" ]; then
    echo "Sounds to override not found"
    exit 1
else
    echo "Overriding @jitsi/react-native-sdk sound assets for bundling"
    if [ -z "$JITSI_MODULE" ]; then
        echo "Jitsi module not found"
        exit 1
    else
        cp $K_TONE_WAV ${JITSI_MODULE}/ring.wav
        cp $K_TONE_MP3 ${JITSI_MODULE}/ring.mp3
    fi
fi
