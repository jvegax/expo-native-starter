import { useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable } from 'react-native';

import { createStyles } from '@/screens/navigation/section/header-menu-button.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { Icon } from '@/shared/ui/icon/icon';

const isAndroid = Platform.OS === 'android';

/** Opens the drawer. The action bubbles up from the section stack to the nearest drawer. */
export function HeaderMenuButton() {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('navigation.openMenu')}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      // Android: borderless ripple like a Material icon button. iOS: dimmed while pressed.
      android_ripple={{ color: theme.colors.ripple, borderless: true }}
      style={isAndroid ? styles.button : ({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon ios="line.3.horizontal" android="menu" color={theme.colors.text} />
    </Pressable>
  );
}
