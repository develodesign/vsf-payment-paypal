# Paypal Payment extension for Vue Storefront

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

Add the following also to your `config/local.json` and configure the `paypal.api_key` to point to your Stripe details.
```js
"paypal": {
    "api_key": "my_example_api_key"
}
```
