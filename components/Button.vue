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
      currencyCode: storeView.i18n.currencyCode,
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
      let cartTotals = store.getters['cart/getTotals']
      return cartTotals.find(seg => seg.code === 'grand_total').value
    }
  },
  methods: {
    getAmount () {
      return [{ amount: { value: this.grandTotal, currency_code: this.currencyCode } }]
    },
    createOrder (data, actions) {
      return actions.order.create({
        purchase_units: this.getAmount()
      })
    },
    async onApprove (data, actions) {
      const capture = await actions.order.capture()

      if (capture.status !== 'COMPLETED') {
        return false
      }

      const completed = await store.dispatch('paypal/complete', { orderId: data.orderID })

      this.$bus.$emit('checkout-do-placeOrder', completed)

      if (completed.status === 'success') {
        this.$emit('payment-paypal-completed', completed)
      }
    },
    onCancel (data) {
      this.$emit('payment-paypal-cancelled', data)
    }
  }
}
</script>
