#!/bin/sh

if [[ "${SENTRY_ENABLED}" = "true" ]]; then
	echo "Uploading debugging symbols to Sentry"

	export SENTRY_PROPERTIES=sentry.properties
	../node_modules/@sentry/cli/bin/sentry-cli upload-dif --wait "$DWARF_DSYM_FOLDER_PATH" \
    || echo "WARNING: dSYM upload to Sentry failed, continuing build"

else
	echo "Not uploading debugging symbols to Sentry because Sentry is disabled"
fi
