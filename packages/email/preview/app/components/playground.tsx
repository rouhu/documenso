import { SUPPORTED_LANGUAGE_CODES } from '@documenso/lib/constants/locales';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import type { FieldConfig } from '../lib/templates';
import { templates } from '../lib/templates';
import { viewports } from '../lib/viewports';
import { PropFields } from './prop-fields';

// ...rest unchanged
const GROUP_ORDER = ['Documents', 'Recipients', 'Organisations', 'Teams', 'Account', 'Admin'] as const;

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  'pt-BR': 'Portuguese (Brazil)',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
};

const DEFAULT_COLORS = {
  primary: '#a2e771',
  primaryForeground: '#162c07',
  background: '#ffffff',
  foreground: '#0f172a',
};
