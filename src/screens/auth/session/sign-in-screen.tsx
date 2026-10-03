import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useSignInMutation } from '@/features/auth/mutations/session/sign-in.mutation';
import type { SignInInput } from '@/features/auth/types/session/session.types';
import {
  authErrorCode,
  type CredentialErrors,
  PASSWORD_MIN_LENGTH,
  validateSignIn,
} from '@/features/auth/utils/session/validate-credentials';
import { AuthFormScroll } from '@/screens/auth/session/auth-form-scroll';
import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { markScreenInteractive } from '@/shared/lib/perf/startup-metrics';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';
import { TextField } from '@/shared/ui/text-field/text-field';

export function SignInScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation(['auth', 'common']);
  const signIn = useSignInMutation();
  const [form, setForm] = useState<SignInInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<CredentialErrors<SignInInput>>({});

  // First screen after a signed-out launch: its first commit is the app's time to interactive.
  useEffect(() => {
    markScreenInteractive('sign-in');
  }, []);

  const fieldError = (field: keyof SignInInput) => {
    const key = errors[field];
    return key ? t(`validation.${key}`, { count: PASSWORD_MIN_LENGTH }) : null;
  };

  const submit = () => {
    const invalid = validateSignIn(form);
    setErrors(invalid ?? {});
    // On success the session store flips the root guard; the navigator leaves this screen by itself.
    if (!invalid) signIn.mutate(form);
  };

  const errorCode = signIn.isError ? authErrorCode(signIn.error) : null;

  return (
    <AuthFormScroll>
      <Stack.Screen options={{ title: t('signIn.title') }} />
      <Text color="textMuted">{t('signIn.subtitle')}</Text>
      <View style={styles.fields}>
        <TextField
          label={t('fields.email')}
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          error={fieldError('email')}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <TextField
          label={t('fields.password')}
          value={form.password}
          onChangeText={(password) => setForm((prev) => ({ ...prev, password }))}
          error={fieldError('password')}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
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
