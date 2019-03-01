<template>
  <div class="paypal-button"><span v-show="loader"/></div>
</template>

<script>
import config from 'config'
import store from '@vue-storefront/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'PaypalButton',
  data () {
    const storeView = currentStoreView()
    return {
      loader: false,
      commit: true,
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Convert to PayPal format of locale
    }
  },
  mounted () {
    this.configurePaypal()
  },
  computed: {
    grandTotal () {
      let cartTotals = store.getters['cart/totals']
      return cartTotals.find(seg => seg.code === 'grand_total').value
    }
  },
  methods: {
    configurePaypal () {
      let defaultStyle = { 'size': 'small', 'color': 'gold', 'shape': 'pill' }
      window.paypal.Button.render({
        // Pass in env
        env: config.paypal.env,
        // Customize button (optional)
        locale: this.locale, // Should be in format: 'en_US' accordance by PayPal Api (in VSF used 'en-US')
        style: Object.assign({}, defaultStyle, config.paypal.hasOwnProperty('style') ? config.paypal.style : {}),
        // Pass the payment details for your transaction
        // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
        payment: this.createPayment,
        // Display a "Pay Now" button rather than a "Continue" button
        commit: this.commit,
        // Pass a function to be called when the customer completes the payment
        onAuthorize: this.onAuthorize,
        // Pass a function to be called when the customer cancels the payment
        onCancel: this.onCancel
      }, this.$el)
    },
    getTransactions () {
      return [{ amount: { total: this.grandTotal, currency: this.currency } }]
    },
    createPayment (data, actions) {
      return store.dispatch('paypal/create', this.getTransactions())
    },
    onAuthorize (data, actions) {
      const self = this
      if (this.commit) {
        let params = {
          paymentID: data.paymentID,
          payerID: data.payerID,
          transactions: this.getTransactions()
        }
        store.dispatch('paypal/execute', params).then((resp) => {
          self.$bus.$emit('checkout-do-placeOrder', resp)
          if (resp.status === 'success') {
            self.$emit('payment-paypal-completed', resp)
          }
        })
      }
      return true
    },
    onCancel (data) {
      this.$emit('payment-paypal-cancelled', data)
    }
  }
}
</script>
