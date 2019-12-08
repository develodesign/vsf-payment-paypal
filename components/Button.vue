<template>
  <div class="paypal-button"/>
</template>

<script>
import i18n from '@vue-storefront/i18n'
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
  beforeMount () {
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder)
  },
  beforeDestroy () {
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder)
  },
  mounted () {
    window.paypal.Buttons({
      createOrder: this.createOrder,
      onApprove: this.onApprove,
      style: this.$store.state.config.paypal.hasOwnProperty('style') ? this.$store.state.config.paypal.style : {}
    }).render('.paypal-button')
  },
  computed: {
    grandTotal () {
      let cartTotals = this.$store.getters.hasOwnProperty('cart/totals') ? this.$store.getters['cart/totals'] : this.$store.getters['cart/getTotals']
      return cartTotals.find(seg => seg.code === 'grand_total').value
    }
  },
  methods: {
    onAfterPlaceOrder () {
      // Stop display loader
      this.$bus.$emit('notification-progress-stop')
    },
    getAmount () {
      return [{ amount: { value: this.grandTotal, currency_code: this.currencyCode } }]
    },
    createOrder (data, actions) {
      return actions.order.create({
        purchase_units: this.getAmount()
      })
    },
    async onApprove (data, actions) {
      // Start display loader
      this.$bus.$emit('notification-progress-start', [i18n.t('Placing Order'), '...'].join(''))

      const capture = await actions.order.capture()

      if (capture.status !== 'COMPLETED') {
        return false
      }

      const completed = await this.$store.dispatch('paypal/complete', { orderId: data.orderID })

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
