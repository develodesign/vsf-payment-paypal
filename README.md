# Vue Storefront PayPal Payment Extension

PayPal Payment extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://www.develodesign.co.uk).

## The architecture
![Architecture diagram](doc/executing-paypal-payment-server-integration.svg)

## Installation using NPM:

Add the extension to your Vue Storefront `package.json` using:
```shell
$ npm install vsf-payment-paypal --save
```

Then need push the paypal extension to `extensionList` in `src/extensions/index.js`
```js
extensionList.push(require('@vue-storefront/extension-payment-paypal/index.js'))
```

For detect the `@vue-storefront/extension-payment-paypal` by lerna, evaluate the `yarn` command from console:
```js
$ yarn
```

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `production`.
```js
"paypal": {
  "env": "sandbox",
  "create_endpoint": "http://localhost:8080/api/ext/paypal-payment/create",
  "execute_endpoint": "http://localhost:8080/api/ext/paypal-payment/execute"
}
```

Install additional extension for `vue-storefront-api`:
```js
git clone git@github.com:develodesign/vsf-payment-paypal-api.git ../vue-storefront-api/src/api/extensions/payment-paypal
```
Next see configuration [vsf-payment-paypal-api](https://github.com/develodesign/vsf-payment-paypal-api)


## Customization

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).

```js
"paypal": {
  ...
  "style": {
    "size": "small",
    "color": "gold",
    "shape": "pill"
  }
}
```
