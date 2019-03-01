
export function beforeRegistration({ Vue, config, store, isServer }) {
  const VSF_PAYPAL_CODE = 'vsfpaypal'

  store.dispatch('payment/addMethod', {
    'title': 'Paypal',
    'code': VSF_PAYPAL_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': true
  })

  if (!Vue.prototype.$isServer) {

    let jsUrl = 'https://www.paypalobjects.com/api/checkout.js'
    let docHead = document.getElementsByTagName('head')[0]
    let docScript = document.createElement('script')
    docScript.type = 'text/javascript'
    docScript.src = jsUrl
    docHead.appendChild(docScript)

    let currentPaymentMethodIsPaypal = false
    store.watch((state) => state.checkout.paymentDetails, (prevMethodCode, newMethodCode) => {
      currentPaymentMethodIsPaypal = newMethodCode === VSF_PAYPAL_CODE
    })
    
    const invokePlaceOrder = () => {
      if (currentPaymentMethodIsPaypal) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
      }
    }
    Vue.prototype.$bus.$on('checkout-before-placeOrder', invokePlaceOrder)
  }
}
