import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import PaypalButton from '../components/Button.vue'
import * as types from '../store/mutation-types'

export function afterRegistration({ Vue, config, store, isServer }) {
  const VSF_PAYPAL_CODE = 'paypal_express'
  let correctPaymentMethod = false

  const placeOrder = () => {
    if (correctPaymentMethod) {
      // Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
    }
  }

  if (!isServer) {
    Vue.prototype.$bus.$on('set-unique-payment-methods', methods => {
      store.commit('payment-paypal-magento2/' + types.SET_BACKEND_PAYMENT_PAYPAL_EXPRESS, methods)
    })

    Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

    // Mount the info component when required
    Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      if (paymentMethodCode === VSF_PAYPAL_CODE) {
        correctPaymentMethod = true
        /*
        // Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

        const Component = Vue.extend(PaypalButton)
        const componentInstance = (new Component())
        componentInstance.$mount('#checkout-order-review-additional')
        */
      } else {
        correctPaymentMethod = false
        /*
        // Vue.prototype.$bus.$off('checkout-before-placeOrder', placeOrder)

        if (document.getElementById('checkout-order-review-additional') != null) {
          document.getElementById('checkout-order-review-additional').innerHTML = ''
        }
        */
      }
    })
  }
}
