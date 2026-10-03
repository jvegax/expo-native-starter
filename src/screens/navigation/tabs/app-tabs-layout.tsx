import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';
import { fontWeights } from '@/shared/theme/tokens/typography';
import { useTheme } from '@/shared/theme/use-theme';

/**
 * Android paints Material defaults (lavender surface, grey indicator) unless told otherwise, so the
 * bar gets the theme: surface background, primaryContainer pill behind the selected icon, primary
 * for the selected item and textMuted for the rest. iOS keeps the system bar untouched: a
 * backgroundColor there would replace Liquid Glass, and tintColor is all it needs.
 */
function androidTabBarStyle(theme: Theme) {
  if (Platform.OS !== 'android') return {};
  return {
    backgroundColor: theme.colors.surface,
    indicatorColor: theme.colors.primaryContainer,
    rippleColor: theme.colors.ripple,
    iconColor: { default: theme.colors.textMuted, selected: theme.colors.primary },
    labelStyle: {
      default: { color: theme.colors.textMuted, fontWeight: fontWeights.medium },
      selected: { color: theme.colors.primary, fontWeight: fontWeights.semibold },
    },
  };
}

/**
 * Platform tab bar (UITabBar with Liquid Glass on iOS 26, Material bottom navigation on Android).
 * - Each Trigger `name` must equal a folder in src/app/(app)/(drawer)/(tabs)/ (not type-checked).
 * - Only Triggers count: NativeTabs ignores any other child, so never wrap one in Stack.Protected;
 *   the auth gate lives in RootNavigator. Use `hidden` to hide a tab.
 * - At most 5 visible tabs on Android. Every tab mounts on start: defer heavy work with useIsFocused.
 * - No header here: every tab is its own Stack (SectionStackLayout).
 */
export function AppTabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.colors.primary} minimizeBehavior="onScrollDown" {...androidTabBarStyle(theme)}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>{t('navigation.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="clubs">
        <NativeTabs.Trigger.Label>{t('navigation.clubs')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person.3', selected: 'person.3.fill' }} md="groups" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{t('navigation.profile')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
