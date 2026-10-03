import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useSignUpMutation } from '@/features/auth/mutations/session/sign-up.mutation';
import type { SignUpInput } from '@/features/auth/types/session/session.types';
import {
  authErrorCode,
  type CredentialErrors,
  PASSWORD_MIN_LENGTH,
  validateSignUp,
} from '@/features/auth/utils/session/validate-credentials';
import { AuthFormScroll } from '@/screens/auth/session/auth-form-scroll';
import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';
import { TextField } from '@/shared/ui/text-field/text-field';

export function SignUpScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation(['auth', 'common']);
  const signUp = useSignUpMutation();
  const [form, setForm] = useState<SignUpInput>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<CredentialErrors<SignUpInput>>({});

  const fieldError = (field: keyof SignUpInput) => {
    const key = errors[field];
    return key ? t(`validation.${key}`, { count: PASSWORD_MIN_LENGTH }) : null;
  };

  const submit = () => {
    const invalid = validateSignUp(form);
    setErrors(invalid ?? {});
    if (!invalid) signUp.mutate(form);
  };

  const errorCode = signUp.isError ? authErrorCode(signUp.error) : null;

  return (
    <AuthFormScroll>
      <Stack.Screen options={{ title: t('signUp.title') }} />
      <Text color="textMuted">{t('signUp.subtitle')}</Text>
      <View style={styles.fields}>
        <TextField
          label={t('fields.name')}
          value={form.name}
          onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
          error={fieldError('name')}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
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
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>
      {signUp.isError ? (
        <Text color="danger" align="center">
          {errorCode ? t(`errors.${errorCode}`) : t('common:errors.generic')}
        </Text>
      ) : null}
      <Button label={t('signUp.submit')} loading={signUp.isPending} onPress={submit} />
      <View style={styles.footer}>
        <Text color="textMuted">{t('signUp.haveAccount')}</Text>
        <Button label={t('signUp.goToSignIn')} variant="ghost" size="sm" onPress={() => router.back()} />
      </View>
    </AuthFormScroll>
  );
}
