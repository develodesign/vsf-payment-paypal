# This is the PayPal Payment module for Vue Storefront

PayPal Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://www.develodesign.co.uk).

![Demo](docs/demo.png)


## Installation:

By hand (preferer):
```shell
$ git clone git@github.com:develodesign/vsf-payment-paypal.git ./vue-storefront/src/modules/paypal
```

```json
"paypal": {
  "clientId": "",
  "endpoint": {
    "complete": "http://localhost:8080/api/ext/paypal/complete"
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
  computed: {
    payment () {
      return this.$store.state.checkout.paymentDetails
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


## PayPal payment API extension

Setup dependency to api:
`cd ../vue-storefront-api`
`yarn add -W @paypal/checkout-server-sdk`

Install extension to `vue-storefront-api`:
```shell
$ cp -fr src/modules/paypal/api/paypal ../vue-storefront-api/src/api/extensions/
```

Go to api config  `./vue-storefront-api/config/local.json` and register the Paypal Api extension:
```
"registeredExtensions": [
    ...
    "paypal"
]
```

And add the `paypal` settings to `extensions` key:

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `live`.

```
  "extensions": {
    "paypal": {
      "env": "sandbox",
      "clientId": "",
      "secret": ""
    },
    ...
  }
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
        "layout": "horizontal",
        "color": "black",
        "label": "pay",
        "tagline": false
   }
}
```
