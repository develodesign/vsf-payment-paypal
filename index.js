import Vue from 'vue'
import EventBus from 'core/plugins/event-bus'

import extensionStore from './store'
import extensionRoutes from './router'
import PaypalComponent from './components/PaymentPaypal'

const EXTENSION_KEY = 'vsf-payment-paypal'

export default function (app, router, store, config) {
  router.addRoutes(extensionRoutes) // add custom routes
  store.registerModule(EXTENSION_KEY, extensionStore) // add custom store

  app.$on('application-after-init', () => {
    console.debug(EXTENSION_KEY + ' extension initialised')
  })

  // Add this payment method to the config.
  let paymentMethodConfig = {
    'title': 'Paypal',
    'code': 'vsf-paypal',
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': true
  }

  app.$store.dispatch('payment/addMethod', paymentMethodConfig)

  // Mount the info component when required.
  EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
    if (paymentMethodCode === 'vsf-paypal') {
      // Register the handler for what happens when they click the place order button.
      EventBus.$on('checkout-before-placeOrder', placeOrder)

      // Dynamically inject a component into the order review section (optional)
      const Component = Vue.extend(PaypalComponent)
      const componentInstance = (new Component({
        propsData: { platformTotals: app.$store.state.cart.platformTotals }
      }))
      componentInstance.$mount('#checkout-order-review-additional')
    } else {
      // unregister the extensions placeorder handler
      EventBus.$off('checkout-before-placeOrder', placeOrder)
    }
  })

  return { EXTENSION_KEY, extensionRoutes, extensionStore }
}

// Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
function placeOrder () {
  EventBus.$emit('checkout-do-placeOrder', {})
}
