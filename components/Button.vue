<template>
  <div>
    <div style="color: red;">{{ $t(errorMessage) }}</div>
    <div class="paypal-button" />
  </div>
</template>

<script>
import { PaypalButton } from '@develodesign/vsf-payment-paypal/components/PaypalButton'

export default {
  mixins: [PaypalButton]
}
</script>
