import { PaypalState } from '../types/PaypalState'
import { ActionTree } from 'vuex'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<PaypalState, any> = {
  complete ({}, params) {
    let url = config.paypal.endpoint.complete
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
