import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/components/home/home/welcome-card/welcome-card.styles';
import { appConfig } from '@/config/app';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';

export type WelcomeCardProps = {
  onBrowseClubs: () => void;
};

export function WelcomeCard({ onBrowseClubs }: WelcomeCardProps) {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('home');

  return (
    <View style={styles.card}>
      <Text variant="title">{t('welcome.title', { appName: appConfig.name })}</Text>
      <Text color="textMuted">{t('welcome.subtitle')}</Text>
      <Button label={t('welcome.cta')} onPress={onBrowseClubs} />
    </View>
  );
}
