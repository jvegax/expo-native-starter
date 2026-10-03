import { useRef, useState } from 'react';
import { Keyboard } from 'react-native';

import type { TextFieldHandle, TextFieldProps } from '@/shared/ui/text-field/text-field';

/** Per-field error keys (or messages); a missing field is valid. */
export type FormErrors<T, E extends string = string> = Partial<Record<keyof T, E>>;

type FieldProps = Pick<
  TextFieldProps,
  'ref' | 'defaultValue' | 'onChangeText' | 'returnKeyType' | 'submitBehavior' | 'onSubmitEditing'
>;

type UncontrolledFormOptions<T, E extends string> = {
  /** Read once at mount. Key order is the visual field order: it decides which invalid field gets focus. */
  initialValues: T;
  /** Errors for the fields that fail, or null when the form is valid. */
  validate: (values: T) => FormErrors<T, E> | null;
  /** Receives the raw text as typed; normalise (trim, lowercase) here, never while typing. */
  onSubmit: (values: T) => void;
  /** While true, submit is ignored (the return key can fire it again during a pending request). */
  isSubmitting?: boolean;
};

/**
 * Read-on-submit form over uncontrolled <TextField>s. The text lives in the native inputs and in a
 * ref: typing never re-renders the screen and JS never writes text back to native, so fast typing,
 * autocorrect and IME composition behave natively. Only errors are React state.
 *
 * Spread `field(name, { next })` on each TextField: `next` chains the return key to the following
 * field without closing the keyboard; the last field submits. field() owns ref, onChangeText and
 * onSubmitEditing: to also react to the text, wrap its onChangeText instead of replacing it. To reset
 * or prefill, remount the form component with a `key` (this hook resets with it); never pass `value`
 * or call `clear()` on a field.
 */
export function useUncontrolledForm<T extends Record<string, string>, E extends string>({
  initialValues,
  validate,
  onSubmit,
  isSubmitting = false,
}: UncontrolledFormOptions<T, E>) {
  // Frozen at mount: a defaultValue that changes later would overwrite what the user typed.
  const [initial] = useState(initialValues);
  const values = useRef<T>({ ...initial });
  const inputs = useRef<Partial<Record<keyof T, TextFieldHandle | null>>>({});
  const [errors, setErrors] = useState<FormErrors<T, E>>({});

  const submit = () => {
    if (isSubmitting) return;
    const snapshot = { ...values.current };
    const invalid = validate(snapshot);
    setErrors(invalid ?? {});
    if (invalid) {
      // Keep the keyboard up and move to the first field to fix.
      const first = (Object.keys(initial) as (keyof T)[]).find((name) => invalid[name]);
      if (first) inputs.current[first]?.focus();
      return;
    }
    Keyboard.dismiss();
    onSubmit(snapshot);
  };

  const field = (name: keyof T, options: { next?: keyof T } = {}): FieldProps => {
    const { next } = options;
    return {
      ref: (node) => {
        inputs.current[name] = node;
      },
      defaultValue: initial[name],
      onChangeText: (text) => {
        values.current[name] = text as T[keyof T];
        // Re-renders only on the first keystroke after a failed submit, to clear that field's error.
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
      },
      returnKeyType: next ? 'next' : 'go',
      // Never blur on return: blurring between fields closes and reopens the keyboard.
      submitBehavior: 'submit',
      onSubmitEditing: next ? () => inputs.current[next]?.focus() : submit,
    };
  };

  const focus = (name: keyof T) => inputs.current[name]?.focus();

  return { field, errors, submit, focus };
}
