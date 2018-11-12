import store from '@vue-storefront/store'
import EventBus from '@vue-storefront/core/plugins/event-bus'
import PaypalComponent from '../components/PaymentPaypal.vue'
import PaypalButton from '../components/Button.vue'

// Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
function placeOrder () {
  EventBus.$emit('checkout-do-placeOrder', {})
}

export function beforeRegistration(Vue, config) {

  if (!Vue.prototype.$isServer) {
    // Add this payment method to the config.
    let paymentMethodConfig = {
      'title': 'Paypal',
      'code': 'vsfpaypal',
      'cost': 0,
      'costInclTax': 0,
      'default': false,
      'offline': true
    }

    store.dispatch('payment/addMethod', paymentMethodConfig)

    // Mount the info component when required.
    EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      if (paymentMethodCode === 'vsfpaypal') {
        // Register the handler for what happens when they click the place order button.
        EventBus.$on('checkout-before-placeOrder', placeOrder)

        // Dynamically inject a component into the order review section (optional)
        const Component = Vue.extend(PaypalComponent)
        const componentInstance = (new Component())
        componentInstance.$mount('#checkout-order-review-additional')

        const Button = Vue.extend(PaypalButton)
        const btnInstance = (new Button())

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
  }
}