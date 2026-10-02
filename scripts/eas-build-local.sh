#!/usr/bin/env sh
# Runs an EAS build on this machine instead of on expo.dev and drops the artifact in build/.
#
#   bun run build:local <profile> [android|ios]
#   bun run build:local dev-android           -> build/dev-android.apk
#   bun run build:local dev-ios               -> build/dev-ios.ipa (needs Xcode, fastlane, CocoaPods)
#   bun run build:local preview android       -> build/preview-android.apk
#   bun run build:local production android    -> build/production-android.aab
#
# Profiles come from eas.json; dev-* profiles imply their platform. Local builds still need `eas login`
# (or EXPO_TOKEN) for credentials, build one platform at a time, and ignore the `node` pinned in eas.json.
set -eu

profile="${1:-}"
platform="${2:-}"

case "$profile" in
  dev-android) platform="${platform:-android}" ;;
  dev-ios) platform="${platform:-ios}" ;;
esac

if [ -z "$profile" ] || [ -z "$platform" ]; then
  echo "usage: $0 <profile> [android|ios]   (platform required unless profile is dev-android or dev-ios)" >&2
  exit 1
fi

case "$platform" in
  android)
    if [ "$profile" = "production" ]; then extension="aab"; else extension="apk"; fi
    output="build/${profile}-${platform}.${extension}"
    ;;
  ios)
    extension="ipa"
    output="build/${profile}-${platform}.${extension}"
    ;;
  *)
    echo "platform must be android or ios" >&2
    exit 1
    ;;
esac

case "$profile" in
  dev-*) output="build/${profile}.${extension}" ;;
esac

mkdir -p build
exec bunx eas-cli build --local --profile "$profile" --platform "$platform" --output "$output"
