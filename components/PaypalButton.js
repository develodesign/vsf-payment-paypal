import { mapGetters } from 'vuex';
import store from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

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
  data () {
    const storeView = currentStoreView()
    return {
      tokenId: null,
      errorMessage: '',
      currencyCode: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Converting to PayPal format,
    }
  },
  mounted () {
    this.renderButton()
  },
  computed: {
    ...mapGetters({
      shippingDetails: 'payment-paypal-magento2/getShippingDetails',
      getBillingAddress: 'payment-paypal-magento2/getBillingAddress',
      getShippingAddress: 'payment-paypal-magento2/getShippingAddress',
      getProducts: 'payment-paypal-magento2/getProducts',
      getAmount: 'payment-paypal-magento2/getAmount'
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
    getPurchaseUnits () {
      return [{
        reference_id: this.$store.getters['cart/getCartToken'],
        description: this.$t('Need to return an item? We accept returns for unused items in packaging 60 days after you order'),
        items: this.getProducts,
        amount: this.getAmount,
        shipping: this.getShippingAddress
      }]
    },
    async onCreateOrder (data, actions) {
      return store.dispatch('cart/syncTotals', {
        methodsData: {
          country: this.shippingDetails.country,
          zipCode: this.shippingDetails.zipCode,
          region: this.shippingDetails.region,
          region_id: this.shippingDetails.regionId,
          region_code: this.shippingDetails.regionCode,
          method_code: this.shippingDetails.shippingMethod,
          carrier_code: this.shippingDetails.shippingCarrier,
          payment_method: null
        },
        forceServerSync: true
      }).then(() => {
        // create order using Server Side methods same as magento 2....
        return store.dispatch('payment-paypal-magento2/setExpressCheckout', {
          cart_id: store.getters['cart/getCartToken'],
          brand_name: '',
          locale: this.locale,
          currency_code: this.currencyCode,
          purchase_units: this.getPurchaseUnits(),
          user_token: store.getters['user/getUserToken'],
          email: store.state.checkout.personalDetails.emailAddress,
          return_url: 'https://www.paypal.com/checkoutnow/error',
          cancel_url: 'https://www.paypal.com/checkoutnow/error',
          total_type: 'EstimatedTotal',
          logo: ''
        }).then((resp) => {
          const result = resp.result
          if (result.success && result.hasOwnProperty('token')) {
            this.errorMessage = ''
            this.tokenId = result.token
            return this.tokenId
          } else {
            this.errorMessage = result.error.message
            return false
          }
        })
      })
    },
    async onApprove (data, actions) {
      let additionalMethod = {
        // magento 2 fields expects
        paypal_express_checkout_token: this.tokenId,
        button: 1,
        paypal_express_checkout_payer_id: data.payerID,
        paypal_express_checkout_redirect_required: false
      }
      this.$bus.$emit('checkout-do-placeOrder', additionalMethod)
    }
  }
}
