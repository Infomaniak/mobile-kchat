#!/usr/bin/env bash
npm i --prefix ./tmp/font  @infomaniak/font-suisse@https://verdaccio.dev.infomaniak.ch/@infomaniak/font-suisse/-/font-suisse-1.0.0.tgz
git clone git@github.com:Infomaniak/mobile-private.git tmp/mobile-private
cp tmp/mobile-private/fonts/* ./assets/fonts
rm -rf tmp