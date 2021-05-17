import Vue from 'vue'
import { isServer } from '@vue-storefront/core/helpers'
import * as types from '../store/mutation-types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export function afterRegistration(config, store) {
  const VSF_PAYPAL_CODE = 'paypal_express'
  let correctPaymentMethod = false

  const placeOrder = () => {
    if (correctPaymentMethod) {
      // EventBus.$emit('checkout-do-placeOrder', {})
    }
  }

  if (!isServer) {
    EventBus.$on('set-unique-payment-methods', methods => {
      store.commit(`payment-paypal-magento2/${types.SET_BACKEND_PAYMENT_PAYPAL_EXPRESS}`, methods)
    })

    EventBus.$on('checkout-before-placeOrder', placeOrder)

    EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      correctPaymentMethod = paymentMethodCode === VSF_PAYPAL_CODE
    })
  }
}
