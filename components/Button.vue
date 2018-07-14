<template>
  <div class="paypal-button"/>
</template>

<script>

export default {
  name: 'PaypalButton',
  mounted () {
    this.loadDependencies(this.configurePaypal)
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
        // Pass in the client ids to use to create your transaction
        // on sandbox and production environments
        client: this.$config.paypal.client,
        // Customize button (optional)
        locale: 'en_US', // TODO: use from current store VSF
        style: this.$config.paypal.style,
        // Pass the payment details for your transaction
        // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
        payment: this.createPayment,
        // Display a "Pay Now" button rather than a "Continue" button
        commit: true,
        // Pass a function to be called when the customer completes the payment
        onAuthorize: this.onAuthorize,
        // Pass a function to be called when the customer cancels the payment
        onCancel: this.onCancel
      }, this.$el)
    },
    createPayment (data, actions) {
      return actions.payment.create({ transactions: [{ amount: { total: '0.01', currency: 'USD' } }] })
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
