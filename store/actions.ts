import config from 'config'
import { PaypalState } from '../types/PaypalState'
import { ActionTree } from 'vuex'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'
import rootStore from '@vue-storefront/core/store'
import * as types from './mutation-types'

/**
 * Initiated from the PayPal Button when the user clicks
 */
export const actions: ActionTree<PaypalState, any> = {

  async createOrder ({ commit, dispatch }) {
    await dispatch('syncCartTotals')

    // Process the order
    const resp = await dispatch('processOrder')

    const result = resp.result
    if (result.success && result.hasOwnProperty('token')) {
      // This might be useful later:
      // console.log("Process order succeeeded, token is here", result.token);
      const tokenId = result.token
      commit(types.SET_PAYPAL_EXPRESS_TOKEN, tokenId)
      return tokenId
    } else {
      commit(types.SET_PAYPAL_MESSAGE, result.error.message)
      return false
    }
  },

  async syncCartTotals ({ getters }) {
    const shippingDetails = getters['getShippingDetails'] || {}
    await rootStore.dispatch('cart/syncTotals', {
      methodsData: {
        country: shippingDetails.country,
        zipCode: shippingDetails.zipCode,
        region: shippingDetails.region,
        region_id: shippingDetails.regionId,
        region_code: shippingDetails.regionCode,
        method_code: shippingDetails.shippingMethod,
        carrier_code: shippingDetails.shippingCarrier,
        payment_method: null
      },
      forceServerSync: true
    })
  },

  // Create order using Server Side methods same as magento 2...
  async processOrder ({ dispatch, getters }) {
    return await dispatch('setExpressCheckout', {
      cart_id: getters['cart/getCartToken'],
      brand_name: '',
      locale: getters['getLocale'],
      currency_code: getters['getCurrencyCode'],
      purchase_units: getters['getPurchaseUnits'],
      user_token: getters['user/getUserToken'],
      email: getters['getCustomerEmail'],
      return_url: 'https://www.paypal.com/checkoutnow/error',
      cancel_url: 'https://www.paypal.com/checkoutnow/error',
      total_type: 'EstimatedTotal',
      logo: ''
    })
  },

  setExpressCheckout (a, params) {
    let url = processURLAddress(config.paypal.endpoint.setExpressCheckout)
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(resp => { return resp.json() })
  },
  // Is this even used?
  complete (a, params) {
    let url = processURLAddress(config.paypal.endpoint.complete)
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(resp => { return resp.json() })
  },
}
