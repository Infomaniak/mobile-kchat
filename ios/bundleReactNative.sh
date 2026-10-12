#!/bin/sh

[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh

export NODE_OPTIONS=--max_old_space_size=12000
export BUNDLE_COMMAND="bundle"
export ENTRY_FILE="index.tsx"

set -e
WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"
SENTRY_XCODE="../node_modules/@sentry/react-native/scripts/sentry-xcode.sh"

if [[ "${SENTRY_ENABLED}" = "true" ]]; then
	echo "Sentry native integration is enabled"
	chmod +x $SENTRY_XCODE

	export SENTRY_PROPERTIES=sentry.properties
	BUILD_START=$(date +%s)
	/bin/sh -c "$WITH_ENVIRONMENT $SENTRY_XCODE" || {
		BUNDLE_PATH="${CONFIGURATION_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/main.jsbundle"
		if [[ -s "$BUNDLE_PATH" && $(stat -f %m "$BUNDLE_PATH") -ge $BUILD_START ]]; then
			echo "WARNING: Sentry upload failed but the JS bundle was produced, continuing build"
		else
			echo "ERROR: Sentry integration failed and no JS bundle was produced"
			exit 1
		fi
	}
else
	echo "Sentry native integration is not enabled"
	/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
fi
