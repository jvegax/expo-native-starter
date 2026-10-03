import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { AppDrawerContent } from '@/screens/navigation/drawer/app-drawer-content';
import { Icon } from '@/shared/ui/icon/icon';

/**
 * Side drawer around the tabs. Every drawer screen draws its own native Stack header, so the
 * drawer's JS header stays off (otherwise there would be two headers).
 * - drawerType 'front': the drawer slides over the content; 'slide' would also move the native tab bar.
 * - Swipe-to-open on Android only: on iOS the left-edge swipe means "back", so the drawer opens
 *   from the header menu button (HeaderMenuButton).
 */
export function AppDrawerLayout() {
  const { t } = useTranslation();

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'front', swipeEnabled: Platform.OS === 'android' }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: t('navigation.home'),
          drawerIcon: ({ color, size }) => <Icon ios="house" android="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: t('navigation.settings'),
          drawerIcon: ({ color, size }) => <Icon ios="gearshape" android="settings" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
