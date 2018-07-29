<template>
  <div class="paypal-button"/>
</template>

<script>
import { currentStoreView, adjustMultistoreApiUrl } from '@vue-storefront/store/lib/multistore'

export default {
  name: 'PaypalButton',
  props: {
    grandTotal: {
      type: Number,
      required: true,
      default: 0
    }
  },
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
      this.$nextTick(() => {
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
      })
    },
    getTransactions () {
      return [{ amount: { total: this.grandTotal, currency: this.currency } }]
    },
    createPayment (data, actions) {
      const transactions = this.getTransactions()
      let url = this.$config.paypal.create_endpoint
      if (this.$config.storeViews.multistore) {
        url = adjustMultistoreApiUrl(url)
      }
      return fetch(url, { method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactions })
      }).then(resp => { return resp.json() })
        .then((resp) => {
          if (resp.hasOwnProperty('id')) {
            return resp.id
          }
        })
    },
    onAuthorize (data, actions) {
      // For pass required validation and successfully place order.
      document.getElementById('acceptTermsCheckbox').click()

      const transactions = this.getTransactions()

      const vm = this
      this.$emit('payment-paypal-authorized', data)
      if (this.commit) {
        let url = this.$config.paypal.execute_endpoint
        if (this.$config.storeViews.multistore) {
          url = adjustMultistoreApiUrl(url)
        }
        return fetch(url, { method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentID: data.paymentID,
            payerID: data.payerID,
            transactions: transactions
          })
        }).then((resp) => {
          vm.$bus.$emit('checkout-do-placeOrder', resp)
          if (resp.status === 'success') {
            vm.$emit('payment-paypal-completed', resp)
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
