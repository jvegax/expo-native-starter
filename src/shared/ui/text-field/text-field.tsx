import type { Ref } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { createStyles } from '@/shared/ui/text-field/text-field.styles';
import { Text } from '@/shared/ui/text/text';

/** Imperative handle (focus, blur, isFocused). The only way to reference the native input. */
export type TextFieldHandle = TextInput;

// No `value`: a controlled input echoes every keystroke from JS back to the native field, which
// drops, duplicates or moves characters when typing fast (forms-keyboard skill).
export type TextFieldProps = Omit<TextInputProps, 'style' | 'value'> & {
  label: string;
  /** Shown under the input and colours its border; pass a translated message. */
  error?: string | null;
  ref?: Ref<TextFieldHandle>;
};

/**
 * Labelled native text input with an inline error. Uncontrolled: the native field owns the text.
 * Pass a constant `defaultValue` and read the text with `onChangeText`; forms spread
 * `field(name)` from useUncontrolledForm (@/shared/hooks/use-uncontrolled-form).
 */
export function TextField({ label, error, ref, ...rest }: TextFieldProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="label" color="textMuted">
        {label}
      </Text>
      <TextInput
        ref={ref}
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
