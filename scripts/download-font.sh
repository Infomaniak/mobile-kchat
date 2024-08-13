#!/usr/bin/env bash
npm i --prefix ./tmp/font  @infomaniak/font-suisse@https://verdaccio.dev.infomaniak.ch/@infomaniak/font-suisse/-/font-suisse-1.0.0.tgz
cp tmp/font/node_modules/@infomaniak/font-suisse/SuisseIntl-Medium.ttf ./assets/fonts/SuisseIntl-SemiBold.ttf
cp tmp/font/node_modules/@infomaniak/font-suisse/SuisseIntl-Regular.ttf ./assets/fonts/
# RegularItalic file is missing
rm -rf tmp