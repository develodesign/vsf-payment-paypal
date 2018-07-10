<template>
  <div class="paypal-button"/>
</template>

<script>

export default {
  name: 'PaypalButton',
  data () {
    return {
      env: 'sandbox', // sandbox | production
      client: {
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
        production: '<insert production client id>'
      },
      commit: true, // Display a "Pay Now" button rather than a "Continue" button
      payment: { transactions: [{ amount: { total: '0.01', currency: 'USD' } }] }
    }
  },
  mounted () {
    this.loadDependencies(this.configurePaypal)
  },
  methods: {
    loadDependencies (callback) {
      let paypalJsUrl = 'https://www.paypalobjects.com/api/checkout.js'
      let docHead = document.getElementsByTagName('head')[0]
      let docScript = document.createElement('script')
      docScript.type = 'text/javascript'
      docScript.src = paypalJsUrl
      // When script is ready fire our callback.
      docScript.onreadystatechange = callback
      docScript.onload = callback
      docHead.appendChild(docScript)
    },
    configurePaypal () {
      this.paypal = window.paypal
      this.paypal.Button.render({
        // Pass in env
        env: this.env,
        // Pass in the client ids to use to create your transaction
        // on sandbox and production environments
        client: this.client,
        // Pass the payment details for your transaction
        // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
        payment: this.onPayment,
        // Display a "Pay Now" button rather than a "Continue" button
        commit: this.commit,
        // Pass a function to be called when the customer completes the payment
        onAuthorize: this.onAuthorize,
        // Pass a function to be called when the customer cancels the payment
        onCancel: this.onCancel
      }, this.$el)
    },
    onPayment () {
      return window.actions.payment.create(
        { payment: { transactions: [{ amount: { total: '0.01', currency: 'USD' } }] } }
      )
    },
    onAuthorize (data, actions) {
      const vue = this
      vue.$emit('payment-authorized', data)
      if (this.commit) {
        return actions.payment.execute().then((response) => {
          vue.$emit('payment-completed', response)
        })
      }
      return true
    },
    onCancel (data) {
      this.$emit('payment-cancelled', data)
    }
  }
}
</script>
