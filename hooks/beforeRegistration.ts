import PaypalButton from '../components/Button.vue'

export function beforeRegistration(Vue, config, store, isServer) {

  store.dispatch('payment/addMethod', {
    'title': 'Paypal',
    'code': 'vsfpaypal',
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': true
  })

  if (!Vue.prototype.$isServer) {

    store.watch((state) => state.checkout.paymentDetails, (prevMethodCode, newMethodCode) => {
      if (newMethodCode === 'vsfpaypal') {
        // Register the handler for what happens when they click the place order button.
        Vue.prototype.$bus.$on('checkout-before-placeOrder', () => {
          Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
        })
      } else {
        // Unregister the extensions placeorder handler
        Vue.prototype.$bus.$off('checkout-before-placeOrder', () => {
          Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
        })
      }
    })
  }
}