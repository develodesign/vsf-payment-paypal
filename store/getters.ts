import { GetterTree } from 'vuex';
import { PaypalState } from '../types/PaypalState'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import i18n from '@vue-storefront/i18n'

export const getters: GetterTree<PaypalState, any> = {

    getToken: (state) => state.token,

    getMessage: (state) => state.message,

    getPlatformTotalSegments: (state, getters, rootState, rootGetters) => rootState.cart.platformTotalSegments,

    getShippingDetails: (state, getters, rootState, rootGetters) => rootState.checkout.shippingDetails,

    getPaymentDetails: (state, getters, rootState, rootGetters) => rootState.checkout.paymentDetails,

    getCustomerEmail: (state, getters, rootState, rootGetters) => {
      return rootState.checkout.personalDetails.emailAddress
    },

    getCurrencyCode: () => {
      const storeView = currentStoreView()
      return storeView.i18n.currencyCode
    },

    // Converting to PayPal format
    getLocale: () => {
      const storeView = currentStoreView()
      return storeView.i18n.defaultLocale.replace('-', '_')
    },

    getPurchaseUnits: (state, getters, rootState, rootGetters) => {
      return [{
        reference_id: rootGetters['cart/getCartToken'],
        description: i18n.t('Need to return an item? We accept returns for unused items in packaging 60 days after you order'),
        items: getters.getProducts,
        amount: getters.getAmount,
        shipping: getters.getShippingAddress
      }]
    },

    getAmount: (state, getters, rootState, rootGetters) => {
      const getSegmentTotal = (name) => {
          const total = getters.getPlatformTotalSegments.filter(segment => {
            return segment.code === name
          })
          return total.length > 0 ? Math.abs(parseFloat(total[0].value.toFixed(2))) : 0
      }
      const currencyCode = rootState.storeView.i18n.currencyCode

      return {
        breakdown: {
          item_total: {
            currency_code: currencyCode,
            value: getSegmentTotal('subtotal')
          },
          shipping: {
            currency_code: currencyCode,
            value: getSegmentTotal('shipping')
          },
          discount: {
            currency_code: currencyCode,
            value: getSegmentTotal('discount')
          },
          tax_total: {
            currency_code: currencyCode,
            value: getSegmentTotal('tax')
          }
        },
        value: getSegmentTotal('grand_total'),
        currency_code: currencyCode
      }
    },

    getProducts: (state, getters, rootState, rootGetters) => {
      return rootState.cart.cartItems.map(product => {
        return {
          name: product.name,
          unit_amount: {
            currency_code: rootState.storeView.i18n.currencyCode,
            value: product.price
          },
          tax: {
            currency_code: rootState.storeView.i18n.currencyCode,
            value: ''
            // optional tax already set in totals, this is not needed
            // value: (product.totals.price_incl_tax - product.totals.price).toFixed(2)
          },
          description: (product.options && product.options.length > 0) ? product.options.map((el) => { return el.value }).join(',') : '',
          quantity: product.qty,
          sku: product.sku,
          category: 'PHYSICAL_GOODS'
        }
      })
    },

    getBillingAddress: (state, getters, rootState, rootGetters) => {
      const paymentDetails = getters.getPaymentDetails
      return {
        address_line_1: paymentDetails.streetAddress,
        address_line_2: paymentDetails.apartmentNumber,
        admin_area_1: paymentDetails.region_code,
        admin_area_2: paymentDetails.city,
        postal_code: paymentDetails.zipCode,
        country_code: paymentDetails.country
      }
    },

    getShippingAddress: (state, getters, rootState, rootGetters) => {
      const shippingDetails = getters.getShippingDetails
      return {
        name: {
          full_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`
        },
        address: {
          address_line_1: shippingDetails.streetAddress,
          address_line_2: shippingDetails.apartmentNumber,
          admin_area_1: shippingDetails.region_code,
          admin_area_2: shippingDetails.city,
          postal_code: shippingDetails.zipCode,
          country_code: shippingDetails.country
        }
      }
    }
}