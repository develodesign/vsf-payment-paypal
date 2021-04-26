import config from 'config'
import { GetterTree } from 'vuex';
import { PaypalState } from '../types/PaypalState'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import i18n from '@vue-storefront/i18n'

export const getters: GetterTree<PaypalState, any> = {

  getToken: (state) => state.token,

  getMessage: (state) => state.message,

  getPlatformTotalSegments: (state, getters, rootState, rootGetters) => rootState.cart.getTotals,

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
      description: '',
      items: getters.getProducts,
      amount: rootGetters['cart/getTotals'],
      shipping: getters.getShippingAddress,
      phone: getters.getShippingDetails.phoneNumber
    }]
  },

  /**
   * I don't think this is needed anymore since we use 
   * amount: rootGetters['cart/getTotals'] to get the 
   * amounts.
   */
  getAmount: (state, getters, rootState, rootGetters) => {
    const getSegmentTotal = (name) => {
      const total = rootGetters.cart.getTotals.filter(segment => {
        return segment.code === name
      })
      return total.length > 0 ? Math.abs(parseFloat(total[0].value.toFixed(2))) : 0
    }
    const currencyCode = rootState.storeView.i18n.currencyCode
    const taxTotal = config.tax.finalPriceIncludesTax ? 0 : 0 // getSegmentTotal('tax')

    // TODO, this might need fixing.
    return {
      breakdown: {
        item_total: {
          currency_code: currencyCode,
          value: getSegmentTotal('subtotal_incl_tax') // was: subtotal
        },
        shipping: {
          currency_code: currencyCode,
          value: getSegmentTotal('shipping')
        },
        discount: {
          currency_code: currencyCode,
          value: 0 // getSegmentTotal('discount')
        },
        tax_total: {
          currency_code: currencyCode,
          value: getSegmentTotal('subtotal_incl_tax') // was: taxTotal
        }
      },
      value: getSegmentTotal('grand_total'),
      currency_code: currencyCode
    }
  },

  getProducts: (state, getters, rootState, rootGetters) => {
    console.log('Products Rootstate: ', rootState);

    //
    //
    //
    return rootState.cart.cartItems.map(product => {
      // At some point you might want to add taxes here:
      //const productPrice = config.tax.finalPriceIncludesTax ? totals.price_incl_tax : 123;
      const productPrice = product.price_incl_tax;
      return {
        name: product.name,
        unit_amount: {
          currency_code: rootState.storeView.i18n.currencyCode,
          value: productPrice
        },
        tax: {
          currency_code: rootState.storeView.i18n.currencyCode,
          value: ''
          // optional tax already set in totals, this is not needed
          // value: (product.totals.price_incl_tax - product.totals.price).toFixed(2)
        },
        description: (product.options && product.options.length > 0) ? product.options.map((el) => { return el.value }).join(',') : '',
        quantity: product.qty,
        product_id: product.id,
        sku: product.sku
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
    // Missing fields that you can get from shipping details:
    // - phoneNumber
    // - region_id
    // - shippingCarrier
    // - shippingMethod
    return {
      name: {
        first: `${shippingDetails.firstName}`,
        last: `${shippingDetails.lastName}`
      },
      address: {
        streetAddress: shippingDetails.streetAddress,
        streetAddress2: shippingDetails.apartmentNumber,
        state: shippingDetails.state,
        city: shippingDetails.city,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country
      }
    }
  }
}
