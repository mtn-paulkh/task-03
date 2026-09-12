import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {Extension} from './compose/Checkout.jsx';

export default function extension() {
  render(<Extension />, document.body);
}
