import Vue from 'vue'
import EventBus from '@vue-storefront/core/plugins/event-bus'

import extensionStore from './store'
import extensionRoutes from './router'
import PaypalComponent from './components/PaymentPaypal'
import PaypalButton from './components/Button'

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
    'code': 'vsfpaypal',
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': true
  }

  app.$store.dispatch('payment/addMethod', paymentMethodConfig)

  // Mount the info component when required.
  EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
    if (paymentMethodCode === 'vsfpaypal') {
      // Register the handler for what happens when they click the place order button.
      EventBus.$on('checkout-before-placeOrder', placeOrder)

      // Dynamically inject a component into the order review section (optional)
      const Component = Vue.extend(PaypalComponent)
      const componentInstance = (new Component({ parent: app }))
      componentInstance.$mount('#checkout-order-review-additional')

      const Button = Vue.extend(PaypalButton)
      const btnInstance = (new Button({ parent: app }))

      var orderBtn = document.querySelector('.place-order-btn')
      orderBtn.style.display = 'none'
      var container = orderBtn.parentNode
      if (container !== null) {
        container.appendChild(document.createElement('div')).id = 'place-order-container'
      }

      btnInstance.$mount('#place-order-container')
    } else {
      document.querySelector('.place-order-btn').style.display = ''
      var el = document.querySelector('.paypal-button')
      el !== null && el.parentNode.removeChild(el)

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
