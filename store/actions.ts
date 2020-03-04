import { PaypalState } from '../types/PaypalState'
import { ActionTree } from 'vuex'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<PaypalState, any> = {
  complete({ }, params) {
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
  setExpressCheckout({ }, params) {
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
  }
}
