import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { HttpError } from '@/shared/lib/http/errors';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { createStyles } from '@/shared/ui/async-state/async-state.styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';

export type AsyncStateProps = {
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  /** When true (and not pending/error) renders the empty state instead of children. */
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
};

function errorMessage(error: unknown, fallback: string, network: string): string {
  if (error instanceof HttpError) return error.kind === 'network' ? network : error.message;
  return fallback;
}

/** Wraps a query result: spinner, error with retry, empty state, or children. */
export function AsyncState({
  isPending,
  isError,
  error,
  isEmpty = false,
  emptyMessage,
  onRetry,
  children,
}: AsyncStateProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const { t } = useTranslation('common');

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text color="danger" align="center">
          {errorMessage(error, t('errors.generic'), t('errors.network'))}
        </Text>
        {onRetry ? <Button variant="secondary" size="sm" label={t('actions.retry')} onPress={onRetry} /> : null}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text color="textMuted" align="center">
          {emptyMessage ?? t('states.empty')}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
