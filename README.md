# amp-contextnode-devtools

A DevTools extension to inspect AMP context nodes.

## Install

### 1. Prepare the extension key

See either [this answer](https://stackoverflow.com/questions/37317779/making-a-unique-extension-id-and-key-for-chrome-extension) or go/dev-crx.

### 2. Create the local package:

```sh
yarn build
```

### 3. Load the extension in Chrome:

1. Go to [chrome://extensions/](chrome://extensions/).
2. Click "Load unpacked extension".
3. Select `amp-contextnode-devtools/dist` dir.

## Use

1. Open an AMP page.
2. Inspect an element.
3. In the element's sidebar select "AMP Context Inspector" tab.

## Known issues

1. The inspector panel doesn't always refresh. Reselect the element to see the up-to-date data.
