<template>
  <div class="paypal-button"><span v-show="loader" class="loader lds-dual-ring"/></div>
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
      loader: false,
      commit: true,
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Convert to PayPal format of locale
    }
  },
  mounted () {
    !window.hasOwnProperty('paypal')
      ? this.loadDependencies(this.configurePaypal)
      : this.configurePaypal()
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
      this.loader = true
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

      setTimeout(function () { this.loader = false }.bind(this), 5000)
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

<style scoped>
  .paypal-button {
    position: relative;
  }
  .loader {
    position: absolute;
    top: -12px;
    left: 40px;
    z-index: 200;
  }
  .lds-dual-ring {
    display: inline-block;
    width: 64px;
    height: 64px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #009cde;
    border-color: #009cde transparent #009cde transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
