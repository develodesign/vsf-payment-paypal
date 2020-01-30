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
    platformTotal () {
      return this.$store.state.cart.platformTotalSegments
    },
    shippingDetails () {
      return this.$store.state.checkout.shippingDetails
    },
    paymentDetails () {
      return this.$store.state.checkout.paymentDetails
    }
  },
  methods: {
    renderButton () {
      window.paypal.Buttons({
        style: this.styling,
        createOrder: this.onCreateOrder,
        onApprove: this.onApprove
      }).render('.paypal-button')
    },
    getSegmentTotal (name) {
      const total = this.platformTotal.filter(segment => {
        return segment.code === name
      })
      if (total.length > 0) {
        return Math.abs(parseFloat(total[0].value).toFixed(2))
      } else {
        return 0
      }
    },
    getPurchaseUnits () {
      return [
        {
          reference_id: this.$store.getters['cart/getCartToken'],
          // payment_instruction: '',
          description: 'Need to return an item? We accept returns for unused items in packaging 60 days after you order', // purchase description
          items: this.getProducts(),
          amount: this.getAmount(),
          shipping: this.getShippingAddress()
        }
      ]
    },
    getProducts () {
      let products = []
      this.$store.state.cart.cartItems.forEach(product => {
        products.push({
          name: product.name,
          unit_amount: {
            currency_code: this.currencyCode,
            value: product.price
          },
          tax: {
            currency_code: this.currencyCode,
            value: ''
            // optional tax already set in totals, this is not needed
            // value: (product.totals.price_incl_tax - product.totals.price).toFixed(2)
          },
          description: (product.options && product.options.length > 0) ? product.options.map((el) => { return el.value }).join(',') : '',
          quantity: product.qty,
          sku: product.sku,
          category: 'PHYSICAL_GOODS'
        })
      })
      return products
    },
    getBillingAddress () {
      return {
        address_line_1: this.paymentDetails.streetAddress,
        address_line_2: this.paymentDetails.apartmentNumber,
        admin_area_1: this.paymentDetails.region_code,
        admin_area_2: this.paymentDetails.city,
        postal_code: this.paymentDetails.zipCode,
        country_code: this.paymentDetails.country
      }
    },
    getShippingAddress () {
      return {
        name: {
          full_name: this.shippingDetails.firstName + ' ' + this.shippingDetails.lastName
        },
        address: {
          address_line_1: this.shippingDetails.streetAddress,
          address_line_2: this.shippingDetails.apartmentNumber,
          admin_area_1: this.shippingDetails.region_code,
          admin_area_2: this.shippingDetails.city,
          postal_code: this.shippingDetails.zipCode,
          country_code: this.shippingDetails.country
        }
      }
    },
    getAmount () {
      return {
        breakdown: {
          item_total: {
            currency_code: this.currencyCode,
            value: this.getSegmentTotal('subtotal')
          },
          shipping: {
            currency_code: this.currencyCode,
            value: this.getSegmentTotal('shipping')
          },
          discount: {
            currency_code: this.currencyCode,
            value: this.getSegmentTotal('discount')
          },
          tax_total: {
            currency_code: this.currencyCode,
            value: this.getSegmentTotal('tax')
          }
        },
        value: this.getSegmentTotal('grand_total'),
        currency_code: this.currencyCode
      }
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
