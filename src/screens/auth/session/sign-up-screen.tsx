import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useSignUpMutation } from '@/features/auth/mutations/session/sign-up.mutation';
import type { SignUpInput } from '@/features/auth/types/session/session.types';
import {
  authErrorCode,
  normalizeSignUp,
  PASSWORD_MIN_LENGTH,
  validateSignUp,
} from '@/features/auth/utils/session/validate-credentials';
import { AuthFormScroll } from '@/screens/auth/session/auth-form-scroll';
import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { useUncontrolledForm } from '@/shared/hooks/use-uncontrolled-form';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';
import { TextField } from '@/shared/ui/text-field/text-field';

// Key order is the field order: an invalid submit focuses the first failing field.
const INITIAL_VALUES: SignUpInput = { name: '', email: '', password: '' };

export function SignUpScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation(['auth', 'common']);
  const signUp = useSignUpMutation();
  const { field, errors, submit } = useUncontrolledForm({
    initialValues: INITIAL_VALUES,
    validate: validateSignUp,
    onSubmit: (input) => signUp.mutate(normalizeSignUp(input)),
    isSubmitting: signUp.isPending,
  });

  const fieldError = (name: keyof SignUpInput) => {
    const key = errors[name];
    return key ? t(`validation.${key}`, { count: PASSWORD_MIN_LENGTH }) : null;
  };

  const errorCode = signUp.isError ? authErrorCode(signUp.error) : null;

  return (
    <AuthFormScroll>
      <Stack.Screen options={{ title: t('signUp.title') }} />
      <Text color="textMuted">{t('signUp.subtitle')}</Text>
      <View style={styles.fields}>
        <TextField
          label={t('fields.name')}
          {...field('name', { next: 'email' })}
          error={fieldError('name')}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
        />
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
          autoComplete="new-password"
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
