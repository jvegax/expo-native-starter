import { createContext } from 'react';

import type { Theme } from '@/shared/theme/theme.types';

// Provided by src/providers/theme-provider.tsx. Lives here so shared/ never imports providers/.
export const ThemeContext = createContext<Theme | null>(null);
