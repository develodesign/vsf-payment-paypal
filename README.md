# Vue Storefront PayPal Payment Extension

PayPal Payment extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://www.develodesign.co.uk).

## The architecture
![Architecture diagram](docs/executing-paypal-payment-server-integration.svg)

## Installation using NPM:

Add the extension to your Vue Storefront `package.json` using:
```shell
$ npm install vsf-payment-paypal --save
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

# PayPal payment API extension

Install additional extension for `vue-storefront-api`:
```shell
cp -fr ./api-ext ../vue-storefront-api/src/api/extensions/payment-paypal
```

This API extension execute payment to PayPal gateway.
It use `develodesign/m2-paypal-payment` composer module so you have to install it in your Magento instance.

in your `local.json` file you should register the extension:
```
"registeredExtensions": [
    ...
    "payment-paypal"
]
```

And need add the `paypal` settings to `extensions` key in `local.json`:
```
  "extensions": {
    "mailchimp": {
      ...
    },
    "paypal": {
      "api": "https://api.sandbox.paypal.com",
      "client": "",
      "secret": ""
    }
  }
```


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
