<template>
  <div class="paypal-button"/>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/store/lib/multistore'

export default {
  name: 'PaypalButton',
  data () {
    const storeView = currentStoreView()
    return {
      commit: true,
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Convert to PayPal format of locale
    }
  },
  mounted () {
    !window.hasOwnProperty('paypal') ? this.loadDependencies(this.configurePaypal) : this.configurePaypal()
  },
  computed: {
    ...mapGetters({
      totals: 'cart/totals'
    })
  },
  methods: {
    loadDependencies (callback) {
      let jsUrl = 'https://www.paypalobjects.com/api/checkout.js'
      let docHead = document.getElementsByTagName('head')[0]
      let docScript = document.createElement('script')
      docScript.type = 'text/javascript'
      docScript.src = jsUrl
      // When script is ready fire our callback.
      docScript.onreadystatechange = callback
      docScript.onload = callback
      docHead.appendChild(docScript)
    },
    configurePaypal () {
      window.paypal.Button.render({
        // Pass in env
        env: this.$config.paypal.env,
        // Customize button (optional)
        locale: this.locale, // Should be in format: 'en_US' accordance by PayPal Api (in VSF used 'en-US')
        style: this.$config.paypal.style,
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
    getGrandTotal () {
      return this.totals.filter(segment => segment.code === 'grand_total')[0].value
    },
    createPayment (data, actions) {
      const transactions = [{ amount: { total: this.getGrandTotal(), currency: this.currency } }]

      return actions.request.post(this.$config.paypal.create_endpoint, { transactions })
        .then(function(res) {
          return res.id;
        });
    },
    onAuthorize (data, actions) {
      const vue = this
      vue.$emit('payment-authorized', data)
      if (this.commit) {
        return actions.request.post(this.$config.paypal.execute_endpoint, {
          paymentID: data.paymentID,
          payerID:   data.payerID
        })
          .then(function(res) {
            vue.$emit('payment-completed', response)
          });
      }
      return true
    },
    onCancel (data) {
      this.$emit('payment-cancelled', data)
    }
  }
}
</script>
