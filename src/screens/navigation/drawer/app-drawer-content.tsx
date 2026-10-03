import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { UserSummary } from '@/components/account/user/user-summary/user-summary';
import { useConfirmSignOut } from '@/features/auth/hooks/session/use-confirm-sign-out';
import { createStyles } from '@/screens/navigation/drawer/app-drawer-content.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { Icon } from '@/shared/ui/icon/icon';

/** Drawer panel: who is signed in, the drawer routes, and sign out at the bottom. */
export function AppDrawerContent(props: DrawerContentComponentProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const confirmSignOut = useConfirmSignOut();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <UserSummary />
      </View>
      <DrawerItemList {...props} />
      <View style={styles.spacer} />
      <DrawerItem
        label={t('signOut.label')}
        onPress={confirmSignOut}
        inactiveTintColor={theme.colors.danger}
        pressColor={theme.colors.ripple}
        icon={({ color, size }) => (
          <Icon ios="rectangle.portrait.and.arrow.right" android="logout" color={color} size={size} />
        )}
      />
    </DrawerContentScrollView>
  );
}
