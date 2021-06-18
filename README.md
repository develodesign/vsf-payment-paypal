# This is the PayPal Payment module for Vue Storefront


PayPal Payment Magento 1 & 2 module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront)

![default](https://imgur.com/QFCUX0R.jpg)

Tested with VSF 1.12.x

This module is for those who want to use Magento 1 & 2's built in Paypal extension that uses the deprecated NVP/Soap api. Tested on Magento 1.9.x, 2.2.x and 2.3.x. This allows for backend Magento management of the Order lifecycle.

This module can also be used with the newer API calls easily, as address and cart items are set to be transferred to Paypal SmartButton.


## Installation

By hand (preferer):

```shell
$ git clone git@github.com:develodesign/vsf-payment-paypal.git ./vue-storefront/src/modules/paypal
```

```json
"paypal": {
  "clientId": "",
  "disabledMethods": ["giropay", "sofort", "card", "credit", "mybank", "sepa"], 
  "addJsToGlobalHead": true,
  "endpoint": {
    "complete": "/api/ext/paypal/complete",
    "setExpressCheckout": "/api/ext/paypal/setExpressCheckout"
  }
}
```

#### Add JS to Head
If you want to defer adding the JS to head globally, you can set `addJsToGlobalHead` to `false`

This will defer the beforeRegistration hook and then you can add the below into the mounted lifecycle on your checkout component where you will import the Paypal button.

```js
mounted () {
    if (!isServer && window.paypalScriptLoaded === undefined) {
      const storeView = currentStoreView()
      const { currencyCode } = storeView.i18n
      const clientId = config.paypal.hasOwnProperty('clientId') ? config.paypal.clientId : ''
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currencyCode}&disable-funding=card,credit,mybank,sofort`
      var script = document.createElement('script')
      script.setAttribute('src', sdkUrl)
      document.head.appendChild(script)
      window.paypalScriptLoaded = true
    }
}

```

## Registration the Paypal module

Let's edit `config/modules.ts`
If you use the default theme, the module registration lives here: `./src/themes/modules/client.ts`.
With Capybara, it's here: `./src/themes/capybara/config/modules.ts`.

```js
...
import { PaymentPaypalModule } from './paypal'; // Default theme
import { PaymentPaypalModule } from '../../../modules/paypal'; // Capybara theme

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

### Important
If the JSON object sent to the VSF API order is bigger than the body-parser limit, you get the exception `PayloadTooLargeError`.
For this reason, it's strongly recommended to increase the `bodyLimit` value, especially if some PayPal orders fail.

## Magento integration

Turn on Paypal Express and provide the API credentials using the built in Paypal module. Enable only Express Checkout.

Other Paypal methods are not supported or tested right now.

### Important
For Magento 1.9.x you need to manually apply this fix on the magento1-vsbridge in order to correctly works with this module: [Fix Create order](https://github.com/DivanteLtd/magento1-vsbridge/pull/55).

## Customization

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).

In OrderReview.vue, the button takes prop styling

```html
  <paypal-button :styling="{ color: 'black' }"
```


