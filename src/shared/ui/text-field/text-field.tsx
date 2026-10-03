import { TextInput, type TextInputProps, View } from 'react-native';

import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { createStyles } from '@/shared/ui/text-field/text-field.styles';
import { Text } from '@/shared/ui/text/text';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Shown under the input and colours its border; pass a translated message. */
  error?: string | null;
};

/** Labelled native text input with an inline error. Form state stays in the screen. */
export function TextField({ label, error, ...rest }: TextFieldProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="label" color="textMuted">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        selectionColor={theme.colors.primary}
        cursorColor={theme.colors.primary}
        style={[styles.input, error ? styles.inputError : null]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
