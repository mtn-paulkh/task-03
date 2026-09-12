import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const title = shopify.settings.value.title ?? 'Default title';

  return (
    <s-box padding="base">
      <s-heading>{title}</s-heading>
    </s-box>
  );
}
