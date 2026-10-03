// Native autolinking overrides (read by Expo autolinking and React Native codegen).
module.exports = {
  dependencies: {
    // Android only: iOS keeps the native keyboard handling (forms-keyboard skill). Unlinking the pod
    // also stops its load-time UIResponder swizzling from running on iOS. Its JS is Android-only too
    // (*.android.tsx files), so nothing on iOS references it.
    'react-native-keyboard-controller': { platforms: { ios: null } },
  },
};
