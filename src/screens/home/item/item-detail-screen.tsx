import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/screens/home/item/item-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { Button } from '@/shared/ui/button/button';
import { Icon } from '@/shared/ui/icon/icon';
import { ScrollScreen } from '@/shared/ui/scroll-screen/scroll-screen';
import { Text } from '@/shared/ui/text/text';

export type ItemDetailScreenProps = {
  id: string;
};

/** Mocked detail with no data: only shows how a pushed screen behaves (header, back gesture, stacking). */
export function ItemDetailScreen({ id }: ItemDetailScreenProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const { t } = useTranslation('home');
  const nextId = String(Number(id) + 1 || 1);

  return (
    <ScrollScreen>
      <Stack.Screen options={{ title: t('item.title', { id }) }} />
      <View style={styles.placeholder}>
        <Icon ios="square.stack.3d.up" android="stacks" size={theme.sizes.avatarMd} color={theme.colors.primary} />
        <Text color="textMuted" align="center">
          {t('item.body')}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          label={t('item.openNext', { id: nextId })}
          onPress={() => router.push({ pathname: '/details/[id]', params: { id: nextId } })}
        />
        <Button label={t('item.openSheet')} variant="secondary" onPress={() => router.push('/sheet')} />
      </View>
    </ScrollScreen>
  );
}
