import { useSettings } from '@shopify/ui-extensions/checkout/preact';
import { resolveExtensionSettings } from '../pure-model/extension-settings';

export function useExtensionSettings() {
  const settings = useSettings();
  return resolveExtensionSettings(settings);
}
