import { PaypalState } from '../types/PaypalState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<PaypalState, any> = {
  create ({}, transactions) {
    let url = config.paypal.endpoint.create
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transactions: transactions })
    }).then(resp => { return resp.json() })
      .then((resp) => {
        return resp.hasOwnProperty('id') ? resp.id : null
      })
  },
  // if you are using cache in your module it's a good practice to allow developers to choose either to use it or not
  execute ({}, params) {
    let url = config.paypal.endpoint.execute
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
