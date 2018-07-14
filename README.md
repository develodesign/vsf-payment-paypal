# Vue Storefront PayPal Payment Extension

PayPal Payment extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://develodesign.co.uk).

## Installation using NPM:

Add the extension to your Vue Storefront `package.json` using:
```shell
$ npm install vsf-payment-paypal --save
```

Add `vsf-payment-paypal` to the  `extensions/index.js`
```js
export default [
  require('@vue-storefront/extension-droppoint-shipping/index.js'),
  require('@vue-storefront/extension-google-analytics/index.js'),
  require('@vue-storefront/extension-mailchimp-subscribe/index.js'),
  require('@vue-storefront/extension-payment-backend-methods/index.js'),
  require('@vue-storefront/extension-payment-cash-on-delivery/index.js'),
  require('@vue-storefront/extension-template/index.js'),
  require('vsf-payment-stripe/index.js'),
  require('src/extensions/cms/index.js'),

  require('vsf-payment-paypal/index.js').default
]
```

Add the following also to your `config/local.json` and configure Client ID the `paypal.client.production` to point to your PayPal details. For production need set `paypal.env` to `production`.
```js
"paypal": {
  "env": "sandbox",
  "client": {
    "sandbox": "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
    "production": "<insert production client id>"
  },
  "style": {
    "size": "small",
    "color": "gold",
    "shape": "pill"
  }
}
```

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).
