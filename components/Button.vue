<template>
  <div class="paypal-button"/>
</template>

<script>
import store from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'PaypalButton',
  data () {
    const storeView = currentStoreView()
    return {
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Converting to PayPal format
    }
  },
  mounted () {
    window.paypal.Buttons({
      createOrder: this.createOrder,
      onApprove: this.onApprove
    }).render('.paypal-button')
  },
  computed: {
    grandTotal () {
      let cartTotals = store.getters['cart/totals']
      return cartTotals.find(seg => seg.code === 'grand_total').value
    }
  },
  methods: {
    getTransactions () {
      return [{ amount: { total: this.grandTotal, currency: this.currency } }]
    },
    createOrder (data, actions) {
      return actions.order.create({
        purchase_units: this.getTransactions()
      })
    },
    onApprove (data, actions) {
      return actions.order.capture().then((details) => {
        console.log('Transaction completed by ' + details.payer.name.given_name)
        const params = {
          orderID: data.orderID
        }
        store.dispatch('paypal/transaction-complete', params).then((resp) => {
          self.$bus.$emit('checkout-do-placeOrder', resp)
          if (resp.status === 'success') {
            self.$emit('payment-paypal-completed', resp)
          }
        })
      })
    },
    onCancel (data) {
      this.$emit('payment-paypal-cancelled', data)
    }
  }
}
</script>
