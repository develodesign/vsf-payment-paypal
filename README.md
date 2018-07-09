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
  require('src/extensions/custom_extension/index.js').default,
  require('src/extensions/payment-cash-on-delivery/index.js').default,
  require('src/extensions/payment-backend-methods/index.js').default,
  require('src/extensions/mailchimp-subscribe/index.js').default,
  require('src/extensions/google-analytics/index.js').default,

  require('vsf-payment-paypal/index.js').default
]
```

Add the following also to your `config/local.json` and configure the `paypal.api_key` to point to your Stripe details.
```js
"paypal": {
    "api_key": "my_example_api_key"
}
```
