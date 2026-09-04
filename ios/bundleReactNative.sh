#!/bin/sh

[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh

export NODE_OPTIONS=--max_old_space_size=12000
export BUNDLE_COMMAND="bundle"
export ENTRY_FILE="index.ts"

if [[ "${SENTRY_ENABLED}" = "true" ]]; then
	echo "Sentry native integration is enabled"

	export SENTRY_PROPERTIES=sentry.properties
	export SENTRY_FORCE_FOREGROUND=true
	../node_modules/@sentry/cli/bin/sentry-cli react-native xcode \
    ../node_modules/react-native/scripts/react-native-xcode.sh \
    || {
		BUNDLE_PATH="${CONFIGURATION_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/main.jsbundle"
		if [[ -s "$BUNDLE_PATH" ]]; then
			echo "WARNING: Sentry upload failed but the JS bundle was produced, continuing build"
		else
			echo "ERROR: Sentry integration failed and no JS bundle was produced"
			exit 1
		fi
	}
else
	echo "Sentry native integration is not enabled"
	../node_modules/react-native/scripts/react-native-xcode.sh
fi
