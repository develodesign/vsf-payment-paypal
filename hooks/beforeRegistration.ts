import PaypalComponent from '../components/PaymentPaypal.vue'
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

        // Dynamically inject a component into the order review section (optional)
        const Component = Vue.extend(PaypalComponent)
        const componentInstance = (new Component())
        componentInstance.$mount('#checkout-order-review-additional')

        const Button = Vue.extend(PaypalButton)
        const btnInstance = (new Button({ paypal: config.paypal, storeViews: config.storeViews }))

        var orderBtn = document.querySelector('.place-order-btn')
        orderBtn['style'].display = 'none'
        var container = orderBtn.parentNode
        if (container !== null) {
          container.appendChild(document.createElement('div')).id = 'place-order-container'
        }

        btnInstance.$mount('#place-order-container')
      } else {
        document.querySelector('.place-order-btn')['style'].display = ''
        var el = document.querySelector('.paypal-button')
        el !== null && el.parentNode.removeChild(el)

        // unregister the extensions placeorder handler
        Vue.prototype.$bus.$off('checkout-before-placeOrder', () => {
          Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
        })
      }
    })
  }
}