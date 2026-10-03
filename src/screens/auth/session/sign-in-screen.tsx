import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useSignInMutation } from '@/features/auth/mutations/session/sign-in.mutation';
import type { SignInInput } from '@/features/auth/types/session/session.types';
import {
  authErrorCode,
  normalizeSignIn,
  PASSWORD_MIN_LENGTH,
  validateSignIn,
} from '@/features/auth/utils/session/validate-credentials';
import { AuthFormScroll } from '@/screens/auth/session/auth-form-scroll';
import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { useUncontrolledForm } from '@/shared/hooks/use-uncontrolled-form';
import { markScreenInteractive } from '@/shared/lib/perf/startup-metrics';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';
import { TextField } from '@/shared/ui/text-field/text-field';

// Key order is the field order: an invalid submit focuses the first failing field.
const INITIAL_VALUES: SignInInput = { email: '', password: '' };

export function SignInScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation(['auth', 'common']);
  const signIn = useSignInMutation();
  // On success the session store flips the root guard; the navigator leaves this screen by itself.
  const { field, errors, submit } = useUncontrolledForm({
    initialValues: INITIAL_VALUES,
    validate: validateSignIn,
    onSubmit: (input) => signIn.mutate(normalizeSignIn(input)),
    isSubmitting: signIn.isPending,
  });

  // First screen after a signed-out launch: its first commit is the app's time to interactive.
  useEffect(() => {
    markScreenInteractive('sign-in');
  }, []);

  const fieldError = (name: keyof SignInInput) => {
    const key = errors[name];
    return key ? t(`validation.${key}`, { count: PASSWORD_MIN_LENGTH }) : null;
  };

  const errorCode = signIn.isError ? authErrorCode(signIn.error) : null;

  return (
    <AuthFormScroll>
      <Stack.Screen options={{ title: t('signIn.title') }} />
      <Text color="textMuted">{t('signIn.subtitle')}</Text>
      <View style={styles.fields}>
        <TextField
          label={t('fields.email')}
          {...field('email', { next: 'password' })}
          error={fieldError('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="username"
        />
        <TextField
          label={t('fields.password')}
          {...field('password')}
          error={fieldError('password')}
          secureTextEntry
          autoComplete="current-password"
        />
      </View>
      {signIn.isError ? (
        <Text color="danger" align="center">
          {errorCode ? t(`errors.${errorCode}`) : t('common:errors.generic')}
        </Text>
      ) : null}
      <Button label={t('signIn.submit')} loading={signIn.isPending} onPress={submit} />
      <View style={styles.footer}>
        <Text color="textMuted">{t('signIn.noAccount')}</Text>
        <Button label={t('signIn.goToSignUp')} variant="ghost" size="sm" onPress={() => router.push('/sign-up')} />
      </View>
    </AuthFormScroll>
  );
}
