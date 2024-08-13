#!/usr/bin/env bash
npm i --prefix ./tmp/font  @infomaniak/font-suisse@https://verdaccio.dev.infomaniak.ch/@infomaniak/font-suisse/-/font-suisse-1.0.0.tgz
cp tmp/font/node_modules/@infomaniak/font-suisse/*.ttf ./assets/fonts/
rm -rf tmp