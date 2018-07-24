<template>

  <div class="mb15 mt20 payment-paypal-info-container">
    <h4 class="mt0">
      Payment Information
    </h4>
    <div class="bg-cl-secondary px20 py20">
      <p>
        You are to pay for this order via PayPal.
      </p>
      <paypal-button :grand-total="platformTotals['grand_total']"/>
    </div>
  </div>

</template>

<script>
import PaypalButton from '../components/Button'

export default {
  name: 'PaymentPaypal',
  props: {
    platformTotals: {
      type: Object,
      required: true,
      default: function () {}
    }
  },
  components: {
    PaypalButton
  }
}
</script>
