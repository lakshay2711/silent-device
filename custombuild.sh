#!/bin/sh
ng build silentDevice --prod --output-hashing=none && cat dist/silentDevice/runtime-es5.js dist/silentDevice/polyfills-es5.js dist/silentDevice/scripts.js dist/silentDevice/main-es5.js dist/silentDevice/styles-es2015.js > preview/mpsSilentDevices.js