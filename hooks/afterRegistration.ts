import Vue from 'vue'
import { isServer } from '@vue-storefront/core/helpers'
import * as types from '../store/mutation-types'

export function afterRegistration (config, store) {
  const VSF_PAYPAL_CODE = 'paypal_express'
  let correctPaymentMethod = false

  const placeOrder = () => {
    if (correctPaymentMethod) {
      // Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
    }
  }

  if (!isServer) {
    Vue.prototype.$bus.$on('set-unique-payment-methods', methods => {
      store.commit(`payment-paypal-magento2/${types.SET_BACKEND_PAYMENT_PAYPAL_EXPRESS}`, methods)
    })

    Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

    Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      correctPaymentMethod = paymentMethodCode === VSF_PAYPAL_CODE
    })
  }
}
