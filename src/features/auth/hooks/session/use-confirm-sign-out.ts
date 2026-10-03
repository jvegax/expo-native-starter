import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useSignOutMutation } from '@/features/auth/mutations/session/sign-out.mutation';

/** Native confirmation (UIAlertController / Material dialog) before signing out. */
export function useConfirmSignOut() {
  const { t } = useTranslation(['auth', 'common']);
  const signOut = useSignOutMutation();

  return () =>
    Alert.alert(t('signOut.confirmTitle'), t('signOut.confirmMessage'), [
      { text: t('common:actions.cancel'), style: 'cancel' },
      { text: t('signOut.confirm'), style: 'destructive', onPress: () => signOut.mutate() },
    ]);
}
