# Vue Storefront PayPal Payment Extension

PayPal Payment extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://www.develodesign.co.uk).

## The architecture
![Architecture diagram](doc/executing-paypal-payment-server-integration.svg)

## Installation

```shell
$ git clone -b 0.1.x git@github.com:develodesign/vsf-payment-paypal.git src/extensions/paypal
```

Then need push the paypal extension to `extensionList` in `src/extensions/index.js`
```shell
extensionList.push(require('@vue-storefront/extension-payment-paypal/index.js'))
```

For detect the `@vue-storefront/extension-payment-paypal` by lerna, evaluate the `yarn` command from console:
```shell
$ yarn
```

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `production`.
```json
"paypal": {
  "env": "sandbox",
  "create_endpoint": "http://localhost:8080/api/ext/payment-paypal/create",
  "execute_endpoint": "http://localhost:8080/api/ext/payment-paypal/execute"
}
```

Install additional extension for `vue-storefront-api`:
```shell
git clone git@github.com:develodesign/vsf-payment-paypal-api.git ../vue-storefront-api/src/api/extensions/payment-paypal
```
Next see configuration [vsf-payment-paypal-api](https://github.com/develodesign/vsf-payment-paypal-api)


## Customization

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).

```json
"paypal": {
  ...
  "style": {
    "size": "small",
    "color": "gold",
    "shape": "pill"
  }
}
```
