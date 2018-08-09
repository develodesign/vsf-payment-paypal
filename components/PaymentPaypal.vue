<template>

  <div class="mb15 mt20 payment-paypal-info-container">
    <h4 class="mt0">
      Payment Information
    </h4>
    <div class="bg-cl-secondary px20 py20">
      <p>
        You are to pay for this order via PayPal.
      </p>
      <paypal-button :grand-total="grandTotal"/>
    </div>
  </div>

</template>

<script>
import PaypalButton from '../components/Button'

export default {
  name: 'PaymentPaypal',
  computed: {
    grandTotal () {
      return this.$store.state.cart.platformTotals['grand_total'] || 0
    }
  },
  components: {
    PaypalButton
  }
}
</script>
