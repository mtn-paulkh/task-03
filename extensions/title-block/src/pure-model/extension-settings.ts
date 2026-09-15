export const DEFAULT_TITLE = 'Default title';
export const DEFAULT_ADD_BUTTON = 'Add to cart';

export type ExtensionSettings = {
  title?: string;
  add_button?: string;
  variant?: string | number;
};

function textSetting(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function resolveExtensionSettings(
  settings: ExtensionSettings | undefined,
): { title: string; add_button: string; variant: string } {
  const raw = settings ?? {};
  return {
    title: textSetting(raw.title, DEFAULT_TITLE),
    add_button: textSetting(raw.add_button, DEFAULT_ADD_BUTTON),
    variant: raw.variant != null ? String(raw.variant).trim() : '',
  };
}
