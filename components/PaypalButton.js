import { mapGetters } from 'vuex';

export const PaypalButton = {
  name: 'PaypalButton',
  props: {
    styling: {
      type: Object,
      required: false,
      default: () => ({
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      })
    }
  },
  computed: {
    ...mapGetters({
      token: 'payment-paypal-magento2/getToken',
      message: 'payment-paypal-magento2/getMessage'
    })
  },
  methods: {
    renderButton () {
      window.paypal.Buttons({
        createOrder: this.onCreateOrder,
        onApprove: this.onApprove,
        style: this.styling
      }).render('.paypal-button')
    },
    async onCreateOrder (data, actions) {
      return this.$store.dispatch('payment-paypal-magento2/createOrder')
    },
    async onApprove (data, actions) {
      let additionalMethod = {
        // magento 2 fields expects
        paypal_express_checkout_token: this.token,
        button: 1,
        paypal_express_checkout_payer_id: data.payerID,
        paypal_express_checkout_redirect_required: false
      }
      this.$bus.$emit('checkout-do-placeOrder', additionalMethod)
    }
  },
  mounted () {
    this.renderButton()
  }
}
