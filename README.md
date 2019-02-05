# Vue Storefront PayPal Payment Extension

PayPal Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://www.develodesign.co.uk).

![Demo](docs/demo.png)


## Installation:

By hand (preferer):
```shell
$ git clone git@github.com:develodesign/vsf-payment-paypal.git ./vue-storefront/src/modules/paypal
```

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `production`.
```json
"paypal": {
  "env": "sandbox",
  "endpoint": {
    "create": "http://localhost:8080/api/ext/payment-paypal/create",
    "execute": "http://localhost:8080/api/ext/payment-paypal/execute"
  }
}
```

## Registration the Paypal module

Open in you editor `./src/modules/index.ts`

```js
...
import { Paypal } from './paypal'

export const registerModules: VueStorefrontModule[] = [
  ...,
  Paypal
]
```

## PayPal payment API extension

Install additional extension for `vue-storefront-api`:
```shell
$ cp -f ./API/paypal ../vue-storefront-api/src/api/extensions/
```

Go to api config  `./vue-storefront-api/config/local.json` and register the Paypal Api extension:
```
"registeredExtensions": [
    ...
    "paypal"
]
```

And add the `paypal` settings to `extensions` key:
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

## Paypal payment Checkout Review
Under your theme `components/core/blocks/Checkout/OrderReview.vue` add the following import to your script

```js
import PaypalButton from 'src/modules/paypal/components/Button'

export default {
  components: {
    ...
    PaypalButton
  },
  ...
  data () {
    return {
      payment: this.$store.state.checkout.paymentDetails
    }
  },
```

And to you template add the paypal button before `button-full`:

```html
<paypal-button v-if="payment.paymentMethod === 'vsfpaypal'"/>
<button-full
  v-else
  @click.native="placeOrder"
  data-testid="orderReviewSubmit"
  class="place-order-btn"
  :disabled="$v.orderReview.$invalid"
>
  {{ $t('Place the order') }}
</button-full>
```

## Magento2 integration

This API extension execute payment to PayPal gateway.
It use `develodesign/m2-paypal-payment` [The custom Paypal payment method for Magento2](https://github.com/develodesign/m2-paypal-payment) composer module so you have to install it in your Magento instance.

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
