# This is the PayPal Payment module for Vue Storefront


PayPal Payment Magento 2 module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront)

![default](https://imgur.com/QFCUX0R.jpg)

Tested with VSF 1.12.x

This module is for those who want to use Magento 2's built in Paypal extension that uses the deprecated NVP/Soap api. Tested on Magento 2.2.x and 2.3.x. This allows for backend Magento2 management of the Order lifecycle.

This module can also be used with the newer API calls easily, as address and cart items are set to be transferred to Paypal SmartButton.


## Installation

By hand (preferer):

```shell
$ git clone git@github.com:develodesign/vsf-payment-paypal.git ./vue-storefront/src/modules/paypal
```

```json
"paypal": {
  "clientId": "",
  "endpoint": {
    "complete": "/api/ext/paypal/complete",
    "setExpressCheckout": "/api/ext/paypal/setExpressCheckout"
  }
}
```

## Registration the Paypal module

Let's edit `config/modules.ts`
Module registration lives here: `./src/themes/default/config/modules.ts` or `./src/themes/capybara/config/modules.ts` or in you custom theme.

```js
...
import { PaymentPaypalModule } from '../../../modules/paypal';

export function registerClientModules () {
  ...
  registerModule(PaymentPaypalModule)
}
```

## Integration to the Default VSF theme (vsf-default)

Add the following to your component `components/core/blocks/Checkout/OrderReview.vue`:

```js
import PaypalButton from '@develodesign/vsf-payment-paypal/components/Button'

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
  }
```

And add the paypal button before `button-full` component:

```html
<paypal-button v-if="payment.paymentMethod === 'paypal_express'"/>
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

## Integration to the Capybara theme (vsf-capybara)

![capybara](https://imgur.com/Kgm9McA.jpg)

Add the following to your component `components/organisms/o-confirm-order.vue`:

```js
import PaypalButton from '@develodesign/vsf-payment-paypal/components/Button'

export default {
  components: {
    ...
    PaypalButton
  }
```
*** The computed `paymentDetails` in o-confirm-order.vue available out of the box in Capybara theme. ***

And add the Paypal component before place order button. Don't forget to add the `v-else` condition for the place order `SfButton` component.

```html
<paypal-button v-if="paymentDetails.paymentMethod === 'paypal_express' && !$v.orderReview.$invalid"/>
<SfButton
  v-else
  class="sf-button--full-width actions__button"
  :disabled="$v.orderReview.$invalid || !productsInCart.length"
  @click="placeOrder"
>
  {{ $t("Place the order") }}
</SfButton>
```

## PayPal payment API extension

Install extension to `vue-storefront-api`:

```shell
yarn add -W @paypal/checkout-server-sdk paypal-nvp-api
```

```shell
$ cp -fr src/modules/paypal/api/paypal ../vue-storefront-api/src/api/extensions/
```

Go to api config  `./vue-storefront-api/config/local.json` and register the Paypal Api extension:

```json
"registeredExtensions": [
    ...
    "paypal"
]
```

And add the `paypal` settings to `extensions` key:

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `live`.

```json
  "extensions": {
    "paypal": {
      "env": "sandbox",
      "clientId": "",
      "secret": "",
      "username": "",
      "password": "",
      "signature": ""
    },
    ...
  }
```

## Magento2 integration

Turn on Paypal Express and provide the API credentials using the built in Paypal module. Enable only Express Checkout.

Other Paypal methods are not supported or tested right now.

## Customization

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).

In OrderReview.vue, the button takes prop styling

```html
  <paypal-button :styling="{ color: 'black' }"
```


